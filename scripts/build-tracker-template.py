"""Builds downloads/catchr-job-tracker-template.xlsx.

The columns, dropdowns and colours mirror the sheet the Catchr extension
creates (CATCHR_HEADERS and formatNewSheet in the extension's background.js),
so a sheet started from this template can be connected to Catchr later.

Run: python3 scripts/build-tracker-template.py  (needs openpyxl)
"""
from datetime import date
from pathlib import Path

from openpyxl import Workbook
from openpyxl.formatting.rule import CellIsRule, FormulaRule
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.worksheet.datavalidation import DataValidation

OUT = Path(__file__).resolve().parent.parent / "downloads" / "catchr-job-tracker-template.xlsx"
ROWS = 500  # rows pre-filled with the Days in Between formula and dropdowns

HEADERS = ["Company", "Location", "Position", "Link", "Applied?", "Date Applied",
           "Response Date", "Days in Between", "Outcome", "Offer?", "Fit Score", "Notes"]
WIDTHS = [160, 120, 180, 200, 70, 110, 120, 130, 130, 65, 80, 240]
OUTCOMES = ["Unresponsive", "Interview", "Offer Received", "Rejection", "Withdrawn"]
OUTCOME_FILLS = {
    "Offer Received": "6BA751", "Interview": "A4D6FA", "Rejection": "EA9999",
    "Unresponsive": "D9D2C8", "Withdrawn": "FCDD9E",
}
FOREST, CREAM = "2C5F4A", "FDFAF6"

EXAMPLES = [
    ["Example Co", "Remote", "Product Manager", "https://example.com/jobs/1", "yes",
     date(2026, 10, 1), date(2026, 10, 9), None, "Interview", "no", 82, "Example row. Delete it."],
    ["Sample Labs", "New York, NY", "Operations Lead", "https://example.com/jobs/2", "yes",
     date(2026, 10, 6), None, None, "Unresponsive", "no", 71, "Example row. Delete it."],
    ["Demo Inc", "Austin, TX", "Customer Success Manager", "https://example.com/jobs/3", "no",
     None, None, None, None, None, 64, "Example row. Delete it."],
]


def px_to_width(px):
    return round(px / 7, 1)


wb = Workbook()
ws = wb.active
ws.title = "Jobs"

header_font = Font(bold=True, color=CREAM, size=10)
header_fill = PatternFill("solid", fgColor=FOREST)
for col, (name, px) in enumerate(zip(HEADERS, WIDTHS), start=1):
    cell = ws.cell(row=1, column=col, value=name)
    cell.font, cell.fill = header_font, header_fill
    cell.alignment = Alignment(vertical="center")
    ws.column_dimensions[cell.column_letter].width = px_to_width(px)
ws.row_dimensions[1].height = 22
ws.freeze_panes = "A2"

for r, values in enumerate(EXAMPLES, start=2):
    for c, v in enumerate(values, start=1):
        if v is not None:
            ws.cell(row=r, column=c, value=v)

center = Alignment(horizontal="center")
for r in range(2, ROWS + 2):
    ws.cell(row=r, column=8, value=f'=IF(AND(F{r}<>"",G{r}<>""),G{r}-F{r},"")').number_format = "0"
    for c in (6, 7):
        ws.cell(row=r, column=c).number_format = "yyyy-mm-dd"
    for c in range(5, 12):
        ws.cell(row=r, column=c).alignment = center

last = ROWS + 1
yes_no = DataValidation(type="list", formula1='"yes,no"', allow_blank=True)
outcome = DataValidation(type="list", formula1='"' + ",".join(OUTCOMES) + '"', allow_blank=True)
for dv, ref in ((yes_no, f"E2:E{last}"), (outcome, f"I2:I{last}")):
    dv.add(ref)
    ws.add_data_validation(dv)
yes_no.add(f"J2:J{last}")

white = Font(color="FFFFFF")
for col in ("E", "J"):
    rng = f"{col}2:{col}{last}"
    ws.conditional_formatting.add(rng, CellIsRule(operator="equal", formula=['"yes"'],
                                  fill=PatternFill("solid", fgColor="11734B"), font=white))
    ws.conditional_formatting.add(rng, CellIsRule(operator="equal", formula=['"no"'],
                                  fill=PatternFill("solid", fgColor="B10202"), font=white))
for value, color in OUTCOME_FILLS.items():
    ws.conditional_formatting.add(f"I2:I{last}", CellIsRule(operator="equal", formula=[f'"{value}"'],
                                  fill=PatternFill("solid", fgColor=color)))

# Summary tab: plain COUNTIFS, so it works the same in Google Sheets and Excel.
sm = wb.create_sheet("Summary")
sm.column_dimensions["A"].width = 44
sm.column_dimensions["B"].width = 14
title = sm.cell(row=1, column=1, value="Your job search at a glance")
title.font = Font(bold=True, size=14, color=FOREST)
J = f"Jobs!$A$2:$A${last}"
rows = [
    ("Jobs tracked", f'=COUNTA({J})', "0"),
    ("Applied", f'=COUNTIF(Jobs!$E$2:$E${last},"yes")', "0"),
    ("Responses", f'=COUNT(Jobs!$G$2:$G${last})', "0"),
    ("Response rate", f'=IFERROR(B5/B4,0)', "0%"),
    ("Interviews", f'=COUNTIF(Jobs!$I$2:$I${last},"Interview")', "0"),
    ("Offers", f'=COUNTIF(Jobs!$J$2:$J${last},"yes")', "0"),
    ("Rejections", f'=COUNTIF(Jobs!$I$2:$I${last},"Rejection")', "0"),
    ("Follow up now (applied 7 to 14 days ago, no reply)",
     f'=COUNTIFS(Jobs!$E$2:$E${last},"yes",Jobs!$G$2:$G${last},"",Jobs!$F$2:$F${last},"<="&(TODAY()-7),Jobs!$F$2:$F${last},">="&(TODAY()-14))', "0"),
    ("Probably ghosted (no reply after 14+ days)",
     f'=COUNTIFS(Jobs!$E$2:$E${last},"yes",Jobs!$G$2:$G${last},"",Jobs!$F$2:$F${last},"<"&(TODAY()-14))', "0"),
]
for i, (label, formula, fmt) in enumerate(rows, start=3):
    sm.cell(row=i, column=1, value=label)
    c = sm.cell(row=i, column=2, value=formula)
    c.number_format = fmt
    c.font = Font(bold=True)
    c.alignment = Alignment(horizontal="right")
sm.cell(row=13, column=1, value="Made by Catchr, the free Chrome extension that fills this in for you: jobcatchr.app").font = Font(italic=True, color="8C7E6E")

OUT.parent.mkdir(parents=True, exist_ok=True)
wb.save(OUT)
print(f"wrote {OUT}")
