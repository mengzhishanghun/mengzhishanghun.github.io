---
title: Install and Connect the UMG Tools
type: doc
slug: mcp-umg-connect
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-umg
documentKind: product-manual
websiteRoute: /en/works/mcp-umg/docs/connect/
lang: en
translationKey: doc:mcp-umg:connect
sourceHash: 36cb7a4b69abbe154956705df030bad9ce9932aa03fecab0a63f41bd2b5f1f6a
translationStatus: translated
generatedBodyHash: 6acd4c8004e49f16588e765e5cbd9fe9c23320ded54367f54b28ae378717e55a
docPage:
  work: mcp-umg
  group: setup
  slug: connect
  order: 1
---

AI-driven UMG editing plugin for Unreal Engine, powered by MCP (Model Context Protocol).

## Overview

MCPUMG exposes Widget-specific visual editing capabilities to AI assistants via an HTTP server running inside the Unreal Editor. AI tools can discover, create, modify widget trees, properties, slots, animations, and events through a standardized protocol.

## Installation and updates

1. Close every Unreal Editor instance that uses the target engine version.
2. Choose the MCPUMG package that matches the engine version, then copy its contents to `Engine/Plugins/Marketplace/MCPUMG` under that engine installation.
3. Open the copied `MCPUMG.uplugin`. Keep `"Installed": true`, and add or set `"EnabledByDefault": true`; packaged descriptors may omit this field during post-processing.
4. Restart the editor. The plugin starts automatically unless `bAutoStart` is disabled in Project Settings.

To update MCPUMG, close the editor and replace the entire existing `MCPUMG` directory with the matching new package. Do not mix files from different engine versions.

## Tools (71 base tools; 6 more with the opt-in MVVM module)

### Discovery & Reading
| Tool | Description |
|------|-------------|
| ListWidgetBlueprints | List Widget Blueprints (convenience entry point) |
| GetWidgetTree | Get widget tree structure |
| GetWidgetProperties | Get widget properties |
| SearchWidgetClasses | Search available widget classes |
| CaptureWidgetScreenshot | Capture Widget design view as PNG |
| CaptureRuntimeWidgetScreenshot | Capture an existing PIE/Game Widget instance at its actual Slate window geometry as PNG; never creates a widget or injects preview state |
| GetUIDesignCapabilities | Read the reference-image-to-UMG specification version, operations and safety limits |
| ExportWidgetSpec | Export a stable Widget spec, revision, and fingerprint |
| InspectWidgetLayout | Page through design metadata or actual PIE layout, clipping, text and resource status |
| InspectWidgetHitTest | Read the cached hit path at a live widget's center or local coordinates; never inject input |
| CompareUIImages | Compare two UI images without automatic resizing, cropping or alignment, and return a heatmap |
| CaptureWidgetPreviewMatrix | Render named temporary states at named sizes as a PNG matrix |
| InspectWidgetPerformance | Read bounded authored WidgetTree complexity indicators |
| ListRuntimeWidgets | Issue short-lived tokens for exact-class live Widget instances |
| InspectWidgetRuntime | Read a named live Widget or paged runtime WidgetTree |
| GetRuntimeOperation | Read progress and results of a bounded runtime operation |
| CancelRuntimeOperation | Request cancellation of a pending runtime operation |
| MeasureWidgetPerformance | Sample bounded Slate CPU work for a live Widget subtree |
| CaptureWidgetTrace | Capture a bounded native Slate trace for a live Widget |
| GetUIFrameworkCapabilities | Read the available CommonUI and MVVM operations |
| GetMVVMView | Read MVVM contexts and bindings on a Widget Blueprint |
| ValidateMVVMBinding | Validate one direct OneTime MVVM property relationship without editing bindings |

## Configuration

Project Settings > Plugins > MCPUMG:

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Port | int32 | 8765 | HTTP port (auto-increment if occupied, up to 10 retries) |
| bAutoStart | bool | true | Auto-start server on editor launch |
| RequestTimeoutSeconds | int32 | 30 | Tool execution timeout |
| CompileTimeoutSeconds | int32 | 120 | Compile timeout |

## MCP Connection

The plugin runs an HTTP server inside the Unreal Editor. AI clients connect via MCP protocol.

**MCP URL**: `http://127.0.0.1:8765/mcp`

The server starts automatically when the editor opens (configurable via `bAutoStart`). The toolbar shows the actual URL (port auto-increments if 8765 is occupied).

### Version and save troubleshooting

Layout diagnostics include parent bounds, clipping ancestors to a bounded depth, and signs of vertical text overflow, including wrapped text. `Unverified*` does not mean a check passed. Property setters support `ResetToClassDefault`; styles support explicit RoundedBox/outline settings, clearing Brush resources, and Button normal/pressed padding. See [Layout, sessions and hit testing](/en/works/mcp-umg/docs/layout/#layoutandsession) and [Reference image to UMG](/en/works/mcp-umg/docs/layout/#imagetoumg).
- Treat `tools/list` from the live editor as authoritative. Updating the source tree or installed package does not hot-swap the DLL in an already running editor; if the tool count differs, verify the deployment directory and restart the target editor.
- When `SaveWidgetBlueprint` fails, inspect `LogSavePackage` in the project log. Windows `Error 32` usually means a stale `-game`, PIE, or second editor process for the same project still owns the asset handle. Close only the stale process whose command line identifies that project, then retry the precise save.
- If the patch succeeded in memory but saving failed, do not use Save All, overwrite the file externally, or repeat the patch. Release the file lock and retry `SaveWidgetBlueprint` so the existing in-memory change is saved once.
- `CaptureRuntimeWidgetScreenshot` requires the MCPUMG editor module and an existing runtime Widget instance. A standalone `-game` process is not guaranteed to expose the MCPUMG server.

### Claude Code

Add to `~/.claude/.mcp.json` (global) or project root `.mcp.json`:

```json
{
  "mcpServers": {
    "ue-umg": {
      "url": "http://127.0.0.1:8765/mcp"
    }
  }
}
```

### Other AI Clients

MCP client configuration varies by tool (Cursor, Windsurf, VS Code Copilot, etc.). The server URL is the same; consult your AI tool's documentation for how to add an MCP server.

## Requirements

- Unreal Engine 5.2+
- Editor only
- Optional: [MCPBlueprint](/en/works/mcp-blueprint/docs/connect/) for Blueprint graph editing (widget event logic calls MCPBlueprint tools for advanced graph operations)

For questions or feedback, visit the [unified contact page](https://mzsh.me/contact/) and add me on WeChat.
