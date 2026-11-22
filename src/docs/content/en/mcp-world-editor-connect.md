---
title: Connect the World Editing Tools
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
sourceHash: 40d950822a6e0e0bce7b497771f9056f520cd7b1296ffc457eee49aa2c13713d
translationStatus: translated
generatedBodyHash: bc741ba4fb8871061bcbaf69fdc034c06e3e280b3dd2dc966e23f1d0cccfd4cf
docPage:
  work: mcp-world-editor
  group: setup
  slug: connect
  order: 1
---

AI-driven level/world editing plugin for Unreal Engine, powered by MCP (Model Context Protocol).

## Overview

MCPWorldEditor runs an HTTP server inside Unreal Editor to expose actor creation, transform and property editing, lighting, landscape, level, and viewport operations to AI assistants.

> **Note**: This plugin is currently under development. The server infrastructure is ready, and tool capabilities continue to improve.

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

`CaptureViewport` normalizes viewport alpha to fully opaque before PNG encoding, so saved files and embedded screenshots display correctly in standard image viewers and Fab workflows.

## MCP connection

The plugin runs an HTTP server inside the Unreal Editor. AI clients connect via MCP protocol.

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

A tool request that times out before the Game Thread claims it is cancelled and may be retried after the editor becomes available. If the Game Thread already claimed it, the error content reports `code=timeout_execution_in_progress`, `retryable=false`, and `stateMayHaveChanged=true`; the operation may still finish, so clients must inspect editor state instead of retrying blindly.

The response-size check runs after tool execution. If a `tools/call` result exceeds the budget, JSON-RPC error data reports `code=response_too_large`, `retryable=false`, and `stateMayHaveChanged=true`; this does not mean the tool was rolled back, so clients must inspect editor state before any retry.

Before a request reaches the Game Thread, the server validates top-level required fields, exact JSON types, array item types, array `maxItems`, and unknown fields against the selected tool's published `inputSchema`; every tool schema defaults to `additionalProperties=false`, and current batch arrays publish their 100-item limit. Tool-specific business rules such as asset paths, numeric ranges, and object existence remain a second validation layer.

The editor becomes busy as soon as a PIE start request is queued. `PIEControl/GetState` and `GetEditorState` distinguish `Idle`, `StartQueued`, and `Playing`, while `Stop` can cancel a queued start. Viewport type and render-mode tools use only a known level-editor viewport instead of down-casting an asset-preview viewport; when both ViewMode and ShowFlag are supplied, both are validated before either change is applied.

`ListActors` and `GetSelectedActors` return `ActorPath`, `FName`, `Label`, and `LevelPath`. Every tool that uses `ActorName/ActorNames` to address existing actors accepts the full `ActorPath` as the preferred exact identifier. Legacy labels and FNames execute only when they uniquely identify one actor in the current world; ambiguous input is rejected with sorted candidate paths instead of selecting, moving, editing, or deleting the wrong actor. Refresh discovery after an actor is renamed or moved to another level because its path changes.

## Requirements

- Unreal Engine 5.2+
- Editor only

## Tool and editor state contracts
