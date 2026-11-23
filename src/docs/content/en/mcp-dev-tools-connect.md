---
title: Enable and Connect MCP Dev Tools
type: doc
slug: mcp-dev-tools-connect
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-dev-tools
documentKind: product-manual
websiteRoute: /en/works/mcp-dev-tools/docs/connect/
lang: en
translationKey: doc:mcp-dev-tools:connect
sourceHash: 6223ac3fbbff64a782ec01997f6a7d2dae849897b1499206bc2e1a0e24d121dc
translationStatus: translated
generatedBodyHash: d4ba79b66cc61d521d452454da920381ba90d4e49baa103fe7639462a3581ff8
docPage:
  work: mcp-dev-tools
  group: getting-started
  slug: connect
  order: 1
---

## Enable and configure the plugin

MCPDevTools provides asset queries, editing, and read-only diagnostics over HTTP MCP in Unreal Editor. Enter the address from the editor log in your MCP client. Once connected, use `tools/list` to check which tools that editor instance offers.

Place `Plugins/MCPDevTools` in your project's `Plugins` directory and enable `MCPDevTools` in the `.uproject` `Plugins` array. After opening the editor, configure the port and automatic startup under **Project Settings → Plugins → MCPDevTools**. The default address is `http://127.0.0.1:8768/mcp`. If the port is occupied, the server tries subsequent ports; use the actual address in the editor log.

## Preview writes and save explicitly

1. Use the relevant `Get...` tool to read the complete current values. If the type or fields are unclear, call `GetAssetTypeSchema`. For creation, keep the default `bDryRun=true` first, check the path, class, or mode, then set `bDryRun=false`.
2. For edits, copy the complete old values into the corresponding `Expected...` parameters and provide the new values. Start with the default dry-run, then set `bDryRun=false`. Conflicts or invalid fields cause rejection. Created or edited assets are dirty in memory.
3. Once you have checked the result, call `SaveAsset` separately to write that asset package. Tools do not automatically check out files, overwrite an existing creation path, or save referenced assets.

| Type | Tools | Purpose and main parameters |
|---|---|---|
| Save | `SaveAsset` | Explicitly save one supported standalone asset package under `/Game` using `AssetPath`. Does not save referenced assets or automatically check out read-only files. |

## Scope

The current tools do not provide Automation/Build/Cook/Package jobs, arbitrary commands, or editing of user C++ source code.
