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
sourceHash: ab92a1dcc12c36718a5c11fb2c42c64217cc9b11732f3561051f37562c0315cc
translationStatus: translated
generatedBodyHash: 6c4b02ca7298e3003df2907e6c63d8a2ca63d4bf4630f0652e1571729f3b2f1b
docPage:
  work: mcp-world-editor
  group: getting-started
  slug: connect
  order: 1
---

## Requirements and scope

MCPWorldEditor runs an HTTP server inside Unreal Editor to expose actor creation, transform and property editing, lighting, landscape, level, and viewport operations to AI assistants.

> **Note**: The plugin is still in development. The server is available, and tool support and compatibility are still being verified across engine versions.

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

Open the Unreal Editor instance you want to connect to. With `bAutoStart` enabled by default, the server starts with the editor. Use `http://127.0.0.1:8764/mcp` when the default port is available. If it is occupied, copy the actual URL from the editor toolbar.

### Claude Code

Merge the `ue-world-editor` entry below into `mcpServers` in the project root’s `.mcp.json`, keeping the existing entries. If the toolbar shows a different port, substitute the actual URL. To use the server across projects, add it through Claude Code at user scope. Claude Code stores that configuration in `~/.claude.json`.

```json
{
  "mcpServers": {
    "ue-world-editor": {
      "type": "http",
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

After connecting, call MCP `tools/list`. Once it returns a tool list, look up the tool you need and check its input schema. The available tools can change with the plugin version.

## Feedback

Send feedback to [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com).
