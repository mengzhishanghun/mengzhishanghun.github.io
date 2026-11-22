---
title: Edit Sequence Tracks and Sections
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
sourceHash: d4e074031c81c2405a856d9e5d1a02829f2e287acd42d4798b261ed36b9a155b
translationStatus: translated
generatedBodyHash: 6257faa08cf7d03deee0eb559ae27e5450ebf42d358bbb1b5156471791f8ee0b
docPage:
  work: mcp-level-sequence
  group: sequence-editing
  slug: edit-sequence
  order: 2
---

## Supported tracks and sections

| Group | Tools | Purpose |
|---|---|---|
| Track | `ListTrackTypes`, `AddTrack`, `RemoveTrack` | Query, add, and cascade-remove tracks |
| Section | `AddSection`, `RemoveSection`, `SetSectionRange` | Create, remove, and resize sections |

`AddTrack` supports eight track classes:

- Binding tracks: `MovieScene3DTransformTrack`, `MovieSceneFloatTrack`, `MovieSceneBoolTrack`, and `MovieSceneSkeletalAnimationTrack`.
- Root or binding tracks: `MovieSceneAudioTrack` and `MovieSceneEventTrack`.
- Root-only tracks: `MovieSceneCameraCutTrack` and `MovieSceneFadeTrack`.

Float and Bool property tracks require `PropertyName` and accept `PropertyPath` for nested properties. Skeletal Animation sections require `AnimationAssetPath`, validated as `AnimSequenceBase`; Audio sections require `SoundAssetPath`, validated as `SoundBase`. Event tracks currently create section containers only; they do not create Director Blueprint endpoints or event payloads.

## Transactions, removal, and limits

Mutation and save tools accept only valid `/Game/...` Level Sequence paths. Read-only discovery, inspection, opening, capture, and closing may access other readable sequence locations. Editing tools reject PIE/save/GC busy states and read-only MovieScenes, and use editor transactions for Undo.

Deleting a Track also removes objects it owns. Ambiguous name selectors return an error; use the `TrackName` from `GetSequenceDetail`.

Subsequence creation/navigation needs cycle checks, hierarchy ownership, and cross-sequence time semantics, so write tools are not exposed yet.

Arbitrary track/class creation, folders, tags, selection state, and advanced bone-level operations remain outside the reviewed strict-schema surface, although the official experimental toolset is broader.

Section bounds use the sequence’s `TickResolution`; see [Time Units and Frame Rates](/en/works/mcp-level-sequence/docs/sequence-timing/).
