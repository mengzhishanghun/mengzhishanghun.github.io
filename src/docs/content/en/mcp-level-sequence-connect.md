---
title: Install and Connect MCP Level Sequence
type: doc
slug: mcp-level-sequence-connect
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-level-sequence
documentKind: product-manual
websiteRoute: /en/works/mcp-level-sequence/docs/connect/
lang: en
translationKey: doc:mcp-level-sequence:connect
sourceHash: 947d699b2b97e556f09960314f2c1daa3fbadc077a1ad74f3975f330c7c3397a
translationStatus: translated
generatedBodyHash: 077ba66b20f2ba027a40ce50ae50c4d247c5e6197497f80e781513b3dd823b3d
docPage:
  work: mcp-level-sequence
  group: setup
  slug: connect
  order: 1
---

MCP Level Sequence is a self-contained Unreal Editor plugin that lets AI clients discover and edit Level Sequences through an MCP-compatible JSON-RPC 2.0 HTTP service. It supports Unreal Engine 5.2 and later without depending on other user plugins or cross-plugin shared modules.

## Installation and connection

1. Place `Plugins/MCPLevelSequence` in a project or engine plugin directory and enable it.
2. Start Unreal Editor. By default, the service starts at `http://127.0.0.1:8762/mcp`.
3. If the port is occupied, the server tries up to 10 following ports. Use the actual endpoint shown by the editor toolbar and log.
4. Configure the port, automatic startup, and request timeout under `Project Settings > Plugins > MCP Level Sequence`.

## HTTP requests

The service supports `initialize`, `ping`, `tools/list`, and `tools/call`. HTTP request bodies are limited to 1 MiB; larger requests receive HTTP 413. Requests must use `jsonrpc: "2.0"`; `params` and `arguments` must be objects, and each tool is checked against its schema for unknown fields, required fields, types, array items, and numeric bounds.

## First sequence edit

The recommended flow is to call `ListSequences` and `GetSequenceDetail`, perform mutations with stable IDs/names, and then call `SaveAsset` explicitly.

## Differences from the UE 5.8 experimental toolset

UE 5.8’s experimental Animation Assistant Toolset depends on SequencerScripting and offers broader Python capabilities. MCP Level Sequence is a self-contained C++ HTTP plugin for UE 5.2+ and supports sequence rate editing, skeletal animation tracks and sections, and sections that reference audio assets.

Compilation, editor operation, asset save and close interactions, and complete Undo behavior have not yet been validated across UE 5.2 through 5.8. Check these operations in a copy of your project in the target engine first.

## Feedback

Send feedback to [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com).
