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
sourceHash: 2766fd51f54fd3b44d7f5bc8516264a675bcdcdf614445893ecfe7825761379a
translationStatus: translated
generatedBodyHash: 1f8588d06b6cf2e1245aa43d0c90df5d838e2879029ed1c226c4d12222e451ca
docPage:
  work: mcp-level-sequence
  group: sequence-editing
  slug: sequence-timing
  order: 4
---

## Time units and frame rates

Every `StartFrame`, exclusive `EndFrame`, key position, and camera-cut frame uses the sequence's `TickResolution`, not its `DisplayRate`. `GetSequenceDetail` returns both rational rates.

`SetSequenceRates` can set the Display Rate, Tick Resolution, or both. Each supplied rate requires a positive integer numerator and denominator. When Tick Resolution changes, the plugin uses the engine's frame-time migration path for playback/selection ranges, tracks, sections, keys, and marked frames, preserving real time. It does not recursively modify Subsequence assets.

| Group | Tools | Purpose |
|---|---|---|
| Time | `SetPlaybackRange`, `SetSequenceRates` | Set playback ranges, display rates, and tick resolutions |

Mutation and save tools accept only valid `/Game/...` Level Sequence paths. Read-only discovery, inspection, opening, capture, and closing may access other readable sequence locations. Editing tools reject PIE/save/GC busy states and read-only MovieScenes, and use editor transactions for Undo.

## Call example

This request sets a 24 fps display rate and migrates Tick Resolution to 24000 fps:

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
