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
sourceHash: 44a958577d2e93d586ee2ef605417c2335d888bfd85350111a2b1a9f99a5fe6d
translationStatus: translated
generatedBodyHash: 983b029ac772a05a084bf59c607eef0d4a52efc87e872f3de3f05cbc3e7cf7a1
docPage:
  work: mcp-level-sequence
  group: features
  slug: sequence-keyframes
  order: 5
---

## Supported channels and pagination

| Group | Tools | Purpose |
|---|---|---|
| Key | `GetKeyframes`, `SetKeyframes`, `RemoveKeyframes` | Page, write, and remove keys |

Keyframe tools support three channel families: Double for Transform, Float for Float/Fade, and Bool for Bool property tracks. `GetSequenceDetail` returns track and section structure but does not enumerate channels; use the `ChannelName` contract for the selected track type when calling keyframe tools.

Find the track and section first, then choose the channel for that track type. Read the channel’s keys before changing or removing them, and check the frame positions and value type. After editing, check the same channel.

- `GetKeyframes`: 200 by default, capped at 1000 and returns `NextOffset`.

Paged responses report totals, the current offset, whether more data exists, and a `NextOffset` when applicable. Clients should continue paging instead of assuming that one response contains the whole asset.

Mutation and save tools accept only valid `/Game/...` Level Sequence paths. Read-only discovery, inspection, opening, capture, and closing may access other readable sequence locations. Editing tools reject PIE/save/GC busy states and read-only MovieScenes, and use editor transactions for Undo.

Keyframe positions use the sequence’s `TickResolution`; see [Time Units and Frame Rates](/en/works/mcp-level-sequence/docs/sequence-timing/).
