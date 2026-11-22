---
title: Edit the Widget Tree and Inspect Layout
type: doc
slug: mcp-umg-layout
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-umg
documentKind: product-manual
websiteRoute: /en/works/mcp-umg/docs/layout/
lang: en
translationKey: doc:mcp-umg:layout
sourceHash: 53ba77736578bd5048ccce6316fb24d03f6335501ed02e1fbaf419dda17fe4c5
translationStatus: translated
generatedBodyHash: b6205f0575f337330ed83efe62568ecbaadc73eb3a471e2cef06ff6a4b6fb01d
docPage:
  work: mcp-umg
  group: workflows
  slug: layout
  order: 1
---

### Widget Tree Editing
| Tool | Description |
|------|-------------|
| AddWidget | Add widget |
| RemoveWidget | Remove widget |
| RenameWidget | Rename widget and update related bindings |
| ReparentWidget | Move widget to new parent |
| DuplicateWidget | Duplicate a widget subtree |
| WrapWidget | Wrap a widget in a new parent container |
| SetWidgetProperties | Set widget properties |
| SetSlotProperties | Set slot properties (layout parameters) |
| SetListViewEntryClass | Configure a validated `IUserObjectListEntry` class for ListView, TileView, or TreeView |
| ApplyWidgetTreePatch | Dry-run or atomically apply a complete-tree or incremental Widget Spec v1 patch |
| SetWidgetStyle | Apply structured Image, Border, TextBlock, or Button styles |
| SetWidgetLayout | Strict structured SizeBox, Canvas, Box and common Slot editing with dryRun |
| SetWidgetNavigation | Patch selected native UMG navigation directions without saving |
| GetWidgetNavigation | Read all six native UMG navigation directions |
| SetWidgetInstanceProperties | Set editable properties on a nested UserWidget instance |
| InteractWithWidget | Send scoped click, wheel, text, drag, drag-drop, or navigation input to a live Widget |
| ControlWidgetList | Inspect or change selection, expansion and scrolling on a live list |
| SetNamedSlotContent | Create, replace, clear, or move Named Slot content |
| CaptureWidgetPreview | Render a temporary Widget instance and return an off-screen PNG |
| ExtractWidgetComponent | Copy a Widget subtree or replace it with an extracted instance, with optional supported-dependency migration |
| ApplyWidgetTheme | Preflight and apply a portable style/theme object |
| ExportWidgetTheme | Export portable styles for explicit widgets |
| BatchSetWidgetProperties | Preflight and apply bounded property changes across Widget Blueprints |
| ConfigureCommonUIWidget | Configure a supported existing CommonUI widget instance |
| AddMVVMViewModelContext | Add a supported MVVM viewmodel context |
| InspectCommonUI | Inspect a live CommonUI widget |
| ControlCommonUI | Activate, deactivate, push or remove supported live CommonUI widgets |
| ConfigureCommonUIInput | Set allowlisted existing CommonUI input asset references |

`SetListViewEntryClass` persists only the entry class. Unreal marks `UListView::ListItems` as transient, so populate items from Blueprint or runtime data with `SetListItems`/`AddItem`.

## ImageToUMG

### Reference image to UMG workflow

MCPUMG does not connect to image models or store model keys inside the plugin. The AI client interprets the reference image, checks its text, identifies reusable components and generates a structured specification. MCPUMG validates, builds, measures and saves Unreal Engine assets deterministically.

#### Workflow

1. Call `GetUIDesignCapabilities` to read the current schema, limits, and supported Widget and style capabilities.
2. Have the AI generate a Widget specification with `schemaVersion=1`, stating the design dimensions, layout assumptions and asset sources.
3. Use `ImportUITexture` to import PNG/JPEG files. Overwriting existing assets is disabled by default.
4. Use `ApplyWidgetTreePatch` with `dryRun` to preview the complete tree or incremental operations.
5. The dry run returns simulated results. For the actual call, retain the pre-preview `expectedRevision` and `expectedFingerprint`, change `dryRun` to `false`, obtain the canonical `inputHash` again, and execute the same operations.
6. Apply structured Brush, text or Button state styles with `SetWidgetStyle`.
7. Read back the structure and properties with `ExportWidgetSpec` and `GetWidgetTree`.
8. Check screen-pixel bounds, clipping, text overflow and resource status with `InspectWidgetLayout`.
9. Capture the design or runtime view with `CaptureWidgetScreenshot` or `CaptureRuntimeWidgetScreenshot`.
10. Compare it with the reference using `CompareUIImages`, then have the AI generate the next patch from the differences.
11. After checking the result, call `SaveWidgetBlueprint` and `SaveUIAsset` separately to save the exact target packages.

#### Check the running version and file locks

