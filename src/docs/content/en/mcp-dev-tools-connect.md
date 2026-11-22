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
sourceHash: d6f034e0cd32bf64b5e60f08a2cebc0707b806e9f4572e7bc5aba827fe040164
translationStatus: translated
generatedBodyHash: 585157ece818a6d1d1abd03c18cbbe1e2d8d95318a5ddc4a8ace362025f183cb
docPage:
  work: mcp-dev-tools
  group: setup
  slug: connect
  order: 1
---

## Enable and configure the plugin

MCPDevTools provides asset queries, editing, and read-only diagnostics over HTTP MCP in Unreal Editor. Use `tools/list` and tool results from the target editor to confirm what is available.

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
