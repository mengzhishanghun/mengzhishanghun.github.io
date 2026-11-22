---
title: Read and Edit Keyframes
type: doc
slug: mcp-level-sequence-sequence-keyframes
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-level-sequence
documentKind: product-manual
websiteRoute: /en/works/mcp-level-sequence/docs/sequence-keyframes/
lang: en
translationKey: doc:mcp-level-sequence:sequence-keyframes
sourceHash: adcc2c193a0be0227784b55a9561b2c68f66e596c8a7d6257500a74fff8f44f1
translationStatus: translated
generatedBodyHash: 052b3ca7a3670aa6bd0ebe6f01c2fd873845c65071be2f9f5b05de0acb8ceb19
docPage:
  work: mcp-level-sequence
  group: sequence-editing
  slug: sequence-keyframes
  order: 3
---

## Supported channels and pagination

| Group | Tools | Purpose |
|---|---|---|
| Key | `GetKeyframes`, `SetKeyframes`, `RemoveKeyframes` | Page, write, and remove keys |

Keyframe tools support three channel families: Double for Transform, Float for Float/Fade, and Bool for Bool property tracks. `GetSequenceDetail` returns track and section structure but does not enumerate channels; use the `ChannelName` contract for the selected track type when calling keyframe tools.

- `GetKeyframes`: 200 by default, capped at 1000 and returns `NextOffset`.

Paged responses report totals, the current offset, whether more data exists, and a `NextOffset` when applicable. Clients should continue paging instead of assuming that one response contains the whole asset.

Mutation and save tools accept only valid `/Game/...` Level Sequence paths. Read-only discovery, inspection, opening, capture, and closing may access other readable sequence locations. Editing tools reject PIE/save/GC busy states and read-only MovieScenes, and use editor transactions for Undo.

Keyframe positions use the sequence’s `TickResolution`; see [Time Units and Frame Rates](/en/works/mcp-level-sequence/docs/sequence-timing/).
