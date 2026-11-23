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
sourceHash: 11a78f9b702247410c24e4abcd98176c0f7d32748090b02a0a157e771e5cb1b3
translationStatus: translated
generatedBodyHash: feedb5186ba3e05fbaa8cfca81150e3159950fb6f1a975d1b5bb259cd3643f9c
docPage:
  work: mcp-level-sequence
  group: features
  slug: edit-sequence
  order: 4
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

Choose a track type with `ListTrackTypes`. Check whether it belongs at the root or under an object binding, then add the track and section. To edit an existing section, find its track in the sequence details first.

Float and Bool property tracks require `PropertyName` and accept `PropertyPath` for nested properties. Skeletal Animation sections require `AnimationAssetPath`, validated as `AnimSequenceBase`; Audio sections require `SoundAssetPath`, validated as `SoundBase`. Event tracks currently create section containers only; they do not create Director Blueprint endpoints or event payloads.

## Transactions, removal, and limits

Mutation and save tools accept only valid `/Game/...` Level Sequence paths. Read-only discovery, inspection, opening, capture, and closing may access other readable sequence locations. Editing tools reject PIE/save/GC busy states and read-only MovieScenes, and use editor transactions for Undo.

Deleting a Track also removes objects it owns. Ambiguous name selectors return an error; use the `TrackName` from `GetSequenceDetail`.

There are currently no write tools for creating or navigating subsequences.

The plugin does not support arbitrary track or class creation, folders, tags, selection state, or advanced bone-level operations. The official experimental toolset covers more operations.

Section bounds use the sequence’s `TickResolution`; see [Time Units and Frame Rates](/en/works/mcp-level-sequence/docs/sequence-timing/).
