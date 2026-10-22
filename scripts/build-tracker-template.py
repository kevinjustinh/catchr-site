"""Builds downloads/catchr-job-tracker-template.xlsx: the exact tracker Catchr makes.

Input is scripts/catchr-sheet-requests.json, the Google Sheets batchUpdate
requests the extension sends when it creates a new tracker (Jobs + Dashboard
tabs), captured by running the extension's own code:

    node scripts/capture-catchr-sheet.js ../catchr > scripts/catchr-sheet-requests.json
    python3 scripts/build-tracker-template.py        # needs openpyxl

Re-run both whenever the extension's sheet layout changes. Two adaptations so
the file is valid outside Google Sheets: open-ended ranges (F2:F) get an end
row, and repeat-down formats/formulas are written to JOB_ROWS rows. Google-only
functions (QUERY) are kept as-is; Excel shows those cells blank.
"""
import json
import re
from datetime import date
from pathlib import Path

from openpyxl import Workbook
from openpyxl.formatting.rule import CellIsRule, FormulaRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

HERE = Path(__file__).resolve().parent
REQ = json.loads((HERE / "catchr-sheet-requests.json").read_text())
OUT = HERE.parent / "downloads" / "catchr-job-tracker-template.xlsx"
JOB_ROWS = 1000  # a new Google Sheet's default height
END_ROW = JOB_ROWS

EXAMPLES = [  # sample rows only; the sheet Catchr creates starts empty
    ["Example Co", "Remote", "Product Manager", "https://example.com/jobs/1", "yes",
     date(2026, 10, 1), date(2026, 10, 9), None, "Interview", "no", 82, "Example row. Delete it."],
    ["Sample Labs", "New York, NY", "Operations Lead", "https://example.com/jobs/2", "yes",
     date(2026, 10, 6), None, None, "Unresponsive", "no", 71, "Example row. Delete it."],
    ["Demo Inc", "Austin, TX", "Customer Success Manager", "https://example.com/jobs/3", "no",
     None, None, None, None, None, 64, "Example row. Delete it."],
]


def hexcolor(c):
    return "%02X%02X%02X" % tuple(round(c.get(k, 0) * 255) for k in ("red", "green", "blue"))


def excel_formula(f):
    # 'Jobs'!F2:F -> 'Jobs'!F2:F1000 (Excel has no open-ended ranges)
    return re.sub(r"(\$?[A-Z]{1,2}\$?\d+):(\$?[A-Z]{1,2})(?![\w$])", lambda m: f"{m.group(1)}:{m.group(2)}{END_ROW}", f)


def shift_rows(f, delta):
    # Moves relative refs down by delta rows, as a Sheets repeatCell would.
    return re.sub(r"(?<![$\w'!])([A-Z]{1,2})(\d+)(?![\w(])", lambda m: f"{m.group(1)}{int(m.group(2)) + delta}", f)


def bounds(rng, ws_rows, ws_cols):
    return (rng.get("startRowIndex", 0), rng.get("endRowIndex", ws_rows),
            rng.get("startColumnIndex", 0), rng.get("endColumnIndex", ws_cols))


def number_format(nf):
    if not nf:
        return None
    if nf.get("type") == "TEXT":
        return "@"
    return nf.get("pattern")


def apply_format(cell, fmt):
    if not fmt:
        return
    if "backgroundColor" in fmt:
        cell.fill = PatternFill("solid", fgColor=hexcolor(fmt["backgroundColor"]))
    tf = fmt.get("textFormat")
    if tf:
        f = cell.font
        cell.font = Font(
            name=tf.get("fontFamily", f.name), size=tf.get("fontSize", f.size),
            bold=tf.get("bold", f.bold), italic=tf.get("italic", f.italic),
            color=hexcolor(tf["foregroundColor"]) if "foregroundColor" in tf else f.color,
        )
    h, v = fmt.get("horizontalAlignment"), fmt.get("verticalAlignment")
    if h or v:
        a = cell.alignment
        cell.alignment = Alignment(
            horizontal=h.lower() if h else a.horizontal,
            vertical={"MIDDLE": "center"}.get(v, v.lower()) if v else a.vertical,
            wrap_text=a.wrap_text,
        )
    nf = number_format(fmt.get("numberFormat"))
    if nf:
        cell.number_format = nf


def set_value(cell, uev):
    if not uev:
        return
    if "formulaValue" in uev:
        cell.value = excel_formula(uev["formulaValue"])
    elif "stringValue" in uev:
        cell.value = uev["stringValue"]
    elif "numberValue" in uev:
        cell.value = uev["numberValue"]


def side(spec):
    style = {"SOLID": "thin", "SOLID_MEDIUM": "medium", "SOLID_THICK": "thick"}.get(spec["style"], "thin")
    return Side(style=style, color=hexcolor(spec.get("color", {})))


def conditional_rule(cond, fmt, top):
    vals = [v["userEnteredValue"] for v in cond.get("values", [])]
    fill = PatternFill("solid", fgColor=hexcolor(fmt["backgroundColor"])) if "backgroundColor" in fmt else None
    tf = fmt.get("textFormat", {})
    font = Font(color=hexcolor(tf["foregroundColor"])) if "foregroundColor" in tf else None
    t = cond["type"]
    if t == "TEXT_EQ":
        return CellIsRule(operator="equal", formula=[f'"{vals[0]}"'], fill=fill, font=font)
    if t == "TEXT_CONTAINS":
        return FormulaRule(formula=[f'NOT(ISERROR(SEARCH("{vals[0]}",{top})))'], fill=fill, font=font)
    if t == "NUMBER_GREATER_THAN_EQ":
        return CellIsRule(operator="greaterThanOrEqual", formula=[vals[0]], fill=fill, font=font)
    if t == "NUMBER_LESS":
        return CellIsRule(operator="lessThan", formula=[vals[0]], fill=fill, font=font)
    if t == "NUMBER_BETWEEN":
        return CellIsRule(operator="between", formula=vals[:2], fill=fill, font=font)
    raise ValueError(f"unhandled condition {t}")