- At the start of each session, use `tools/list` from the running editor as the authority. Updated source or installation files do not mean an open editor has loaded the new DLL. If the tool count or capability descriptions differ, check the deployment directory and restart the target editor.
- An old `-game`, PIE or second editor process for the same project may still hold a `.uasset` file handle. If `SaveWidgetBlueprint` fails, inspect `LogSavePackage` and the system error code in the project log. Windows `Error 32` means a sharing violation. Close only a stale process whose command line explicitly identifies the same project, then retry the exact save.
- Do not bypass file locks with `Save All`, external file overwrites or repeated patches. If the patch succeeded but saving failed, memory may already contain the new version. Keep the current editor open, release the lock and call `SaveWidgetBlueprint` without repeating the write operation.
- `CaptureRuntimeWidgetScreenshot` requires the MCPUMG editor module to be loaded and the target Widget instance to exist. A process started only with `-game` may not load editor modules. For runtime measurement, use an editor PIE/Game session with the plugin loaded.

#### Widget Spec v1

The top-level specification contains:

- `schemaVersion`: fixed at `1`.
- `BlueprintPath`: the single target Widget Blueprint.
- `expectedRevision`, `expectedFingerprint`: optimistic concurrency checks.
- `requestId`, `inputHash`: identifiers for idempotent calls.
- `dryRun`: preview or actual execution. Recalculate `inputHash` when this field changes.
- `operations`: `create`, `set`, `move`, `rename`, `remove`.

Stable names identify nodes, which contain `class`, `parent`, `order`, `properties` and `slot`. Before making changes, the plugin checks for a single root, cycles, container compatibility, names, properties, Slots, node count, depth and the cumulative text budget. Errors should return an exact JSON Pointer.

#### Styles and assets

##### Layout inspection does not establish a valid layout

`dryRun` validates the tree and properties without running Slate layout. Design mode in `InspectWidgetLayout` provides metadata only. PIE mode adds direct Slate parent bounds, up to 64 clipping ancestors (at most 256 entries per page), and signs of vertical overflow, including automatically wrapped text. Locate `PossibleAncestorClipping` and `PossibleVerticalOverflow` issues using the actual screenshot. `Unverified*` means there is insufficient evidence, not that a check passed.

Ancestor rectangles are screen-space axis-aligned bounding boxes, not the final paint clipping region. Rotation, OnDemand, ClipToBoundsWithoutIntersecting, custom painting and stale cached geometry can affect the findings. The tool does not create instances, force preview data or change runtime state for diagnostics. Let the real page finish its layout before inspecting the target instance.

##### Updating, zeroing and resetting properties

`SetWidgetProperties` and `SetSlotProperties` use partial updates by default. `Properties={}` is invalid; `Padding="()"` retains existing structure members rather than zeroing them. To set zero padding, supply all four edges explicitly: `(Left=0,Top=0,Right=0,Bottom=0)`.

The optional `ResetToClassDefault=true` first restores only the top-level fields specified in `Properties` to their Widget/Slot class CDO defaults, then imports the supplied values. It leaves other fields and the class default object unchanged. It does not mean zero values or read overrides from parent Blueprint instances. The returned `PropertyUpdateMode` distinguishes `PatchCurrentValue` from `ResetToClassDefault`.

##### Explicit rounded corners and Button padding

Brushes in `SetWidgetStyle` support `drawType="RoundedBox"`. `outline` is a complete object requiring four corner radii, width, color and `roundingType`. Use `FixedRadius` to draw the specified corner radii; `HalfHeightRadius` produces a capsule. `resource:null` explicitly clears the Brush resource. Omitted fields retain their values.

```json
{
  "Brush": {
    "drawType": "RoundedBox",
    "outline": {
      "topLeft": 4, "topRight": 4, "bottomRight": 4, "bottomLeft": 4,
      "width": 1,
      "color": {"r": 0.4, "g": 0.25, "b": 0.06, "a": 1},
      "roundingType": "FixedRadius"
    }
  }
}
```

Buttons use `Style.Button.normalPadding` / `pressedPadding`, each containing four numbers for `left/top/right/bottom`. Explicit zero values and finite negative values for intentional overlap are supported. Button style padding adds to ButtonSlot padding; nine-slice Brush.margin is not content padding. Structured style values must use JSON numbers. Unknown nested fields are rejected, and the entire call is validated before any changes.

`SetWidgetStyle` accepts JSON objects without requiring callers to assemble UE text structures:

- Brush: resource, draw type, image size, color, nine-slice Margin, tiling and UV.
- Text: color and font size.
- Button: Normal, Hovered, Pressed and Disabled Brushes.

Texture import explicitly sets sRGB, UI compression, no Mips and the UI Texture Group. Materials may reference only existing Material Instances whose actual `MaterialDomain == MD_UI`. The plugin does not generate arbitrary material graphs from images.

#### Safety limits

