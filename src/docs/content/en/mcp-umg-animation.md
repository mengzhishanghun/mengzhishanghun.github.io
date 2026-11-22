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
sourceHash: 815502428e6417b0074723555c5c388dba5be41b6d0a1b9d724ac732078533f5
translationStatus: translated
generatedBodyHash: 37f446c9b3e349a726d50adc3e1dc6011f8e99498829fe85e9ded18f94fb759b
docPage:
  work: mcp-umg
  group: interaction-frameworks
  slug: animation
  order: 3
---

## Animation tools

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

`DuplicateAnimation` deep-copies the source animation's MovieScene, tracks and Widget bindings while leaving the source unchanged. The new name must be unique. `SetAnimationPlaybackRange` sets `[StartSeconds, EndSeconds)` in seconds, validating all parameters before writing in a single transaction. Both tools only mark assets dirty and do not save.

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
