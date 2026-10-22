"""Builds downloads/catchr-resume-template.docx.

Shaped for applicant tracking systems and for Catchr's Tailor feature (see the
extension's background.js tailor prompt and applyBulletReorders):
- one column, no tables, text boxes or images;
- each job is one unique heading line "Title, Company<TAB>dates", so Tailor can
  find that job's bullets and reorder them (its matcher folds the tab to a space);
- real one-level bullets; skills as "Category: item, item" (Tailor edits only
  after the colon); the summary is a single paragraph.

Run: python3 scripts/build-resume-template.py  (needs python-docx)
"""
from pathlib import Path

from docx import Document
from docx.enum.text import WD_TAB_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor

OUT = Path(__file__).resolve().parent.parent / "downloads" / "catchr-resume-template.docx"
FONT = "Lato"
INK = RGBColor(0x2C, 0x2C, 0x2A)
STONE = RGBColor(0x5E, 0x56, 0x4C)  # darker than the site's stone: stays legible printed or scanned
FOREST = RGBColor(0x2C, 0x5F, 0x4A)

doc = Document()
for s in doc.sections:
    s.top_margin = s.bottom_margin = s.left_margin = s.right_margin = Inches(0.75)

normal = doc.styles["Normal"]
normal.font.name = FONT
normal.font.size = Pt(10.5)
normal.font.color.rgb = INK
normal.element.rPr.rFonts.set(qn("w:eastAsia"), FONT)
normal.paragraph_format.space_after = Pt(0)
normal.paragraph_format.line_spacing = 1.15
bullet_style = doc.styles["List Bullet"]
bullet_style.font.name = FONT
bullet_style.paragraph_format.space_after = Pt(2)


def para(text="", size=None, bold=False, color=None, after=0, before=0, caps=False, spacing=None):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(after)
    p.paragraph_format.space_before = Pt(before)
    if text:
        r = p.add_run(text)
        r.bold = bold
        if size:
            r.font.size = Pt(size)
        if color:
            r.font.color.rgb = color
        if caps:
            r.font.all_caps = True
        if spacing:
            rpr = r._element.get_or_add_rPr()
            sp = OxmlElement("w:spacing")
            sp.set(qn("w:val"), str(spacing))
            rpr.append(sp)
    return p


def rule_below(p):
    ppr = p._p.get_or_add_pPr()
    bdr = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    for k, v in (("val", "single"), ("sz", "6"), ("space", "2"), ("color", "B8C9BF")):
        bottom.set(qn(f"w:{k}"), v)
    bdr.append(bottom)
    ppr.append(bdr)


def heading(text):
    # A real Heading 2 (outline, screen readers), restyled to match the page.
    p = doc.add_paragraph(style="Heading 2")
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(6)
    r = p.add_run(text)
    r.bold, r.font.all_caps, r.font.size = True, True, Pt(11)
    r.font.name, r.font.color.rgb = FONT, FOREST
    r._element.get_or_add_rPr().get_or_add_rFonts().set(qn("w:ascii"), FONT)
    sp = OxmlElement("w:spacing")
    sp.set(qn("w:val"), "20")
    r._element.get_or_add_rPr().append(sp)
    rule_below(p)


def bullet(text):
    p = doc.add_paragraph(text, style="List Bullet")
    p.paragraph_format.space_after = Pt(2)


def job(title, dates, where):
    p = para(before=8)
    p.paragraph_format.tab_stops.add_tab_stop(Inches(7.0), WD_TAB_ALIGNMENT.RIGHT)
    p.add_run(title).bold = True
    p.add_run("\t" + dates)
    para(where, color=STONE, size=10, after=3)


para("Alex Morgan", size=22, bold=True, after=2)
para("Austin, TX · alex.morgan@example.com · (555) 010-0147 · linkedin.com/in/alexmorgan",
     size=10, color=STONE, after=4)

heading("Summary")
para("Product manager with 6 years of experience shipping B2B software, most recently leading a team "
     "of 8 that grew self-serve revenue 40%. Strongest where customer research, data and engineering "
     "meet. Replace this with two or three sentences: who you are, your best result, and the kind of "
     "role you want next.")

heading("Experience")
job("Senior Product Manager, Brightline Software", "Mar 2022 to Present", "Austin, TX · Remote-first")
bullet("Led the redesign of self-serve onboarding, lifting trial-to-paid conversion from 9% to 14% in two quarters.")
bullet("Built a weekly customer interview program (120+ interviews) that set the roadmap for three product lines.")
bullet("Cut average release cycle from 6 weeks to 2 by introducing feature flags with engineering.")
bullet("Start each bullet with a strong verb, include a number, and end with the result it produced.")

job("Product Manager, Fieldnote", "Jun 2019 to Feb 2022", "Denver, CO")
bullet("Launched a mobile app used by 30,000 field technicians, reaching a 4.7 App Store rating.")
bullet("Partnered with sales on pricing research that raised average contract value 18%.")
bullet("Wrote specs and acceptance criteria for a team of 6 engineers and 1 designer.")

job("Associate Product Manager, Fieldnote", "Jul 2018 to May 2019", "Denver, CO")
bullet("Ran 40+ A/B tests on the signup flow; shipped the 5 winners, adding 2,100 signups a month.")
bullet("Give every job its own line like the one above, even at the same company, so each one is unique.")

heading("Skills")
for cat, items in (("Product", "Roadmapping, customer research, A/B testing, pricing, PRDs"),
                   ("Tools", "Jira, Figma, Amplitude, SQL, Looker"),
                   ("Ways of working", "Cross-functional leadership, stakeholder communication, mentoring")):
    p = para(after=2)
    r = p.add_run(f"{cat}: ")
    r.bold = True
    p.add_run(items)

heading("Education")
p = para()
p.paragraph_format.tab_stops.add_tab_stop(Inches(7.0), WD_TAB_ALIGNMENT.RIGHT)
p.add_run("B.S. Business Administration, University of Colorado Boulder").bold = True
p.add_run("\tMay 2018")

OUT.parent.mkdir(parents=True, exist_ok=True)
doc.save(OUT)
print(f"wrote {OUT}")
