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
sourceHash: d323481aafb55709c5f55bcbbd3df2158c175f0f1ff3dcf5c42cb699a739589f
translationStatus: translated
generatedBodyHash: d2a7a2f22f29ffb0e14e8677f386d8e0dcd6503eb51153db73e41c57672daa68
docPage:
  work: mcp-level-sequence
  group: getting-started
  slug: connect
  order: 1
---

MCP Level Sequence is a self-contained Unreal Editor plugin that lets AI clients discover and edit Level Sequences through an MCP-compatible JSON-RPC 2.0 HTTP service. It has no dependency on other user plugins or cross-plugin shared modules. Compatibility across UE 5.2–5.8 is still being checked.

## Installation and connection

1. Place `Plugins/MCPLevelSequence` in a project or engine plugin directory and enable it.
2. Start Unreal Editor. By default, the service starts at `http://127.0.0.1:8762/mcp`.
3. If the port is occupied, the server tries up to 10 following ports. Enter the actual endpoint shown in the editor toolbar and log in your client.
4. Configure the port, automatic startup, and request timeout under `Project Settings > Plugins > MCP Level Sequence`.

## HTTP requests

The service supports `initialize`, `ping`, `tools/list`, and `tools/call`. HTTP request bodies are limited to 1 MiB; larger requests receive HTTP 413. Requests must use `jsonrpc: "2.0"`; `params` and `arguments` must be objects, and each tool is checked against its schema for unknown fields, required fields, types, array items, and numeric bounds.

## First sequence edit

Find the sequence with `ListSequences`, then use `GetSequenceDetail` to locate the binding, track, or section to edit. Use the ID or name from the details. Check the sequence’s time unit before entering frame numbers. Edits do not save automatically; call `SaveAsset` when you want to keep them.

## Differences from the UE 5.8 experimental toolset

UE 5.8’s experimental Animation Assistant Toolset depends on SequencerScripting and offers broader Python capabilities. MCP Level Sequence is a self-contained C++ HTTP plugin designed for UE 5.2+ and supports sequence rate editing, skeletal animation tracks and sections, and sections that reference audio assets.

Compilation, editor operation, asset save and close interactions, and complete Undo behavior have not yet been validated across UE 5.2 through 5.8. Check these operations in a copy of your project in the target engine first.

## Feedback

Send feedback to [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com).
