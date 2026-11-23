---
title: Set Playback Range and Frame Rates
type: doc
slug: mcp-level-sequence-sequence-timing
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-level-sequence
documentKind: product-manual
websiteRoute: /en/works/mcp-level-sequence/docs/sequence-timing/
lang: en
translationKey: doc:mcp-level-sequence:sequence-timing
sourceHash: 39634b320bc7fcb0d8f699f738d8e25dfbe9886876ecb45fbab76eca7509c872
translationStatus: translated
generatedBodyHash: b9ec5ed76e1e2a6fceff00b4c7026ebc82d08db134db22407b7dbc8b416fe9f8
docPage:
  work: mcp-level-sequence
  group: features
  slug: sequence-timing
  order: 6
---

## Time units and frame rates

Every `StartFrame`, exclusive `EndFrame`, key position, and camera-cut frame uses the sequence's `TickResolution`, not its `DisplayRate`. `GetSequenceDetail` returns both rational rates.

`SetSequenceRates` can set the Display Rate, Tick Resolution, or both. Each supplied rate requires a positive integer numerator and denominator. When Tick Resolution changes, the plugin uses the engine's frame-time migration path for playback/selection ranges, tracks, sections, keys, and marked frames, preserving real time. It does not recursively modify Subsequence assets.

| Group | Tools | Purpose |
|---|---|---|
| Time | `SetPlaybackRange`, `SetSequenceRates` | Set playback ranges, display rates, and tick resolutions |

Mutation and save tools accept only valid `/Game/...` Level Sequence paths. Read-only discovery, inspection, opening, capture, and closing may access other readable sequence locations. Editing tools reject PIE/save/GC busy states and read-only MovieScenes, and use editor transactions for Undo.

## Call example

This request sets the Display Rate to 24 fps and migrates the Tick Resolution to 24000 fps. One second spans 24 display frames in the editor and 24000 units in a tool’s frame arguments. For a one-second playback range starting at 0, use 24000 as the exclusive end.

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "SetSequenceRates",
    "arguments": {
      "AssetPath": "/Game/Cinematics/MySequence",
      "DisplayRateNumerator": 24,
      "DisplayRateDenominator": 1,
      "TickResolutionNumerator": 24000,
      "TickResolutionDenominator": 1
    }
  }
}
```
