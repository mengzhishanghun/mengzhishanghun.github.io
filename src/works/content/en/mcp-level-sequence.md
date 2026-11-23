---
title: MCPLevelSequence
description: MCPLevelSequence is an Unreal Editor MCP plugin in development, providing tool interfaces for Level Sequence asset editing. Features and compatibility are still being verified.
type: work
slug: mcp-level-sequence
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
order: 20
status: In development
workInfo:
  stage: developing
  channels:
    - kind: docs
      href: /en/works/mcp-level-sequence/docs/connect/
  compatibility:
    - platforms: []
      requirements:
        - UE 5.2–5.8 (in development; compatibility to be confirmed)
featured: false
draft: false
sitePublish: true
tags:
  - Level Sequence asset editing
  - MCP series
lang: en
translationKey: mcp-level-sequence
sourceHash: a922cc907102e96722dbe4a07e62c69fb96e9fea8bb8a72f214a6ff82e9a7965
generatedBodyHash: fb20ffaf576d7b9bb7ed89ff49eafd31735882b0e0ed85eaca577bba59d79afa
translationStatus: translated
coverAlt: MCPLevelSequence cover
websiteCoverUrl: /media/covers/works/mcp-level-sequence-20261101.webp
docIds:
  - mcp-level-sequence-connect
  - mcp-level-sequence-sequence-assets
  - mcp-level-sequence-sequence-preview
  - mcp-level-sequence-sequence-bindings
  - mcp-level-sequence-edit-sequence
  - mcp-level-sequence-sequence-keyframes
  - mcp-level-sequence-sequence-timing
---

## About this work

MCPLevelSequence is an Unreal Editor MCP plugin in development. It gives external AI tools a local HTTP interface for finding, creating, and editing Level Sequences. Sequence operations and diagnostics may change during development.

## Development direction

### Object bindings and camera cuts

Page through sequences and bindings, use `BindingId` to identify objects, and add bindings or edit Camera Cuts. Deleting a binding or track also affects child objects. Deleting a binding also removes local Camera Cut sections that reference its subtree. Check references first and use a specific ID when names are ambiguous. Spawnable creation still needs separate validation before it can be made available. [Sequence assets](/en/works/mcp-level-sequence/docs/sequence-assets/) · [Bindings and cameras](/en/works/mcp-level-sequence/docs/sequence-bindings/)

### Tracks, sections, and keyframes

Check the supported track types, then add, delete, or resize sections. Keyframe tools cover the corresponding channels for Transform, Float/Fade, and Bool property tracks. Playback range, keyframe, and Camera Cut frame numbers use `TickResolution`. Check the sequence settings before entering frame numbers. [Tracks and sections](/en/works/mcp-level-sequence/docs/edit-sequence/) · [Keyframes](/en/works/mcp-level-sequence/docs/sequence-keyframes/) · [Playback range and frame rates](/en/works/mcp-level-sequence/docs/sequence-timing/)

## Workflow

To adjust a cut in an existing sequence, follow the [connection guide](/en/works/mcp-level-sequence/docs/connect/) and point your client at the address shown by Unreal Editor. Find the sequence and read its camera binding and cut section. Check the frame units before making the edit. You can [capture the active level editor viewport](/en/works/mcp-level-sequence/docs/sequence-preview/) to check the current view. Call `SaveAsset` to keep the changes; it saves only the specified Level Sequence. Edits require a valid `/Game/...` path. The tools reject changes to a read-only MovieScene and during PIE, saving, or garbage collection.

## Development status

Compatibility with UE 5.2–5.8 remains unconfirmed. Compilation, editor operation, saving and closing, and full Undo behavior have not been fully verified. Check these on a copy of your project in the target engine first. [MCPLevelSequence user guide](/en/works/mcp-level-sequence/docs/connect/)

## Support

Send feedback to [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com).
