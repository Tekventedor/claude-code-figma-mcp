+++
title = "How to Use Claude Code with Figma MCP: A Complete Setup Guide"
linkbuilding = [ "claude code figma mcp", "figma mcp claude code setup", "design to code claude code", "claude code mcp server install", "figma mcp install claude", "claude mcp add figma", "claude code design system", "figma dev mode mcp", "claude code figma plugin", "figma remote mcp server" ]
keywords = [ "claude code", "figma mcp", "design to code", "mcp server", "claude mcp add figma", "figma dev mode", "code connect", "ai design implementation" ]
description = "Connect Claude Code to the Figma MCP server and turn design files into production code without leaving your terminal. Learn how to install the remote server, pull design context from a frame URL, generate code that matches your design system, and write changes back to the Figma canvas."
image = "/images/blog/claude-code-figma-mcp-hero.png"
shortDescription = "A step-by-step guide to installing and using the Figma MCP server with Claude Code for design-to-code workflows, design system consistency, and AI-driven UI implementation."
tags = [ "Claude Code", "Figma", "MCP", "Model Context Protocol", "Design to Code", "Dev Mode", "Developer Tools", "AI Agents" ]
blog-categories = ["Automation and Workflows"]
showCTA = true
ctaHeading = "Ship Designs Faster With Claude Code Today"
ctaDescription = "Stop eyeballing pixel values and rebuilding components from scratch. Plug Figma MCP into Claude Code and let your terminal turn frames into code."
ctaPrimaryText = "Try Claude Code"
ctaPrimaryURL = "https://www.claude.com/product/claude-code"
ctaSecondaryText = "Read the Docs"
ctaSecondaryURL = "https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server"
author = ""
date = "2026-04-23 09:00:00"
[[faq]]
question = "What is the Figma MCP server and why use it with Claude Code?"
answer = "The Figma MCP server is an official Model Context Protocol server from Figma that gives any MCP-compatible client — including Claude Code — direct access to design files. With it, Claude Code can pull design context from a frame URL, read variables and components, generate code that matches your design system, and (on supported plans) write changes back to the Figma canvas."

[[faq]]
question = "Do I need a paid Figma plan to use Figma MCP with Claude Code?"
answer = "The remote Figma MCP server is available on all seats and plans, including the free tier. The desktop server requires a Dev or Full seat on a paid plan. For most Claude Code workflows the remote server at https://mcp.figma.com/mcp is the right choice."

[[faq]]
question = "Can Claude Code write changes back to my Figma file?"
answer = "Yes, on supported clients. Claude Code is one of the clients that supports the 'write to canvas' feature via the remote Figma MCP server, meaning the agent can create and modify frames, components, variables, and auto layout. The feature is in beta and currently free during the beta period."

[[faq]]
question = "How does Claude Code know which Figma frame to look at?"
answer = "You paste the Figma frame URL into Claude Code. The MCP server extracts the node ID from the URL and pulls the relevant design context — layers, variables, component references, and layout — so Claude can generate matching code."

[[faq]]
question = "Does Figma MCP work with my existing design system and component library?"
answer = "Yes. Figma's Code Connect feature links design components to your real codebase components, so the code Claude Code generates uses your actual components instead of ad-hoc rebuilds. This keeps generated UI consistent with your existing system."


+++

## What Is the Figma MCP Server?

The Figma MCP server gives any Model Context Protocol client direct access to design files, components, and variables. Instead of asking an AI to "look at" a screenshot of a design, the server returns structured design data — layer trees, auto-layout properties, design tokens, component references — and the model uses that to generate code that actually matches the source. It works with Claude Code, Cursor, VS Code, Codex, Gemini CLI, Windsurf, and most other MCP clients.

For Claude Code in particular, this means the agent in your terminal can pull design context from a Figma URL, generate components that use your real design system, and (on supported plans) even write changes back to the Figma canvas — all driven from natural-language prompts.

## Prerequisites

Before you begin, make sure you have:

- A Figma account (any plan, including free, works with the remote server)
- Claude Code installed and signed in (run `claude` in your terminal to verify)
- A Figma file you have edit or view access to
- A terminal you're comfortable working in

For the "write to canvas" feature specifically, you'll need a Dev or Full seat on a paid Figma plan. For everything else — pulling design context, generating code, reading variables — the free tier is fine.

## Setting Up the Figma MCP Integration

Connecting Figma MCP to Claude Code takes one command. Follow these steps to wire it up:

### Add the Figma MCP Server

Open your terminal and run:

```bash
claude mcp add --transport http figma https://mcp.figma.com/mcp
```

This registers a new MCP server named `figma` that Claude Code connects to over HTTP at Figma's hosted endpoint. The first time you use it, you'll be prompted to authenticate with your Figma account in the browser — approve the connection and you're done.

**One thing to watch:** if you already had a Claude Code session running when you ran the `claude mcp add` command, exit that session and start a new one. The server only loads when Claude Code launches, so existing sessions won't see it until you relaunch.

### Verify the Connection

Start a new Claude Code session and run the `/mcp` command:

```bash
claude
```

```
/mcp
```

You should see `figma` listed as a connected server, along with the tools it exposes (get design context, get code, get variables, get image, and more).

### Optional: Use a JSON Config Instead

If you prefer editing config files directly, the same server can be added to `~/.claude.json` (or a project-scoped `.mcp.json`) using the standard MCP format:

```json
{
  "mcpServers": {
    "figma": {
      "type": "http",
      "url": "https://mcp.figma.com/mcp"
    }
  }
}
```

Restart Claude Code after editing the file and the server will appear in `/mcp`.

## Your First Design-to-Code Run in Claude Code

With the server connected, Claude Code can pull a design directly from a frame URL. Here's the canonical first interaction:

