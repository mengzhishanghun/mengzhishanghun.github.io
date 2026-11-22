---
title: Install and Connect MCPBlueprint
type: doc
slug: mcp-blueprint-connect
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-blueprint
documentKind: product-manual
websiteRoute: /en/works/mcp-blueprint/docs/connect/
lang: en
translationKey: doc:mcp-blueprint:connect
sourceHash: 19434eb56c97fb145fd07ede5e4ce2b3e7e0845ac35821dab62d3c90eeb59c52
translationStatus: translated
generatedBodyHash: 7fc13bb94bd85667199b9866a0cccc5fe3447e959ac511ac9911a421b8d2e00f
docPage:
  work: mcp-blueprint
  group: getting-started
  slug: connect
  order: 1
---

## Requirements and installation

- Unreal Engine 5.2+ Editor on Windows, macOS, or Linux.
- An MCP client that supports a local HTTP server.
- A package matching the exact Unreal Engine minor version.

Install once per engine:

```text
<UE_5.x>/Engine/Plugins/Marketplace/MCPBlueprint/
```

MCPBlueprint is an optional editor tool installed with the engine. Its `.uplugin` uses `Installed=true` and `EnabledByDefault=true`. Do not copy it into every project or add MCPBlueprint to a project's `.uproject`. Restart the editor for the corresponding engine version after replacing the plugin package.

## Connect an AI client

MCPBlueprint enables itself automatically. With Auto Start enabled, its local MCP server starts with the editor. You do not need to enable it manually in each project or add a plugin declaration to the project's `.uproject`.

Follow your AI client's MCP setup process and give it the endpoint shown in the plugin toolbar. The default endpoint is `http://127.0.0.1:8766/mcp`. If the configured port is occupied, MCPBlueprint tries up to nine subsequent ports. Client configuration formats differ, so this guide does not prescribe a client-specific JSON file or manual port-configuration procedure.

The MCP client normally handles `initialize` and `tools/list` automatically. `ping` is for troubleshooting and does not need to be run manually for every session.

The server binds only to the local machine. Browser-style `Origin` values are limited to `localhost`, `127.0.0.1`, and `[::1]`; ordinary non-browser MCP clients can omit `Origin`.

## Settings

Open **Project Settings → Plugins → MCP Blueprint**:

- **Port**: defaults to `8766`; if occupied, tries up to nine subsequent ports.
- **Auto Start**: starts the server with the editor.
- **Auto Compile After Modify**: compiles automatically after supported writes.
- **Request Timeout Seconds**: timeout for ordinary tools.
- **Compile Timeout Seconds**: separate timeout for compilation tools.

## Read and edit your first Blueprint

After connecting, find an asset with `ListBlueprints` and pass its exact `BlueprintPath` to `GetBlueprintOverview`. To change logic, identify the target graph and follow the [graph editing workflow](/en/works/mcp-blueprint/docs/graphs/) to preview the edit. Ordinary edits mark an asset dirty. Call `SaveAsset` when you want to keep the changes.

## Choose the tool for the object you want to edit

- For declaration defaults, see [variables](/en/works/mcp-blueprint/docs/variables/). For literals on node input pins, see [graph editing](/en/works/mcp-blueprint/docs/graphs/). For Entry and Result parameters, see [function signatures](/en/works/mcp-blueprint/docs/members-and-types/).
- For Actor Blueprint component templates or attachments, see [components](/en/works/mcp-blueprint/docs/components-and-inheritance/). For generated-class defaults, see [class defaults](/en/works/mcp-blueprint/docs/class-defaults/). To change the Blueprint parent class, see [class inheritance](/en/works/mcp-blueprint/docs/class-inheritance/).

## Troubleshoot connections and plugin loading

- **Cannot connect:** use the actual endpoint in the toolbar; the configured port may be occupied.
- **Missing tool:** refresh `tools/list` instead of relying on an old cache.
- **Plugin requests a rebuild:** install a package matching the exact engine minor version.
- **Plugin missing from the project:** check that it is installed under that engine's `Engine/Plugins/Marketplace`. Do not work around this by adding a project dependency.
- **UE 5.5 reports an outdated project file because the installed MCPBlueprint is absent from the project descriptor:** choose **Not Now**. The engine plugin still loads automatically. **Update** adds MCPBlueprint to the project's `.uproject`, creating the project-side dependency this installation model explicitly avoids.

- Supports Windows, macOS, and Linux Editor; no Runtime/Shipping module is provided.
