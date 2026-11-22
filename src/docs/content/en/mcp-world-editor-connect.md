---
title: Connect to MCP World Editor
type: doc
slug: mcp-world-editor-connect
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
documentKind: product-manual
websiteRoute: /en/works/mcp-world-editor/docs/connect/
lang: en
translationKey: doc:mcp-world-editor:connect
sourceHash: 776094a0db1ad16ba402d42cbdb25fdd2da3f1773298dd9d178ca430e79ace9d
translationStatus: translated
generatedBodyHash: 4151da81f64ab8d0e4f138e56ad62388375ea4732eb35df53b16c402a06790df
docPage:
  work: mcp-world-editor
  group: setup
  slug: connect
  order: 1
---

## Requirements and scope

MCPWorldEditor runs an HTTP server inside Unreal Editor to expose actor creation, transform and property editing, lighting, landscape, level, and viewport operations to AI assistants.

> **Note**: This plugin is currently under development. The server infrastructure is ready, and tool capabilities continue to improve.

- Unreal Engine 5.2+
- Editor only

## Configuration

Configure the plugin under `Project Settings > Plugins > MCP World Editor`:

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Port | int32 | 8764 | HTTP port (auto-increment if occupied, up to 10 retries) |
| bAutoStart | bool | true | Auto-start server on editor launch |
| RequestTimeoutSeconds | int32 | 30 | Tool execution timeout |
| MaxRequestBodyBytes | int32 | 1048576 | Maximum HTTP request body accepted before UTF-8/JSON parsing |
| MaxResponseBodyBytes | int32 | 8388608 | Maximum UTF-8 JSON response; screenshot Base64 content shares this budget |
| MaxCapturePixels | int32 | 8294400 | Maximum pixels read by `CaptureViewport` (approximately 4K by default) |

## MCP connection

**MCP URL**: `http://127.0.0.1:8764/mcp`

The server starts automatically when the editor opens (configurable via `bAutoStart`). The toolbar shows the actual URL (port auto-increments if 8764 is occupied).

### Claude Code

Add to `~/.claude/.mcp.json` (global) or project root `.mcp.json`:

```json
{
  "mcpServers": {
    "ue-world-editor": {
      "url": "http://127.0.0.1:8764/mcp"
    }
  }
}
```

### Other AI clients

MCP client configuration varies by tool (Cursor, Windsurf, VS Code Copilot, etc.). Consult your AI tool's documentation to add the same MCP server URL.

## Request validation and failures

Before a request reaches the Game Thread, the server validates top-level required fields, exact JSON types, array item types, array `maxItems`, and unknown fields against the selected tool's published `inputSchema`; every tool schema defaults to `additionalProperties=false`, and current batch arrays publish their 100-item limit. Tool-specific business rules such as asset paths, numeric ranges, and object existence remain a second validation layer.

A tool request that times out before the Game Thread claims it is cancelled and may be retried after the editor becomes available. If the Game Thread already claimed it, the error content reports `code=timeout_execution_in_progress`, `retryable=false`, and `stateMayHaveChanged=true`; the operation may still finish, so clients must inspect editor state instead of retrying blindly.

The response-size check runs after tool execution. If a `tools/call` result exceeds the budget, JSON-RPC error data reports `code=response_too_large`, `retryable=false`, and `stateMayHaveChanged=true`; this does not mean the tool was rolled back, so clients must inspect editor state before any retry.

Use MCP `tools/list` to discover the tools and their current input schemas; the available set can change with the plugin version.

## Feedback

Send feedback to [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com).
