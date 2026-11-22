---
title: Configure Events, Navigation, and Animation
type: doc
slug: mcp-umg-events-navigation-animation
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-umg
documentKind: product-manual
websiteRoute: /en/works/mcp-umg/docs/events-navigation-animation/
lang: en
translationKey: doc:mcp-umg:events-navigation-animation
sourceHash: 20b1b916f46e6b987ee9491eb50fed6fc70307f16d249188c3fe891832f331eb
translationStatus: translated
generatedBodyHash: 4a9ae7824379b1437f39f493e23ca36ff8e868067af39484b4c3ee2b4d8b637b
docPage:
  work: mcp-umg
  group: workflows
  slug: events-navigation-animation
  order: 3
---

### UMG Animations (11 tools)
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

### Event Logic
| Tool | Description |
|------|-------------|
| BindWidgetEvent | Bind widget event |
| UnbindWidgetEvent | Remove a widget event binding |
| AddEventActions | Add event actions |
| CreateWidgetBlueprint | Create Widget Blueprint |
| SaveWidgetBlueprint | Compile and save exactly one Widget Blueprint without Save All or unrelated dirty packages |
| SetWidgetBlueprintSettings | Set Widget Blueprint settings |
| SetPropertyBinding | Set a widget property binding |
| ImportUITexture | Import a local PNG/JPEG as a UI Texture2D with budget limits and overwrite checks |
| ImportUIFont | Import one local TTF/OTF file as paired FontFace and UFont assets |
| SaveUIAsset | Save exactly one Texture2D, FontFace, or UFont package |

The opt-in `MCPUMGMVVM` Editor module adds `GetMVVMViewDetails`, `ValidateMVVMBindingAdvanced`, `SetMVVMBinding`, `RemoveMVVMBinding`, `UpdateMVVMViewModelContext`, and `RemoveMVVMViewModelContext`. Native MVVM availability alone does not load this module. See [optional UI frameworks](/en/works/mcp-umg/docs/components-styles/#optionaluiframeworks).

For the complete reference-image workflow and schema, see [Reference image to UMG](/en/works/mcp-umg/docs/layout/#imagetoumg). For runtime instance tokens, input, lists, operations and diagnostics, see [Runtime interaction and diagnostics](/en/works/mcp-umg/docs/preview-runtime/#runtimeworkflow). Navigation, components, previews, styles and fonts are covered in [Navigation](#navigation), [Components](/en/works/mcp-umg/docs/components-styles/#components), [Preview](/en/works/mcp-umg/docs/preview-runtime/#preview) and [Common widget styles](/en/works/mcp-umg/docs/components-styles/#commonstyles). See [Themes](/en/works/mcp-umg/docs/components-styles/#themes), [Preview matrix](/en/works/mcp-umg/docs/preview-runtime/#previewmatrix), [Animation workflow](#animationworkflow) and [Component extraction](/en/works/mcp-umg/docs/components-styles/#componentextraction) for those workflows, and [Batch property migration](/en/works/mcp-umg/docs/batch-migration/#batchmigration), [Performance structure diagnostics](/en/works/mcp-umg/docs/preview-runtime/#performance) and [Optional UI frameworks](/en/works/mcp-umg/docs/components-styles/#optionaluiframeworks) for the remaining tools.

## Navigation

### UMG navigation tools

`SetWidgetNavigation` configures native `UWidgetNavigation` data for one widget in a Widget Blueprint template. It does not send input, change runtime focus or save assets. A successful call only marks the in-memory asset dirty; call `SaveWidgetBlueprint` when ready to save.

#### Read all six directions

```json
{"BlueprintPath":"/Game/UI/WBP_Menu","WidgetName":"PlayButton"}
```

`GetWidgetNavigation` always returns `Up`, `Down`, `Left`, `Right`, `Next` and `Previous`. If no navigation object is configured, all six report `Escape`.

#### Partial updates and preflight

`Rules` updates only the supplied directions and leaves the rest unchanged. Supported rules are `Escape`, `Stop`, `Wrap`, `Explicit` and `Custom`. An `Explicit` target must be a different widget in the same `WidgetTree`. `Custom` requires a `CustomFunction` already present in the Widget Blueprint generated class with the signature `UWidget* Function(EUINavigation)`.

```json
{
  "BlueprintPath":"/Game/UI/WBP_Menu",
  "WidgetName":"PlayButton",
  "Rules":{
    "Down":{"Rule":"Explicit","TargetWidget":"OptionsButton"},
    "Next":{"Rule":"Wrap"}
  },
  "dryRun":true
}
```

Omit `dryRun` or set it to `false` to validate all directions first and write them together in one transaction. To restore a direction's default escape rule, submit just that direction:

```json
{"BlueprintPath":"/Game/UI/WBP_Menu","WidgetName":"PlayButton","Rules":{"Down":{"Rule":"Escape"}}}
```

Invalid directions, missing/cross-tree/self-referencing explicit targets and missing custom functions fail before any object is modified.

## AnimationWorkflow

### Animation workflow

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
