# claude-code-figma-mcp

Motion-graphics video promoting the FlowHunt blog post **"How to Use Claude Code with Figma MCP: A Complete Setup Guide"**. Built with [rendervid-engine](https://github.com/Tekventedor/rendervid-engine).

Visual-first style, modeled after `mcp-in-action`: bold typography, gradient highlights, paired-pane choreography with narrator pills, morph hand-offs, FlowHunt CTA card.

- **Runtime:** ~50s
- **Resolution:** 1920×1080 @ 30fps
- **Source blog:** `source-blog.md`
- **Scene script:** `spec.md`

## Scenes

| # | Name | Frames | Runtime | Purpose |
|---|------|--------|---------|---------|
| 1 | Hook        | 0–120     | 4s  | "Claude Code reads Figma." headline w/ underline draw |
| 2 | Pivot       | 120–210   | 3s  | "Figma MCP" title card, "MCP" in gradient |
| 3 | Pairing     | 210–780   | 19s | Figma canvas (left) + Claude Code → MCP → React code (right). Narrator pills, terminal-to-editor morph |
| 4 | Reveal      | 780–1200  | 14s | Figma original vs running React component. "Pixel-perfect. First try." stamp |
| 5 | CTA         | 1200–1500 | 10s | FlowHunt lockup, blog title, "Read the guide →" pill |

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
