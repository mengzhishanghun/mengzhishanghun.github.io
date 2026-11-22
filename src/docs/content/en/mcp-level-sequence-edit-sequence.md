---
title: Edit Tracks, Sections, and Channels
type: doc
slug: mcp-level-sequence-edit-sequence
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-level-sequence
documentKind: product-manual
websiteRoute: /en/works/mcp-level-sequence/docs/edit-sequence/
lang: en
translationKey: doc:mcp-level-sequence:edit-sequence
sourceHash: 9409ffd2bce8b17838952835c08247255c06018dd42324ba6e45eaf2fe8f2635
translationStatus: translated
generatedBodyHash: 3ebacf5730327facea36903f5883990500f2631f7d9435b7abc8a15e78cb6ad6
docPage:
  work: mcp-level-sequence
  group: workflows
  slug: edit-sequence
  order: 1
---

## Tracks, sections, and channels

`AddTrack` supports eight track classes:

- Binding tracks: `MovieScene3DTransformTrack`, `MovieSceneFloatTrack`, `MovieSceneBoolTrack`, and `MovieSceneSkeletalAnimationTrack`.
- Root or binding tracks: `MovieSceneAudioTrack` and `MovieSceneEventTrack`.
- Root-only tracks: `MovieSceneCameraCutTrack` and `MovieSceneFadeTrack`.

Float and Bool property tracks require `PropertyName` and accept `PropertyPath` for nested properties. Skeletal Animation sections require `AnimationAssetPath`, validated as `AnimSequenceBase`; Audio sections require `SoundAssetPath`, validated as `SoundBase`. Event tracks currently create section containers only; they do not create Director Blueprint endpoints or event payloads.

Keyframe tools support three channel families: Double for Transform, Float for Float/Fade, and Bool for Bool property tracks. `GetSequenceDetail` returns track and section structure but does not enumerate channels; use the `ChannelName` contract for the selected track type when calling keyframe tools.

## Time units and frame rates

Every `StartFrame`, exclusive `EndFrame`, key position, and camera-cut frame uses the sequence's `TickResolution`, not its `DisplayRate`. `GetSequenceDetail` returns both rational rates.

`SetSequenceRates` can set the Display Rate, Tick Resolution, or both. Each supplied rate requires a positive integer numerator and denominator. When Tick Resolution changes, the plugin uses the engine's frame-time migration path for playback/selection ranges, tracks, sections, keys, and marked frames, preserving real time. It does not recursively modify Subsequence assets.

## Pagination and output limits

- `ListSequences`: 100 by default, capped at 500 per page.
- `ListBindings`: 100 by default, capped at 500 and stably sorted by BindingId.
- `GetKeyframes`: 200 by default, capped at 1000 and returns `NextOffset`.
- `GetSequenceDetail`: pages a stable combined Binding/Track/Section traversal with `Offset` and `MaxItems`.
- `CaptureSequencerView`: at most 16 Mi pixels and 8 MiB of compressed PNG data.

Paged responses report totals, the current offset, whether more data exists, and a `NextOffset` when applicable. Clients should continue paging instead of assuming that one response contains the whole asset.

## Writes, transactions, and asset lifecycle

Mutation and save tools accept only valid `/Game/...` Level Sequence paths. Read-only discovery, inspection, opening, capture, and closing may access other readable sequence locations. Editing tools reject PIE/save/GC busy states and read-only MovieScenes, and use editor transactions for Undo.

A successful edit only marks the package dirty; it never saves implicitly. `SaveAsset` saves only the specified Level Sequence package. After requesting a close, `CloseAsset` queries editors for the asset and its subobjects again; if an editor refuses to close, the tool reports failure instead of a false success.

Binding and track removal cascade through owned objects. Binding removal also removes local Camera Cut sections that reference the subtree in the same transaction. Destructive operations are rejected for invalid, locked, read-only, or unresolved non-local Camera Cut sequence references. Name selectors report ambiguity instead of choosing the first match. Prefer `BindingId` from `ListBindings` and `TrackName` from `GetSequenceDetail`.

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

The recommended flow is to call `ListSequences` and `GetSequenceDetail`, perform mutations with stable IDs/names, and then call `SaveAsset` explicitly.
