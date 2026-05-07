# claude-code-figma-mcp

Motion-graphics video promoting the FlowHunt blog post **"How to Use Claude Code with Figma MCP: A Complete Setup Guide"**. Built with [rendervid-engine](https://github.com/Tekventedor/rendervid-engine).

- **Runtime:** ~95s
- **Resolution:** 1920×1080 @ 30fps
- **Source blog:** `source-blog.md`
- **Scene script:** `spec.md`

## Scenes

| # | Name | Frames | Runtime | Purpose |
|---|------|--------|---------|---------|
| 1 | Hook | 0–240 | 8s | "A designer hands you a Figma file…" — set the problem |
| 2 | Open the design | 240–600 | 12s | Figma file with the data-viz cover frame |
| 3 | Hand the URL to Claude Code | 600–900 | 10s | Split-screen: Figma URL → Claude Code prompt |
| 4 | Design context dump | 900–1440 | 18s | Terminal scrolling structured design data |
| 5 | Generation | 1440–2040 | 20s | Write file → npm install → vite build |
| 6 | Reveal | 2040–2460 | 14s | Side-by-side: Figma vs running React component |
| 7 | Outro / CTA | 2460–2850 | 13s | "Claude Code reads Figma." |

## Working with this project

```bash
# Edit the source of truth
$EDITOR build.mjs

# Regenerate template.json
node build.mjs

# Reload the playground (http://localhost:5180/) — click Load,
# pick this folder's template.json
```

When the user says "render":

```bash
node render.mjs
ffmpeg -i output/claude-code-figma-mcp.mp4 -vf "fps=12,scale=720:-1:flags=lanczos" -loop 0 preview.gif
```