- `dryRun` does not modify a real Widget Blueprint, compile it or save it.
- One patch operates on one Widget Blueprint. Cross-package operations are not claimed to be atomic.
- The complete final tree is simulated before changes; a successful operation refreshes and compiles only once.
- Deleting or renaming also updates navigation bindings that can safely migrate within the same Widget tree. The operation is rejected if safety cannot be established for dependencies such as external Blueprint graphs, animations, events, variables or C++ `BindWidget`.
- Image files, decoded pixels, Widget count, hierarchy depth, request text and response bodies all have hard limits.
- Every save accepts exactly one target package and never runs Save All.
- A reference image cannot uniquely specify interactions, hidden content or responsive rules. The AI must record assumptions in the specification; the plugin does not infer business logic.

## LayoutAndSession

### Layout, sessions and hit testing

#### Connect to the correct project

`initialize` returns `_meta.mcpumgContext`: ProjectFile, ProjectName, EngineVersion, PluginVersion, ProcessId, ActualPort and SessionId. Port conflicts may change the port; use the returned values to confirm the actual project. SessionId follows the server object's lifetime and changes when that object is recreated.

Subsequent calls can pass the token in **params._meta**. Do not put it in the tool's business arguments.

```json
{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"GetWidgetTree","arguments":{"BlueprintPath":"/Game/UI/WBP_Menu"},"_meta":{"MCPUMGExpectedSessionId":"从initialize读取"}}}
```

Tokens of the wrong type or expired tokens are rejected before tool execution. Omitting the token preserves compatibility with older clients. This check helps prevent accidental operations in another editor; it is not authentication.

#### Structured layout

`SetWidgetLayout` accepts BlueprintPath, WidgetName, Layout and optional dryRun. It modifies only the specified widget or its existing Slot. It does not wrap or reparent widgets, edit the parent, or save.

| Layout section | Target | Parameters |
|---|---|---|
| sizeBox | The target itself is a SizeBox | widthOverride, heightOverride: non-negative numbers; null clears the override |
| canvas | CanvasPanelSlot | anchors.min/max (x/y), four offsets, alignment (x/y), autoSize, zOrder |
| box | HorizontalBoxSlot / VerticalBoxSlot | size.rule is Auto/Fill; Fill can include a positive weight; padding, hAlign, vAlign |
| slot | Button/Border/Overlay/SizeBox/ScrollBox/HorizontalBox/VerticalBox Slot | padding, hAlign, vAlign |

hAlign accepts Left/Center/Right/Fill; vAlign accepts Top/Center/Bottom/Fill. Both padding and offsets use four JSON numbers: left/top/right/bottom. The same field cannot be specified in both box and slot.

```json
{
  "BlueprintPath":"/Game/UI/WBP_Menu",
  "WidgetName":"StartButton",
  "dryRun":true,
  "Layout":{"canvas":{
    "anchors":{"min":{"x":0,"y":0},"max":{"x":0,"y":0}},
    "offsets":{"left":20,"top":30,"right":170,"bottom":60},
    "alignment":{"x":0,"y":0},"autoSize":false,"zOrder":2
  }}
}
```

On an unstretched Canvas axis, right/bottom mean width/height. On a stretched axis, they are native UMG right/bottom margins. Coordinates are relative to the immediate parent container, not the whole screen. Setting a sizeBox override to null clears it; it does not set width or height to zero. Omitted fields retain their values.

dryRun validates parameters, types and applicable targets without performing layout; success does not establish that there is no overlap. Change dryRun to false to apply, read back with GetWidgetProperties, then check the result and save exactly that Blueprint with SaveWidgetBlueprint.

#### Interpreting clipping and scaling

Use PIE mode in InspectWidgetLayout to read actual dimensions, layout scale, parent bounds, clipping ancestors and signs of text overflow. Design mode cannot establish actual layout results. Unverified does not mean a check passed. Rotated bounding boxes, conditional clipping and stale caches still require screenshots for interpretation.

Button style NormalPadding adds to ButtonSlot Padding. A child widget cannot use the outer SizeBox dimensions directly as its available space; check the actual internal layout.

#### Checking why a Button cannot be hit

`InspectWidgetHitTest` accepts BlueprintPath, WidgetName and optional InstanceIndex. It checks the target center by default. You can supply LocalX/LocalY together in the target's own local coordinates. It only queries the target window's cached hit-test grid, without moving the mouse, clicking or changing focus.

The result contains bTargetOnHitPath, target enabled/visibility state, keyboard focus and up to 64 Slate path nodes. TargetNotOnCachedHitPath can result from occlusion, disabled state, hit-test visibility or cache state; it does not identify a single specific fault. Other windows, mouse capture and actual event execution are outside this diagnostic's scope. The call fails explicitly when there is no runtime instance or valid geometry.

Recommended order: confirm the session, read the layout, inspect hit testing, adjust layout/properties, read back, test real interaction, then save the exact target.
