# Claude Code × Figma MCP — Video Script

**Total runtime:** ~95s (matches the 103s recording with a small tail)
**Tone:** Confident, declarative, no fluff. FlowHunt house voice — short sentences, one idea per line.
**Voice direction:** Dry, slightly fast. Land each punchline. No upspeak.

---

## Scene 1 — Hook (0:00 – 0:08)

**On-screen B-roll:** Browser, Figma community, "data visual" search auto-completing.

**VO:**
> A designer hands you a Figma file.
> Used to mean an afternoon of pixel-pushing in code.
> Not anymore.

---

## Scene 2 — Open the design (0:08 – 0:20)

**B-roll:** Figma file opens. Cover frame visible — "Data Visualization Graphs / Charts Kit", chart cards collage on the right.

**VO:**
> This is the frame I want in my app.
> Real layout. Real type. Real colors.
> I'm not going to recreate it. I'm going to *read* it — with Claude Code.

---

## Scene 3 — Hand the URL to Claude Code (0:20 – 0:30)

**B-roll:** Cut to the split-screen — Figma on the left, Claude Code terminal on the right *(hero PNG sits here as the static cut-in if you want one)*.

**On-screen overlay (optional):**
> `figma MCP → get_design_context`

**VO:**
> One prompt. One URL. One MCP tool.
> Claude Code talks straight to Figma.
> No export. No copy-paste. No screenshots.

---

## Scene 4 — Design context dump (0:30 – 0:48)

**B-roll:** Terminal scrolling the design-context output *(design-context PNG = the freeze-frame).*

**On-screen call-outs (sequential, sync with VO beats):**
> Layout · Typography · Colors · Spacing · Badges · Cards

**VO:**
> Here's what Claude reads back.
> Background hex. Title sizes. Leading. Borders. Radius. Every gap.
> The whole design — as structured data the model can act on.

---

## Scene 5 — Generation (0:48 – 1:08)

**B-roll:** Cut back to terminal. `Write(src/Cover.jsx) — Wrote 252 lines`. Then `npm install`, `vite build`, dev server boot *(generated-code PNG = the freeze-frame).*

**On-screen overlay:**
> React · Tailwind · Vite — scaffolded & built

**VO:**
> Then it builds.
> A full Vite project. React component. Tailwind classes.
> Spacing, colors, typography — preserved exactly, because it was never guessed.

---

## Scene 6 — Reveal (1:08 – 1:22)

**B-roll:** Browser at `localhost:5173` showing the rendered cover, side by side with the Figma original.

**On-screen overlay:**
> **Pixel-perfect. First try.**

**VO:**
> Side by side: the design, and the running React component.
> No fix-ups. No second pass.
> One prompt got us here.

---

## Scene 7 — Outro / CTA (1:22 – 1:35)

**On-screen, large type, gradient highlight on "Figma":**
> **Claude Code reads Figma.**
> Try it on your next handoff.

**Small line below:**
> claude.ai/code  ·  figma.com/mcp

**VO:**
> Claude Code. Figma MCP.
> Stop translating designs — start running them.

---

## Notes for the editor

- **Hero shot** (`claude-code-figma-mcp-hero.png`) lands at the start of Scene 3, held ~1.5s while the VO says "One prompt. One URL. One MCP tool."
- **Design-context shot** (`claude-code-figma-mcp-design-context.png`) covers Scene 4 entirely; the call-outs (Layout / Typography / Colors / etc.) animate in on the actual lines visible in the screenshot.
- **Generated-code shot** (`claude-code-figma-mcp-generated-code.png`) holds the second half of Scene 5 while Vite output ticks past.
- Cuts are hard, not crossfades — except Scene 6 → Scene 7 (gentle fade-to-white).
- Music: low-energy synth bed, sub-90 BPM, one rise into Scene 6's reveal beat. No lyrics.
