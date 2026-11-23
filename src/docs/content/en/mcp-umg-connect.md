---
title: Install and Connect MCPUMG
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
sourceHash: 040442f66fc39cdf98cd90d12fe02090de29d43b3a62b4ccf23dee043477d8ef
translationStatus: translated
generatedBodyHash: 5189dd788bbc45d3952ccd0bc8ebc4f4da7f62f790208cfdf3f4d86bd24748cd
docPage:
  work: mcp-umg
  group: getting-started
  slug: connect
  order: 1
---

## Development status and requirements

MCPUMG is an Unreal Engine Editor plugin in development. It lets MCP (Model Context Protocol) clients read, create, and edit widget trees, properties, slots, animations, and events. Support for UE 5.2–5.8 is still in development. Testing across these versions is incomplete, and compatibility has yet to be confirmed.

- Unreal Engine 5.2+
- Editor only
- Optional: [MCPBlueprint](/en/works/mcp-blueprint/docs/connect/) for Blueprint graph editing (widget event logic calls MCPBlueprint tools for advanced graph operations)

For questions or feedback, visit the [unified contact page](https://mzsh.me/contact/) and add me on WeChat.

## Installation and updates

1. Close every Unreal Editor instance that uses the target engine version.
2. Choose the MCPUMG package that matches the engine version, then copy its contents to `Engine/Plugins/Marketplace/MCPUMG` under that engine installation.
3. Open the copied `MCPUMG.uplugin`. Keep `"Installed": true`, and add or set `"EnabledByDefault": true`; packaged descriptors may omit this field during post-processing.
4. Restart the editor. The plugin starts automatically unless `bAutoStart` is disabled in Project Settings.

To update MCPUMG, close the editor and replace the entire existing `MCPUMG` directory with the matching new package. Do not mix files from different engine versions.

## Configuration

Project Settings > Plugins > MCPUMG:

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Port | int32 | 8765 | HTTP port (auto-increment if occupied, up to 10 retries) |
| bAutoStart | bool | true | Auto-start server on editor launch |
| RequestTimeoutSeconds | int32 | 30 | Tool execution timeout |
| CompileTimeoutSeconds | int32 | 120 | Compile timeout |

## MCP Connection

Open the Unreal project you want to work on, then check the actual MCP URL in the editor toolbar. After the client connects, confirm the session details below before reading a widget tree.

The plugin runs an HTTP server inside the Unreal Editor. AI clients connect via MCP protocol.

**MCP URL**: `http://127.0.0.1:8765/mcp`

The server starts automatically when the editor opens (configurable via `bAutoStart`). The toolbar shows the actual URL (port auto-increments if 8765 is occupied).

### Claude Code

Claude Code stores user-scoped server configuration in `~/.claude.json`. Use the project root’s `.mcp.json` for a project-scoped server. Add the HTTP server entry below in the chosen scope and replace the example URL with the address shown in the editor toolbar:

```json
{
  "mcpServers": {
    "ue-umg": {
      "type": "http",
      "url": "http://127.0.0.1:8765/mcp"
    }
  }
}
```

### Other AI clients

MCP client configuration varies by tool (Cursor, Windsurf, VS Code Copilot, etc.). The server URL is the same; consult your AI tool's documentation for how to add an MCP server.

## Confirm the target project

`initialize` returns `_meta.mcpumgContext`: ProjectFile, ProjectName, EngineVersion, PluginVersion, ProcessId, ActualPort and SessionId. Port conflicts may change the port; use the returned values to confirm the actual project. SessionId follows the server object's lifetime and changes when that object is recreated.

Subsequent calls can pass the token in **params._meta**. Do not put it in the tool's business arguments.

```json
{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"GetWidgetTree","arguments":{"BlueprintPath":"/Game/UI/WBP_Menu"},"_meta":{"MCPUMGExpectedSessionId":"从initialize读取"}}}
```

Tokens of the wrong type or expired tokens are rejected before tool execution. Omitting the token preserves compatibility with older clients. This check helps prevent accidental operations in another editor; it is not authentication.

## Read your first widget tree

After connecting, confirm that the client's `tools/list` includes MCPUMG tools. Find an asset with `ListWidgetBlueprints`, then read its structure with `GetWidgetTree`. See [Edit the Widget Tree](/en/works/mcp-umg/docs/layout/). The base version has 71 tools. The opt-in enhanced MVVM module adds six.

## Troubleshoot tool versions and saving

- Treat `tools/list` from the live editor as authoritative. Updating the source tree or installed package does not hot-swap the DLL in an already running editor; if the tool count differs, verify the deployment directory and restart the target editor.
- When `SaveWidgetBlueprint` fails, inspect `LogSavePackage` in the project log. Windows `Error 32` usually means a stale `-game`, PIE, or second editor process for the same project still owns the asset handle. Close only the stale process whose command line identifies that project, then retry the precise save.
- If the patch succeeded in memory but saving failed, do not use Save All, overwrite the file externally, or repeat the patch. Release the file lock and retry `SaveWidgetBlueprint` so the existing in-memory change is saved once.
