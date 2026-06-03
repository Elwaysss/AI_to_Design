# MCP Server Setup (Cursor)

This repo wires MCP servers into Cursor via `.cursor/mcp.json`:

| Server | Purpose | Used by which course |
|---|---|---|
| `mermaid` | Validate & render Mermaid diagrams before commit | 3 — Business logic mapping |
| `playwright-test` | Planner / Generator / Healer test agents | 6 / 7 — Quality immune system |

**Stately MCP is disabled** — `@statelyai/mcp-server` 404s on npm. Visualize machines by pasting `src/machines/*.ts` into [stately.ai](https://stately.ai).

## How Cursor picks these up

Cursor reads `.cursor/mcp.json` from the workspace root automatically. After
saving the file you must **restart Cursor** (or run *MCP: Reload Servers*
from the command palette) for new servers to come online.

Verify in Cursor with:

1. `⌘/Ctrl + Shift + P` → `MCP: Show Servers`
2. `mermaid` and `playwright-test` should be listed as **running**.
3. In the chat sidebar, the wrench icon should show their tools.

## Mermaid MCP — picking a server

There are several community Mermaid MCP servers as of 2026. The most-used:

| Package | Repo | Notes |
|---|---|---|
| `mcp-mermaid` *(default in this repo)* | <https://github.com/hustcc/mcp-mermaid> | Validates + renders to PNG/SVG via npx, no native deps |
| `@modelcontextprotocol/server-mermaid` | <https://github.com/modelcontextprotocol/servers> | Reference implementation, follow the official repo's README |
| `mermaid-mcp-server` | community variants | Check stars/maintenance before pinning |

To swap servers, edit `.cursor/mcp.json` — only the `args` (package name) changes.

### Verify Mermaid MCP works

1. Open any chat in Cursor.
2. Ask: *"Validate this Mermaid diagram and render it as SVG:"* then paste a
   simple `stateDiagram-v2 [*] --> Idle Idle --> Done`.
3. Cursor should call the `mermaid` tool, return a "valid" verdict and an inline image.
4. Now ask: *"Render `src/machines/loginMachine.ts` as a Mermaid state diagram."*
   The agent will (a) read the file, (b) generate Mermaid, (c) validate it via MCP,
   (d) return the rendered SVG. If step (c) catches a syntax error, the agent
   iterates without ever committing a broken diagram — this is the
   "validate-and-render workflow" the strategy report describes.

## Stately Studio (web, not MCP)

Paste `loginMachine.ts` or `onboardingMachine.ts` into Stately Studio import.
Do not re-enable `stately` in `.cursor/mcp.json` until the package is published.

## Playwright Test MCP

Configured as `playwright-test` in `.cursor/mcp.json`. Workflow:
[`docs/test-agents-workflow.md`](test-agents-workflow.md).

## Adding more MCP servers

Append to `mcpServers`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp"]
    },
    "chromatic": {
      "command": "npx",
      "args": ["-y", "@chromaui/mcp"],
      "env": { "CHROMATIC_PROJECT_TOKEN": "${CHROMATIC_PROJECT_TOKEN}" }
    }
  }
}
```

Then restart Cursor. Tokens for env vars are picked up from the host shell,
so set them with `$env:CHROMATIC_PROJECT_TOKEN = "..."` before launching Cursor
(or commit to `.env` and load via Cursor settings — never check tokens into Git).

## Troubleshooting

- **"Server failed to start"** → run the `npx` command manually in PowerShell.
  Usually means npm registry blocked the install or the package name is wrong.
- **"Tool not visible to the agent"** → the agent's pinned model might not
  support tool calls in your current chat mode. Switch to Agent mode.
- **Path with spaces breaks npx on Windows** → `F:\AI Design Paradigm\` has
  a space; npx handles it fine, but custom MCP server scripts that take
  `--cwd` arguments may need quoting in `args`.