def apply(ws, requests, rows, cols):
    merges = []
    for req in requests:
        (kind, body), = req.items()
        if kind == "updateCells" and "start" in body:
            s = body["start"]
            for ri, row in enumerate(body.get("rows", [])):
                for ci, val in enumerate(row.get("values", [])):
                    cell = ws.cell(row=s.get("rowIndex", 0) + ri + 1, column=s.get("columnIndex", 0) + ci + 1)
                    set_value(cell, val.get("userEnteredValue"))
                    apply_format(cell, val.get("userEnteredFormat"))
        elif kind == "repeatCell":
            r1, r2, c1, c2 = bounds(body["range"], rows, cols)
            spec = body["cell"]
            uev = spec.get("userEnteredValue")
            for r in range(r1, r2):
                for c in range(c1, c2):
                    cell = ws.cell(row=r + 1, column=c + 1)
                    if uev and "formulaValue" in uev:
                        cell.value = excel_formula(shift_rows(uev["formulaValue"], r - r1))
                    apply_format(cell, spec.get("userEnteredFormat"))
        elif kind == "updateDimensionProperties":
            rng, px = body["range"], body["properties"]["pixelSize"]
            for i in range(rng["startIndex"], rng["endIndex"]):
                if rng["dimension"] == "COLUMNS":
                    ws.column_dimensions[get_column_letter(i + 1)].width = round(px / 7, 2)
                else:
                    ws.row_dimensions[i + 1].height = round(px * 0.75, 2)
        elif kind == "updateSheetProperties":
            gp = body["properties"].get("gridProperties", {})
            if gp.get("frozenRowCount"):
                ws.freeze_panes = ws.cell(row=gp["frozenRowCount"] + 1, column=1)
            if gp.get("hideGridlines"):
                ws.sheet_view.showGridLines = False
        elif kind == "setDataValidation":
            r1, r2, c1, c2 = bounds(body["range"], rows, cols)
            values = [v["userEnteredValue"] for v in body["rule"]["condition"]["values"]]
            dv = DataValidation(type="list", formula1='"' + ",".join(values) + '"', allow_blank=True)
            dv.add(f"{get_column_letter(c1 + 1)}{r1 + 1}:{get_column_letter(c2)}{r2}")
            ws.add_data_validation(dv)
        elif kind == "addConditionalFormatRule":
            rule = body["rule"]
            for rng in rule["ranges"]:
                r1, r2, c1, c2 = bounds(rng, rows, cols)
                ref = f"{get_column_letter(c1 + 1)}{r1 + 1}:{get_column_letter(c2)}{r2}"
                br = rule["booleanRule"]
                ws.conditional_formatting.add(ref, conditional_rule(br["condition"], br["format"], f"{get_column_letter(c1 + 1)}{r1 + 1}"))
        elif kind == "updateBorders":
            r1, r2, c1, c2 = bounds(body["range"], rows, cols)
            for r in range(r1, r2):
                for c in range(c1, c2):
                    cell = ws.cell(row=r + 1, column=c + 1)
                    b = cell.border
                    cell.border = Border(
                        top=side(body["top"]) if "top" in body and r == r1 else b.top,
                        bottom=side(body["bottom"]) if "bottom" in body and r == r2 - 1 else b.bottom,
                        left=side(body["left"]) if "left" in body and c == c1 else b.left,
                        right=side(body["right"]) if "right" in body and c == c2 - 1 else b.right,
                    )
        elif kind == "setBasicFilter":
            r1, r2, c1, c2 = bounds(body["filter"]["range"], rows, cols)
            ws.auto_filter.ref = f"{get_column_letter(c1 + 1)}{r1 + 1}:{get_column_letter(c2)}{r2}"
        elif kind == "mergeCells":
            r1, r2, c1, c2 = bounds(body["range"], rows, cols)
            merges.append((r1 + 1, c1 + 1, r2, c2))
        elif kind in ("updateCells", "unmergeCells"):
            pass  # clearing a fresh tab: nothing to clear
        else:
            raise ValueError(f"unhandled request {kind}")
    for r1, c1, r2, c2 in merges:
        if r2 > r1 or c2 > c1:
            ws.merge_cells(start_row=r1, start_column=c1, end_row=r2, end_column=c2)


wb = Workbook()
jobs = wb.active
jobs.title = "Jobs"
apply(jobs, REQ["jobs"], JOB_ROWS, len(REQ["headers"]))
for r, values in enumerate(EXAMPLES, start=2):
    for c, v in enumerate(values, start=1):
        if v is not None:
            cell = jobs.cell(row=r, column=c, value=v)
            if isinstance(v, date):
                cell.number_format = "m/d/yyyy"

dash = wb.create_sheet("Dashboard")
apply(dash, REQ["dashboard"], 80, 20)

OUT.parent.mkdir(parents=True, exist_ok=True)
wb.save(OUT)
print(f"wrote {OUT}")
