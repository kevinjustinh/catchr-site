# Claude Design Prompt — Catchr Landing Page

> Paste the prompt below into Claude Design. **Also attach** the four product
> screenshots + logo from `reference-images/` and the `BRAND.md` file. The captions
> in `reference-images.md` tell you which image goes where.

---

## PROMPT (copy everything below this line)

Build a single-page, production-grade marketing landing page for **Catchr**, a
Chrome extension for job seekers. Output one self-contained, responsive HTML file
(inline CSS, mobile-first). The goal of the page is **installs** — the primary call
to action everywhere is **"Add to Chrome."**

I've attached a brand guide (`BRAND.md`) and reference images. Follow the brand guide
exactly — this is non-negotiable. The aesthetic is **"Verdant Archive": calm,
editorial, museum-like.** Deep forest green + warm cream/parchment + a single mint
accent. Generous whitespace. No generic-AI gradients, no neon, no glow, no dark "tech"
mode. It should feel quietly premium and inevitable, not hype-y.

### Positioning (important)
Catchr is an **AI copilot for your job hunt.** The **AI features are the headline**;
one-click "catching" is the effortless on-ramp. Lead with the AI payoff: *know if
you're a fit, tailor your resume, walk in prepared.* Of the three AI features, **Check
Fit leads** — give it the most prominent feature treatment.

### Type & color
- Headlines: **Bricolage Grotesque** (heavy weights). Body/UI: **Work Sans.** Load both
  from Google Fonts. Never use Inter/Roboto/Arial/system-ui.
- Use the exact palette in `BRAND.md`. Forest + cream do the heavy lifting; mint is the
  one rare accent. Feature sections use their matching accent: Check Fit = sage `#7A8C5A`,
  Tailor Resume = mauve `#8C5E72`, Interview Prep = slate `#4A6580`.

### Page structure (top to bottom)
1. **Sticky nav** — Catchr logo (net mark, attached) + wordmark on the left; on the
   right, minimal links (Features, How it works, Privacy) and a prominent
   **"Add to Chrome"** button. Forest or cream bar; keep it light.

2. **Hero** — forest-green background. Eyebrow label `CATCHR FOR CHROME`. One bold
   Bricolage headline that sells the AI payoff (e.g. *"Apply smarter, not harder"* or
   *"Your AI copilot for the job hunt"* — pick the strongest). One-line subhead. Primary
   **"Add to Chrome"** button + a quiet secondary link ("See how it works"). To the side,
   the floating product popup shot (`01-catch.png`). Optional: a tiny "free forever" note.

3. **The AI features — the centerpiece.** Introduce with a short section header making
   clear these three tools are why Catchr exists. Then present the three features, each
   pairing its attached screenshot with a headline + 2–3 line description + a small set
   of supporting bullets. Use the reusable copy I provide below. **Order and emphasis:**
   - **Check Fit** (lead, largest treatment) → `02-check-fit.png`
   - **Tailor Resume** → `03-tailor-resume.png`
   - **Interview Prep** → `04-interview-prep.png`
   Each feature gets its accent color as a subtle tag/icon/section tint — never loud.

4. **The on-ramp ("…and it all starts with one click").** A calmer section showing the
   catch action (`01-catch.png` if not used in hero): catch any job from LinkedIn,
   Greenhouse, Lever, Wellfound, Ashby → auto-logged to *your* Google Sheet. Frame this
   as the effortless capture step that feeds the AI tools.

5. **How it works — 3 steps.** Install → Click Catchr on any job listing → Get your fit
   score, tailored resume, and prep doc. Simple numbered steps, lots of air.

6. **Privacy / trust.** Short, reassuring: your data lives in *your* Google Sheet and
   Google Drive — Catchr doesn't hoard your information. Calm and credible, no fine print.

7. **Final CTA.** Forest band, one confident line, big **"Add to Chrome."**

8. **Footer.** Minimal — logo, one-line tagline, a couple of links, "free forever."

### Reusable copy (already written, on-brand — use or lightly adapt)
- **Check Fit** — *"Know your fit before you apply."* Get an instant AI score that breaks
  down how well your background matches the role. Bullets: Skills, experience & soft
  skills scored · Pinpoints your gaps clearly · Calibrated — not inflated.
- **Tailor Resume** — *"Tailor your resume in seconds."* AI rewrites your resume bullets
  to match the job — surgical edits, no hallucinations, highlighted in yellow. Bullets:
  Copies your Google Doc resume · Rewrites bullets to match the JD · Highlights every change.
- **Interview Prep** — *"Walk into every interview ready."* Generate a tailored prep doc
  in seconds — role-specific questions and talking points drawn from your resume. Bullets:
  Role-specific questions · Talking points from your resume · Saved to your Google Drive.
- **Catch** — *"Catch any job in one click."* Automatically log job listings to your Google
  Sheet — from LinkedIn, Greenhouse, Lever, and beyond.

### Images
Place the attached screenshots where indicated above. They are already styled in the
brand aesthetic (floating popup card on a solid color field) — preserve that look; don't
add heavy frames, browser chrome, or drop-shadows beyond a soft one. If you need an image
you don't have, leave a clearly-labeled placeholder `<img>` with a comment naming what
belongs there — do not invent unrelated stock imagery.

### Quality bar
- Mobile-first and fully responsive; check the hero, feature rows, and CTA at narrow widths.
- Real visual hierarchy — one dominant headline per section, disciplined spacing on an 8px
  rhythm.
- Accessible color contrast, semantic HTML, `alt` text on every image.
- No placeholder lorem ipsum in final copy — use the copy above.
- Make it feel calm, meticulous, and inevitable. If a section feels busy, cut, don't add.

Deliver the complete HTML file.
