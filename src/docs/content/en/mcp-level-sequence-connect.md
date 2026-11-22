---
title: Connect the Sequence Editing Tools
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
sourceHash: 7817c2daceceedaf1caec4d1e871bfb04901c1254b141d3de15725a0e6eb2de9
translationStatus: translated
generatedBodyHash: 6c4e65ad5cd2262bb8afa6687d351dcf225949b03bca8b5e26d5eb17b01f70e4
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

The service supports `initialize`, `ping`, `tools/list`, and `tools/call`. HTTP request bodies are limited to 1 MiB; larger requests receive HTTP 413. Requests must use `jsonrpc: "2.0"`; `params` and `arguments` must be objects, and each tool is checked against its schema for unknown fields, required fields, types, array items, and numeric bounds.

## 23 tools

| Group | Tools | Purpose |
|---|---|---|
| Sequence | `ListSequences`, `GetSequenceDetail`, `CreateSequence` | Discover, inspect with pagination, and create sequences |
| Time | `SetPlaybackRange`, `SetSequenceRates` | Set playback ranges, display rates, and tick resolutions |
| Binding | `ListBindings`, `AddBinding`, `RemoveBinding` | Page, add, and cascade-remove object bindings |
| Track | `ListTrackTypes`, `AddTrack`, `RemoveTrack` | Query, add, and cascade-remove tracks |
| Section | `AddSection`, `RemoveSection`, `SetSectionRange` | Create, remove, and resize sections |
| Key | `GetKeyframes`, `SetKeyframes`, `RemoveKeyframes` | Page, write, and remove keys |
| Camera | `AddCameraCut`, `SetCameraCut` | Create and modify camera cuts |
| Lifecycle | `OpenAsset`, `SaveAsset`, `CloseAsset` | Open, save one asset, and verify close results |
| Preview | `CaptureSequencerView` | Capture the active level editor viewport as PNG |

## Boundary versus Unreal Engine 5.8's experimental toolset

UE 5.8's experimental Animation Assistant Toolset is a broad Python surface that depends on SequencerScripting. This plugin deliberately keeps a self-contained C++ HTTP boundary compatible with UE 5.2+. This pass adds the capabilities that have stable cross-version APIs: sequence rate editing, Skeletal Animation tracks/sections, and Audio asset sections.

The following differences are intentional:

- Subsequence creation/navigation needs cycle checks, hierarchy ownership, and cross-sequence time semantics, so write tools are not exposed yet.
- Spawnable creation has version-sensitive template ownership, Undo, and spawner paths and needs dedicated runtime validation before exposure.
- Event payloads depend on Director Blueprint endpoints/graphs. The current plugin creates Event sections but does not promise a concrete trigger.
- Arbitrary track/class creation, folders, tags, selection state, and advanced bone-level operations remain outside the reviewed strict-schema surface, although the official experimental toolset is broader.

Compilation, editor operation, asset save and close interactions, and complete Undo behavior have not yet been validated across UE 5.2 through 5.8. Check these operations in a copy of your project in the target engine first.

For questions or feedback, email [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com). I will respond when I see your message.
