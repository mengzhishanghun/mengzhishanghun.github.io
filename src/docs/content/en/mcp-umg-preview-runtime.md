---
title: Preview Widgets and Compare Screenshots
type: doc
slug: mcp-umg-preview-runtime
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-umg
documentKind: product-manual
websiteRoute: /en/works/mcp-umg/docs/preview-runtime/
lang: en
translationKey: doc:mcp-umg:preview-runtime
sourceHash: 05108766126dc2bfde69018792384eced7bc408f96d4f0fc24e0fb08aed395ec
translationStatus: translated
generatedBodyHash: d9a10fa4daeea5201c905bb93be31d67f4f14c8d85c6a392031facbf2a21fb65
docPage:
  work: mcp-umg
  group: features
  slug: preview-runtime
  order: 15
---

## Off-screen previews

Decide which view you need. Use an off-screen preview to check the compiled widget’s initial appearance or sample data. To see what PIE or Game is displaying, capture the existing instance. To compare an empty list with a populated one, preview both states at the same sizes.

List samples use temporary asset copies, without passing the original assets directly to list entries. External resources referenced by those copies may still be shared. Widget lifecycles and list callbacks can run project code; this is not a script sandbox. Business logic used for previews should have no side effects.

`CaptureWidgetPreview` creates a fresh temporary instance of a compiled Widget Blueprint, applies preview-only data and returns an off-screen PNG. Use the runtime screenshot tool below to capture a live game widget.

The tool does not edit or save the Widget Blueprint, its WidgetTree or existing PIE/Game instances, nor modify assets supplied as list samples. It does not compile the Blueprint either. Compile explicitly first and ensure its status is `UpToDate`.

### Single-preview parameters

| Parameter | Required | Description |
| --- | --- | --- |
| `BlueprintPath` | Yes | Widget Blueprint asset path. |
| `Width`, `Height` | Yes | Positive integer pixels, each at most 4096, with a product no greater than 8 MP. |
| `InstanceProperties` | No | Editable properties on the temporary `UUserWidget` instance, formatted as `{ "Property": "UE text format" }`. |
| `WidgetOverrides` | No | Up to 64 `{ "name": "WidgetName", "properties": { ... } }` entries; properties affect only the corresponding Widget in the temporary tree. |
| `ListSamples` | No | Up to 64 `{ "name": "ListWidgetName", "items": ["/Game/...Asset.Asset"] }` entries; data binds only to temporary ListView/TileView/TreeView widgets. At most 100 items per list and 200 per call; empty lists are allowed. |
| `AnimationName`, `TimeSeconds` | No | Must be supplied together. Time is a non-negative absolute timeline time within the MovieScene playback range, not an offset from the start of the animation. |

Every `WidgetOverrides` entry requires non-empty `properties`. Widget names in `WidgetOverrides` and list names in `ListSamples` must each be unique within their respective arrays. Duplicate asset paths within a list are rejected. Values in each `properties` map use Unreal text format, following the same rules as `SetWidgetProperties`.

```json
{
  "BlueprintPath": "/Game/UI/WBP_Inventory",
  "Width": 1280,
  "Height": 720,
  "InstanceProperties": { "Title": "预览背包" },
  "WidgetOverrides": [
    { "name": "TitleText", "properties": { "RenderOpacity": "0.8" } }
  ],
  "ListSamples": [
    { "name": "ItemList", "items": ["/Game/Items/DA_Sword.DA_Sword"] },
    { "name": "EmptyStateList", "items": [] }
  ]
}
```

The response explicitly reports `PreviewState: TemporaryNewInstance`, `RuntimeState: NotRuntime`, `ProductionState: Unchanged` and `SaveStatus: NotSaved`, with the PNG. It also returns the actual RenderTarget dimensions, pixel count, two layout renders, and counts of applied Widget overrides and list samples.