1. Open your Figma file in the browser
2. Select the frame or component you want to implement
3. Copy the URL from the address bar (it includes the node ID Figma MCP needs)
4. In Claude Code, paste the URL with a prompt like:

```
I have the figma MCP server connected. Call its get_design_context tool with this URL: https://www.figma.com/design/abc123/MyFile?node-id=1-234

Once you have the design context, implement the design as a React component using Tailwind CSS, matching spacing, colors, and typography exactly.
```

Claude Code will call the Figma MCP server, pull the layer tree, variables, and component references for that node, and generate a component that matches the design — including spacing, colors, typography, and any auto-layout rules.

**Heads up on which framework Claude generates:** by default Claude Code will pick a sensible framework based on your prompt and any project context (like a `package.json` it can see). If you want a specific stack — React, Vue, Svelte, plain HTML, Tailwind, CSS Modules — say so explicitly in the prompt. Otherwise you'll get whatever Claude thinks fits best, which may not be what your codebase uses.

### Why URLs Beat Screenshots

When the MCP tool runs, it returns structured design data to Claude:

```
Frame "Pricing Card" (1 of 3 in /Pricing/Cards)
  - Auto-layout: vertical, gap 16, padding 24
  - Fill: var(--color-surface-elevated)
  - Border: 1px var(--color-border-subtle), radius 12
  - Children:
    - Text "Pro plan" — variant heading-md, color text-primary
    - Text "$24/month" — variant heading-lg, color text-primary
    - Component <Button variant="primary"> "Get started"
```

Claude reads that and writes code using your actual variable names, component references, and layout values — not approximations from a vision model staring at pixels. The result is faster, deterministic, and uses your design system instead of inventing parallel one.

{{< lazyimg src="/images/blog/claude-code-figma-mcp-design-vs-code.svg" alt="Side-by-side comparison of the structured design data Claude reads from Figma MCP versus the rendered frame a human sees" class="rounded-lg shadow-md" >}}

## Core Capabilities You Can Use From Claude Code

Once Figma MCP is wired up, your prompts can do much more than generate components. The official Figma MCP server exposes tools for:

- **Get design context:** "Implement this frame as a React component" — Claude pulls layout, styles, and component refs from the URL.
- **Get code:** Pull existing code snippets from a frame, useful when teams have wired up Code Connect.
- **Get variables:** "What color tokens are used in this design?" — pulls design tokens and variables.
- **Get image:** Render a frame as an image when Claude needs visual reference alongside the structured data.
- **Write to canvas:** "Create a Figma frame with three pricing cards using our design system" — Claude can build and modify native Figma content directly. Beta feature, requires the remote server.
- **Code to canvas:** "Capture the live UI of my localhost app and send it to Figma" — turns rendered web pages into editable design layers.
- **Retrieve FigJam content:** Pull diagrams, flows, and architecture maps from FigJam files into your code workflow.
- **Retrieve Make resources:** Pull code resources from Figma Make files as context for production builds.

For workflows that need more than a single tool call, Claude Code chains them automatically — pulling variables first, then design context, then generating code that uses both.

## Useful Configuration Options

### Use the Figma Plugin for Better Workflows

Claude Code has an official Figma plugin (a "skill" in Figma's terminology) that bundles best-practice instructions for working with Figma designs. Install it from `claude.com/plugins/figma` and Claude Code gets agent-level guidance on which Figma MCP tools to use, how to sequence them, and how to handle common patterns like Code Connect mappings or design system rule generation. Worth installing if you're using Figma MCP regularly.

### Remote vs Desktop Server

The remote server (the one in the install command above) is the right choice for most workflows — it's hosted by Figma, supports write-to-canvas and code-to-canvas, and works on any plan. The desktop server runs locally through the Figma desktop app and is mainly for organizations with specific security or enterprise requirements. Stick with remote unless you have a reason not to.

### Code Connect for Design System Consistency

If your team uses Figma's Code Connect to map design components to real code components, Claude Code will pick that up automatically through the MCP server. The generated code uses your actual `<Button>`, `<Card>`, or `<Input>` from your codebase instead of building one-off versions. This is the single biggest quality-of-life upgrade for design-system teams using Figma MCP.

## Practical Workflows Worth Stealing

Once Figma MCP is connected, Claude Code can handle full design-to-code flows, design system audits, frame-to-component conversions, FigJam-flow-to-spec translations, and even live UI capture from staging environments back into Figma.

Two things make those workflows actually work in practice. First, a `CLAUDE.md` in your project root that documents your component library location, styling conventions (Tailwind vs CSS Modules vs styled-components), and any patterns Claude should follow — without it, Claude has to guess at where components live and what they should look like. Second, if your team uses Code Connect, set it up before you start generating code at scale; the difference between "Claude generated a button that looks like ours" and "Claude generated code that imports our actual Button component" is enormous.

## Why Pair Claude Code With Figma MCP?

A few reasons this combination is hard to beat:

- **Terminal-native:** Designs flow into the same place you already write code. No copy-pasting screenshots into a chat window.
- **Structured design data:** URL-based context beats pixel-based vision for speed, accuracy, and design system fidelity.
- **Real Figma underneath:** Variables, components, auto-layout, Code Connect — Claude Code sees what your designers actually built, not a flattened render.
- **Two-way:** Read designs into code, push code back as designs. Same server, same workflow.
- **Composable with other MCP servers:** Stack Figma alongside GitHub, your component library docs, or your testing MCP server and Claude Code can move work end-to-end across all of them.
- **Open standard:** MCP is portable. The same Figma server works in Cursor, VS Code, Codex, and Windsurf if you switch clients.

Add the server, run `/mcp` to confirm, and your next "build this design" prompt becomes a real component — generated from the actual layer tree, using your actual design system, written into your actual codebase.
