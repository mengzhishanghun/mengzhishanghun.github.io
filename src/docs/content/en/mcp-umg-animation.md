---
title: Edit UMG Animations
type: doc
slug: mcp-umg-animation
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-umg
documentKind: product-manual
websiteRoute: /en/works/mcp-umg/docs/animation/
lang: en
translationKey: doc:mcp-umg:animation
sourceHash: 047530e29ef7c8efe53e1354097e8d4a34da2e62bf6abd0f35a413b41bafbe91
translationStatus: translated
generatedBodyHash: 049e5fa8136674ec64836a5a57ee6fe5581c1d0903a976b11b6211ee1e934177
docPage:
  work: mcp-umg
  group: features
  slug: animation
  order: 12
---

## Animation tools

Before editing an animation, confirm its name with `ListAnimations`, then use `GetAnimationDetail` to find the track and channel. If you want to keep the original, duplicate it and edit the copy.

| Tool | Description |
|------|-------------|
| ListAnimations | List all animations |
| GetAnimationDetail | Get animation details |
| CreateAnimation | Create animation |
| DeleteAnimation | Delete animation |
| AddAnimationTrack | Add animation track |
| RemoveAnimationTrack | Remove one precisely addressed animation property track |
| SetAnimationKeys | Set animation keyframes |
| DuplicateAnimation | Copy an animation with its tracks and widget bindings |
| SetAnimationPlaybackRange | Set an animation's playback range in seconds |
| EditAnimationKeys | Dry-run and precisely delete, clear or shift selected keys |
| RenameAnimation | Rename an existing animation |

## Duplicate animations, set ranges, and edit keys

`DuplicateAnimation` deep-copies the source animation's MovieScene, tracks and Widget bindings while leaving the source unchanged. The new name must be unique. `SetAnimationPlaybackRange` sets `[StartSeconds, EndSeconds)` in seconds, validating all parameters before writing in a single transaction. Both tools leave the edits in memory. Save the asset separately.

Cubic keys in `SetAnimationKeys` can use `TangentMode` (`Auto`, `User`, `Break`) and finite numeric `ArriveTangent` and `LeaveTangent`. Tangents on Linear or Constant keys are rejected without modifying the asset.

`GetAnimationDetail` returns tangent mode and arrive/leave tangents for Cubic keys. The engine calculates `Auto` tangents; use `User` or `Break` for manual slopes. Tangents must be JSON numbers representable as float.

`GetAnimationDetail` also pages through binding GUIDs, track/section indices and Float, Bool and Byte channel keys. Use it to identify the exact location, then call `EditAnimationKeys` to delete, clear or shift keys in one channel. The request requires `BindingGuid`, `WidgetName` (plus `SlotWidgetName` for Slot bindings), `TrackIndex`, `SectionIndex`, `ChannelType` and `ChannelIndex`. `Operation` is `Delete`, `Clear` or `Shift`. Select keys with an array of integer tick frames, `Frames`, or supply both `StartSeconds` and `EndSeconds`, including both endpoints. `Clear` without a selector clears the entire channel. `Shift` also requires `ShiftSeconds`; destinations must not collide with existing keys or fall outside the playback range.

`bDryRun` defaults to `true` and returns the section's `Fingerprint` and affected key count. To apply, pass `bDryRun:false` with that value as `ExpectedFingerprint`; stale fingerprints are rejected. The Blueprint still requires an explicit save afterward.

```json
{"BlueprintPath":"/Game/UI/WBP_Menu","SourceAnimationName":"FadeIn","NewAnimationName":"FadeInFast"}
```

`RenameAnimation` takes `BlueprintPath`, an existing `AnimationName` and a unique `NewAnimationName`. The new name must not conflict with widgets, other animations or Blueprint members. Renaming is rejected if a native parent-class `BindWidgetAnim` or `BindWidgetAnimOptional` property uses the old name, if known external assets reference the Widget Blueprint, or if graph string pins contain the old animation name. Review those dependencies manually first. Explicit saving is still required after renaming.

```json
{"BlueprintPath":"/Game/UI/WBP_Menu","AnimationName":"FadeIn","NewAnimationName":"FadeInFast"}
```