When an animation is specified, the tool samples visual tracks on a temporary animation copy with a silent MovieScene evaluator, removes event tracks and returns the quantized `ActualTimeSeconds`. Supported visual tracks include Float, Bool, Enum, Color, 2D Transform, Margin and Widget Material. Other tracks cannot serve as arbitrary script execution. This mechanism does not prevent project code in Widget Construct or list callbacks from running.

For Widget Material animation, the tool creates a separate dynamic material instance (MID) for each material location actually used by the track, copies the original instance's parameter overrides and replaces only the corresponding Brush on the temporary Widget. Sampling does not modify shared source MIDs or other Widgets. The Brush must use a valid MID with a valid parent material that is not itself an MID. MIDs with runtime virtual texture, sparse volume texture, texture collection or parameter collection overrides cannot be copied completely, so these previews are rejected.

Creating any `UUserWidget` enters its Blueprint construction lifecycle. The tool does not call project-specific initialization methods or arbitrary Blueprint functions, but user-authored Construct code may itself have side effects. It therefore cannot promise that every Blueprint behaves as a pure function.

## Preview multiple states and sizes

`CaptureWidgetPreviewMatrix` generates design-preview PNGs for `States × Sizes`. Every cell creates a fresh temporary Widget instance so states do not contaminate each other. Results are sorted by state name and size name; `Cells[].PngIndex` indexes the returned image array.

`States` and `Sizes` are required and non-empty. Their Cartesian product is limited to 16 cells and 32 MP in total. Each image still has the `CaptureWidgetPreview` limits of 4096 pixels per side and 8 MP. Each state can include the `InstanceProperties`, `WidgetOverrides` and `ListSamples` options already supported by `CaptureWidgetPreview`.

`ListSamples.items` supports safe top-level asset path strings or dynamic samples in the form `{ "class": "...", "properties": { ... } }`. Dynamic classes must be non-abstract, non-deprecated subclasses of `UDataAsset` or `UCurveBase` with `Within=UObject`. Actor, ActorComponent, World, GameInstance, Subsystem and similar types are rejected. `UDataAsset` itself is abstract; supply a concrete project subclass or use `/Script/Engine.CurveFloat`. Properties are validated against the CDO before `NewObject` creates the object in the transient package. The tool does not call arbitrary functions, save objects or write business assets. Existing samples are copied into the transient package for each cell, preventing entry logic from directly modifying source assets or sharing one instance across states.

This isolation is not recursive. The tool cannot prevent effects through external asset references or side effects that Widget Construct/list-entry code produces in external systems.

```json
{
  "BlueprintPath": "/Game/UI/WBP_Inventory",
  "States": [
    { "name": "empty", "ListSamples": [{ "name": "ItemList", "items": [] }] },
    { "name": "populated", "ListSamples": [{ "name": "ItemList", "items": ["/Game/Items/DA_Sword.DA_Sword"] }] },
    { "name": "curve", "ListSamples": [{ "name": "ItemList", "items": [{ "class": "/Script/Engine.CurveFloat" }] }] },
    { "name": "disabled", "WidgetOverrides": [{ "name": "BuyButton", "properties": { "bIsEnabled": "False" } }] }
  ],
  "Sizes": [
    { "name": "phone", "width": 390, "height": 844 },
    { "name": "desktop", "width": 1280, "height": 720 }
  ]
}
```

Batch previews still use a temporary design-time instance with the `TemporaryNewInstance` state. They do not show what PIE or Game is rendering. You cannot currently set an animation time to capture a particular frame.

## Capture a design view or a running widget

| Tool | Purpose |
| --- | --- |
| CaptureWidgetScreenshot | Capture Widget design view as PNG |
| CaptureRuntimeWidgetScreenshot | Capture an existing PIE/Game Widget instance at its actual Slate window geometry as PNG; never creates a widget or injects preview state |
| CompareUIImages | Compare two UI images without automatic resizing, cropping or alignment, and return a heatmap |

`CaptureRuntimeWidgetScreenshot` requires the MCPUMG editor module and an existing runtime Widget instance. A standalone `-game` process is not guaranteed to expose the MCPUMG server.
