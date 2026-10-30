---
title: MCPUMG User Guide
description: Installation, connection, tools and limitations of MCPUMG
type: doc
slug: mcp-umg-guide
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-umg
documentKind: product-manual
websiteRoute: /docs/zh/guides/ue-tools/mcp-umg-guide/
lang: en
translationKey: mcp-umg-guide
sourceHash: 7c8588e155dbc542220535ab32b91110c706ffe6adbdc30a83303b193c8782ea
translationStatus: translated
generatedBodyHash: 7a656404961a52c09eddcacd529f267fe3dacad7d7b91a82470a66b6d5cda2b5
---

# MCPUMG

AI-driven UMG editing plugin for Unreal Engine, powered by MCP (Model Context Protocol).

## Overview

MCPUMG exposes Widget-specific visual editing capabilities to AI assistants via an HTTP server running inside the Unreal Editor. AI tools can discover, create, modify widget trees, properties, slots, animations, and events through a standardized protocol.

## Installation and updates

1. Close every Unreal Editor instance that uses the target engine version.
2. Choose the MCPUMG package that matches the engine version, then copy its contents to `Engine/Plugins/Marketplace/MCPUMG` under that engine installation.
3. Open the copied `MCPUMG.uplugin`. Keep `"Installed": true`, and add or set `"EnabledByDefault": true`; packaged descriptors may omit this field during post-processing.
4. Restart the editor. The plugin starts automatically unless `bAutoStart` is disabled in Project Settings.

To update MCPUMG, close the editor and replace the entire existing `MCPUMG` directory with the matching new package. Do not mix files from different engine versions.

## Tools (71 base tools; 6 more with the opt-in MVVM module)

### Discovery & Reading
| Tool | Description |
|------|-------------|
| ListWidgetBlueprints | List Widget Blueprints (convenience entry point) |
| GetWidgetTree | Get widget tree structure |
| GetWidgetProperties | Get widget properties |
| SearchWidgetClasses | Search available widget classes |
| CaptureWidgetScreenshot | Capture Widget design view as PNG |
| CaptureRuntimeWidgetScreenshot | Capture an existing PIE/Game Widget instance at its actual Slate window geometry as PNG; never creates a widget or injects preview state |
| GetUIDesignCapabilities | Read the reference-image-to-UMG specification version, operations and safety limits |
| ExportWidgetSpec | Export a stable Widget spec, revision, and fingerprint |
| InspectWidgetLayout | Page through design metadata or actual PIE layout, clipping, text and resource status |
| InspectWidgetHitTest | Read the cached hit path at a live widget's center or local coordinates; never inject input |
| CompareUIImages | Compare two UI images without automatic resizing, cropping or alignment, and return a heatmap |
| CaptureWidgetPreviewMatrix | Render named temporary states at named sizes as a PNG matrix |
| InspectWidgetPerformance | Read bounded authored WidgetTree complexity indicators |
| ListRuntimeWidgets | Issue short-lived tokens for exact-class live Widget instances |
| InspectWidgetRuntime | Read a named live Widget or paged runtime WidgetTree |
| GetRuntimeOperation | Read progress and results of a bounded runtime operation |
| CancelRuntimeOperation | Request cancellation of a pending runtime operation |
| MeasureWidgetPerformance | Sample bounded Slate CPU work for a live Widget subtree |
| CaptureWidgetTrace | Capture a bounded native Slate trace for a live Widget |
| GetUIFrameworkCapabilities | Read the available CommonUI and MVVM operations |
| GetMVVMView | Read MVVM contexts and bindings on a Widget Blueprint |
| ValidateMVVMBinding | Validate one direct OneTime MVVM property relationship without editing bindings |

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

The opt-in `MCPUMGMVVM` Editor module adds `GetMVVMViewDetails`, `ValidateMVVMBindingAdvanced`, `SetMVVMBinding`, `RemoveMVVMBinding`, `UpdateMVVMViewModelContext`, and `RemoveMVVMViewModelContext`. Native MVVM availability alone does not load this module. See [optional UI frameworks](#optionaluiframeworks).

For the complete reference-image workflow and schema, see [Reference image to UMG](#imagetoumg). For runtime instance tokens, input, lists, operations and diagnostics, see [Runtime interaction and diagnostics](#runtimeworkflow). Navigation, components, previews, styles and fonts are covered in [Navigation](#navigation), [Components](#components), [Preview](#preview) and [Common widget styles](#commonstyles). See [Themes](#themes), [Preview matrix](#previewmatrix), [Animation workflow](#animationworkflow) and [Component extraction](#componentextraction) for those workflows, and [Batch property migration](#batchmigration), [Performance structure diagnostics](#performance) and [Optional UI frameworks](#optionaluiframeworks) for the remaining tools.

## Configuration

Project Settings > Plugins > MCPUMG:

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Port | int32 | 8765 | HTTP port (auto-increment if occupied, up to 10 retries) |
| bAutoStart | bool | true | Auto-start server on editor launch |
| RequestTimeoutSeconds | int32 | 30 | Tool execution timeout |
| CompileTimeoutSeconds | int32 | 120 | Compile timeout |

## MCP Connection

The plugin runs an HTTP server inside the Unreal Editor. AI clients connect via MCP protocol.

**MCP URL**: `http://127.0.0.1:8765/mcp`

The server starts automatically when the editor opens (configurable via `bAutoStart`). The toolbar shows the actual URL (port auto-increments if 8765 is occupied).

### Version and save troubleshooting

Layout diagnostics include parent bounds, clipping ancestors to a bounded depth, and signs of vertical text overflow, including wrapped text. `Unverified*` does not mean a check passed. Property setters support `ResetToClassDefault`; styles support explicit RoundedBox/outline settings, clearing Brush resources, and Button normal/pressed padding. See [Layout, sessions and hit testing](#layoutandsession) and [Reference image to UMG](#imagetoumg).
- Treat `tools/list` from the live editor as authoritative. Updating the source tree or installed package does not hot-swap the DLL in an already running editor; if the tool count differs, verify the deployment directory and restart the target editor.
- When `SaveWidgetBlueprint` fails, inspect `LogSavePackage` in the project log. Windows `Error 32` usually means a stale `-game`, PIE, or second editor process for the same project still owns the asset handle. Close only the stale process whose command line identifies that project, then retry the precise save.
- If the patch succeeded in memory but saving failed, do not use Save All, overwrite the file externally, or repeat the patch. Release the file lock and retry `SaveWidgetBlueprint` so the existing in-memory change is saved once.
- `CaptureRuntimeWidgetScreenshot` requires the MCPUMG editor module and an existing runtime Widget instance. A standalone `-game` process is not guaranteed to expose the MCPUMG server.

### Claude Code

Add to `~/.claude/.mcp.json` (global) or project root `.mcp.json`:

```json
{
  "mcpServers": {
    "ue-umg": {
      "url": "http://127.0.0.1:8765/mcp"
    }
  }
}
```

### Other AI Clients

MCP client configuration varies by tool (Cursor, Windsurf, VS Code Copilot, etc.). The server URL is the same; consult your AI tool's documentation for how to add an MCP server.

## Requirements

- Unreal Engine 5.2+
- Editor only
- Optional: [MCPBlueprint](/en/docs/guides/ue-tools/mcp-blueprint-guide/) for Blueprint graph editing (widget event logic calls MCPBlueprint tools for advanced graph operations)

For questions or feedback, visit the [unified contact page](https://mzsh.me/contact/) and add me on WeChat.


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

## Components

### Component instances and Named Slots

#### Create Named Slot content

`SetNamedSlotContent` finds `HostWidgetName` in the specified Widget Blueprint tree and performs `Create` (default), `Replace`, `Clear` or `Move` on its `SlotName`. The host may be a native widget implementing `INamedSlotInterface` or a successfully compiled nested UserWidget that exposes Named Slots.

```json
{
  "BlueprintPath": "/Game/UI/WBP_Page",
  "HostWidgetName": "DetailsArea",
  "SlotName": "Header",
  "WidgetClass": "TextBlock",
  "WidgetName": "Txt_DetailsHeader",
  "bIsVariable": true,
  "dryRun": true
}
```

Start with `dryRun: true` to check the host, slot name, class, name, compilation state and circular references, then change it to `false` to apply. After success, read back with `GetWidgetTree` or `GetWidgetProperties` and explicitly call `SaveWidgetBlueprint`; the tool does not save.

`Create` requires an empty target slot. `Replace` and `Clear` require the current content's `ExpectedContentName` to guard against stale state. `Move` uses `ExistingWidgetName` to identify an existing widget in the same tree, and requires an empty destination slot. Run a dry run for the chosen operation, check dependencies and the returned status, then apply and save.

#### Set nested UserWidget instance parameters

`SetWidgetInstanceProperties` edits writable fields on a nested UserWidget instance in the host Widget Blueprint tree. It does not change the referenced Widget Blueprint's class defaults, call arbitrary functions or write business Data Assets.

```json
{
  "BlueprintPath": "/Game/UI/WBP_Page",
  "WidgetName": "CardInstance",
  "Properties": {
    "Title": "炼丹房",
    "AccentColor": "(R=0.15,G=0.8,B=0.55,A=1.0)"
  }
}
```

Fields must be editable on the instance, and values use UE text format. Variables do not need `ExposeOnSpawn`; writability depends on editor property flags and `CanEditChange`. With `ResetToClassDefault: true`, each specified field first receives its default from the nested widget class default object, then imports the supplied text. Empty `Properties`, structural relationship fields and calls in which every value is unchanged are rejected.

Read back the instance properties after execution, then call `SaveWidgetBlueprint`. Instance parameters and Named Slot content should persist after saving, closing and reopening the asset.

## CommonStyles

### Common widget styles

The `Brush`, `Text` and `Button` interfaces of `SetWidgetStyle` are unchanged. All objects are fully parsed before opening a transaction. Unknown fields, incorrect JSON types, missing resources or resource-type mismatches fail without modifying the target widget.

#### Extended widgets

CheckBox, Slider, ProgressBar, EditableTextBox, ScrollBar and ComboBoxString use `Style.Extended`. Field names are the engine's public reflected fields on the corresponding `WidgetStyle` or widget itself. Only `FSlateBrush`, `FSlateColor`/`FLinearColor`, `float` and `bool` are supported. For example:

```json
{"Extended":{"CheckedImage":{"drawType":"Box"},"ForegroundColor":{"r":0.2,"g":0.4,"b":0.6}}}
```

Common Brushes include CheckBox `UncheckedImage`/`CheckedImage`, Slider `NormalBarImage`/`NormalThumbImage`, ProgressBar `BackgroundImage`/`FillImage`, EditableTextBox `BackgroundImageNormal`/`BackgroundImageFocused`, ScrollBar `NormalThumbImage`, and directly reflected style fields on ComboBoxString. The same object can set Slider `Value`, `MinValue`, `MaxValue`, `StepSize`, and ProgressBar `Percent`/`FillColorAndOpacity`. Complex nested styles, such as a ComboBox's internal ButtonStyle, are outside this interface's scope.

#### Text and rich text limits

TextBlock `Text` supports `color`, `fontSize`, `font` referencing an existing `/Game` or `/Engine` **UFont**, `typefaceFontName`, `letterSpacing`, `lineHeight`, `wrapTextAt`, `autoWrap` and `ellipsis`. `ellipsis:false` explicitly selects the native Clip policy. A bare `FontFace` is rejected because it does not implement the `IFontProviderInterface` required by Slate and would fall back to another font. Native engine UFonts, such as the default Roboto, can be used in styles and reapplied themes.

RichTextBlock uses `Style.RichText`: `textStyleSet` must reference an existing `/Game` DataTable whose row structure is **exactly** the engine's `FRichTextStyleRow`; `decoratorClasses` is an array of paths to existing, non-abstract `URichTextBlockDecorator` subclasses. The tool only references these assets and calls native `SetTextStyleSet`/`SetDecorators`; it does not create application-specific Decorators. For example:

```json
{"RichText":{"textStyleSet":"/Game/UI/Styles/DT_RichText","decoratorClasses":["/Game/UI/Decorators/BP_LinkDecorator.BP_LinkDecorator_C"]}}
```

`ImportUIFont` imports one local `.ttf`/`.otf` as a new `/Game` FontFace and creates a matching UFont with the `_Font` suffix. The UFont's default typeface persistently references that FontFace. The result includes `FontFacePath` and `FontPath`, which can be used directly as `Text.font`. `SourceFile` and `AssetPath` are required; the source file limit is 64 MiB. The request is rejected if either target package already exists, is loaded as a non-empty package, or exists on disk, preventing overwrites or unintended saves. `bSave` must be a boolean and defaults to `false`; when true, it saves exactly those two packages. After a default import, use `SaveUIAsset` separately with each FontFace/UFont path to save one package at a time. The tool uses `UFontFileImportFactory`, available in UE 5.2 through 5.8 (its base-class `FactoryCreateFile` ultimately invokes FontFace's native binary factory).

## Preview

### CaptureWidgetPreview

List samples use temporary asset copies, without passing the original assets directly to list entries. External resources referenced by those copies may still be shared. Widget lifecycles and list callbacks can run project code; this is not a script sandbox. Business logic used for previews should have no side effects.

`CaptureWidgetPreview` creates a fresh temporary instance of a compiled Widget Blueprint, applies preview-only data and returns an off-screen PNG. It is a design preview, not a screenshot of the running game's Widget.

The tool does not edit or save the Widget Blueprint, its WidgetTree or existing PIE/Game instances, nor modify assets supplied as list samples. It does not compile the Blueprint either. Compile explicitly first and ensure its status is `UpToDate`.

#### Parameters

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

## RuntimeWorkflow

### Runtime interaction and diagnostics

These tools operate on existing PIE/Game `UUserWidget` instances. Run the target page first, then find its instances with `BlueprintPath` in `ListRuntimeWidgets`. The returned `Instances[].RuntimeInstanceToken` binds to the current Widget, World, session and local player. Obtain a new token after restarting PIE or recreating the Widget. `InstanceIndex` remains available for older read-only inspections, but cannot replace a token in tools that require one. Tokens identify targets; they are not authentication.

```json
{"BlueprintPath":"/Game/UI/WBP_Inventory","Offset":0,"MaxItems":32}
```

`InspectWidgetRuntime` uses `RuntimeInstanceToken` to read a named child widget (`WidgetName`) or page through the running WidgetTree using `Offset` and `MaxItems`. `MaxItems` defaults to 100 and has a maximum of 200. Inspect the target widget and window state before sending input.

#### Input, lists and operation IDs

`InteractWithWidget` requires `RuntimeInstanceToken`, an exact `WidgetName`, `Action` and a caller-generated `RequestId`. `Action` is `Click`, `Wheel`, `Text`, `Drag`, `DragDrop` or `Navigate`. Depending on the action, supply `WheelDelta`, `Text`, normalized endpoint `EndX`/`EndY`, `DropWidgetName`, or `Direction` and optional `Device`. Text is limited to 1 to 128 printable BMP characters. IME, control characters and clipboard input are not supported. Input goes to the target runtime window; confirm that it is the intended page before execution.

`ControlWidgetList` requires `RuntimeInstanceToken`, `ListName` and `Action`. Start with `Action: "Snapshot"` to obtain list-item `ItemToken` values. You can then `Select`, `AddSelection`, `Deselect`, `ClearSelection`, `ScrollIntoView`, `Expand` or `Collapse`. For ScrollBox, use `ScrollWidgetIntoView` with `TargetWidgetName`. All actions except `Snapshot` require `RequestId`; all except `Snapshot` and `ClearSelection` require an `ItemToken` from the snapshot.

Use a new `RequestId` for each new action, and reuse it only when retrying the exact same request. Reuse with conflicting parameters is rejected. Tools that return `OperationId` after starting can be queried with `GetRuntimeOperation` for `Status`, `Data` and errors. Status may be `Pending`, `Completed`, `Failed`, `Cancelled`, `TimedOut` or `Invalidated`; expired or unrecognized IDs return `Unknown`. `CancelRuntimeOperation` accepts only a pending `OperationId`. Cancellation may still require cleanup; `bCleanupPending` means the final state has not been confirmed. Continue querying until it finishes. Completed results are retained briefly, so do not treat `OperationId` as a permanent record.

#### Performance sampling and Trace

`InspectWidgetPerformance` reads design-time structural complexity and cannot replace runtime measurement. `MeasureWidgetPerformance` requires `RuntimeInstanceToken` and `RequestId`. Optional parameters are `Frames` (default 30, maximum 120) and `MaxNodes` (default 100, maximum 500). It aggregates per-Widget **inclusive GameThread CPU** time from actual Slate paint, invalidation and update events. This is neither exclusive time nor GPU time. Query the results with the returned `OperationId`.

`CaptureWidgetTrace` applies only to PIE instances with a cached Slate Widget. It requires `RuntimeInstanceToken` and `RequestId`; optional `DurationSeconds` defaults to 3 and ranges from 0.1 to 10 seconds. It starts a process-wide native Slate Trace and will not take over an existing Trace that is running or finishing. After completion, use `GetRuntimeOperation` to inspect `Data.TraceStatus`, `TracePath`, actual byte count and cleanup state. The Trace includes the entire process; filter by the returned target Slate Widget ID in Unreal Insights. It is not exclusive Widget timing or GPU timing. A file is retained only after it is closed and is no larger than **16 MiB**. Oversized or cancelled captures are discarded. `CleanupPending` / `CleanupUnconfirmed` means the file cannot yet be treated as a usable result.

Runtime operations do not save Widget Blueprints. Design changes still require an explicit call to the appropriate save tool. Use `tools/list` from the current editor for available capabilities and parameters.

## Themes

### Widget themes

`ExportWidgetTheme` exports a portable version 1 theme from specified Image, Border, TextBlock or Button widgets. `ApplyWidgetTheme` applies it to another Widget Blueprint with the same widget names and classes. Export only reads the asset; applying a theme changes memory in one transaction without automatically saving.

#### Export a theme

`BlueprintPath` and a unique `WidgetNames` array are required, with up to 64 widgets. Only fully representable styles are exported: Brush, Text, and the four Button states and padding. Dynamic Slate colors, Brush resources outside `/Game` and text resources that are not UFonts are rejected to avoid incomplete themes. Text UFonts can reside in `/Game` or `/Engine`, so the default Roboto can also be exported and reapplied. Layout is not currently exported; reapplying exported styles leaves layout unchanged.

```json
{
  "BlueprintPath": "/Game/UI/WBP_MainMenu",
  "WidgetNames": ["PlayButton", "TitleText"]
}
```

`uv` uses the form `{"minX","minY","maxX","maxY"}`. If there is no valid UV override, the output is `uv: null`, which clears an existing UV override on the target when reapplied.

#### Apply a theme

`ApplyWidgetTheme` requires `BlueprintPath` and `Theme`. The theme root must be `{"version":1,"rules":[...]}`, with 0 to 64 rules. Each rule addresses its target by exact `name` and UObject `class`. Optional `dryRun: true` performs the same complete preflight without changing the asset.

```json
{
  "BlueprintPath": "/Game/UI/WBP_Options",
  "dryRun": true,
  "Theme": {
    "version": 1,
    "rules": [
      {
        "name": "PlayButton",
        "class": "Button",
        "style": {
          "Button": {
            "normal": {
              "resource": null,
              "drawType": "RoundedBox",
              "imageSize": {"x": 96, "y": 36},
              "tint": {"r": 0.1, "g": 0.4, "b": 0.9, "a": 1},
              "margin": {"left": 4, "top": 4, "right": 4, "bottom": 4},
              "tiling": "NoTile",
              "uv": null
            },
            "normalPadding": {"left": 8, "top": 4, "right": 8, "bottom": 4}
          }
        }
      }
    ]
  }
}
```

`style.Brush` supports `resource`, `drawType`, `imageSize`, `tint`, `margin`, `tiling`, `uv` and `outline`. `style.Text` supports TextBlock color, `/Game` or `/Engine` UFonts, font size, typeface, letter spacing, line height, wrapping and ellipsis. `style.Button` supports `normal`, `hovered`, `pressed`, `disabled`, `normalPadding` and `pressedPadding`. `layout` uses the existing `SetWidgetLayout` fields. Omitted fields retain their current values.

Unknown fields, duplicate name/class pairs, missing targets, class mismatches, incompatible style channels, invalid layouts or invalid resources reject the entire request. A theme can match at most 256 targets. After a successful non-dry-run call, use `SaveWidgetBlueprint` when ready to save.

## PreviewMatrix

### CaptureWidgetPreviewMatrix

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

This remains a `TemporaryNewInstance` design preview and does not represent PIE/Game runtime state. Animation time parameters are not currently accepted, to avoid reporting unevaluated animation frames as screenshot results across UE versions.

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

## ComponentExtraction

### Extract reusable components

`ExtractWidgetComponent` extracts a specified WidgetTree subtree into a new `/Game` Widget Blueprint. The default `ReplaceSource:false` copies only and leaves the source unchanged. With `true`, one editor transaction replaces the original location with a new component instance. `InstanceName` can set the instance name, defaulting to the original widget name. The destination must be a new asset path; existing disk packages and non-empty in-memory packages are rejected.

Copying preserves native widget properties, ordinary `bIsVariable` flags, internal child hierarchy and native Slot properties. `DependencyMode` defaults to `Reject`. `MigrateSupported` can migrate NamedSlot content inside the subtree, plus animations whose bindings are all contained within it, whose tracks are property tracks only, and which have no dynamic binding functions. Dependencies such as cross-subtree animations, non-property tracks, graph references, inherited `BindWidget`/`BindWidgetOptional`, editor delegate bindings, default focus, UI Components and custom or cross-subtree navigation remain rejected.

```json
{
  "BlueprintPath": "/Game/UI/WBP_Menu",
  "WidgetName": "CardPanel",
  "AssetPath": "/Game/UI/WBP_Card",
  "dryRun": true
}
```

Start with `dryRun:true` to inspect `WouldChange`, `Dependencies` and any `PreflightError`; after checking, set it to `false` to create the component. The new Blueprint compiles in memory but is not automatically saved. If the source location was replaced, save the source Blueprint too. Call `SaveWidgetBlueprint` for each path separately.

The tool does not transfer the source page's business graphs into the component.

## BatchMigration

### Batch property migration

`BatchSetWidgetProperties` defaults to `dryRun:true`. Every target must provide the `expectedFingerprint` returned by `ExportWidgetSpec`. Any stale fingerprint, duplicate target or invalid property rejects the entire request with zero changes. Limits are 16 WBPs and 256 widgets.

Actual execution uses one Undo transaction per WBP and leaves them all unsaved. It does not automatically compile or save, and does not support Slot, relationship or structural migration. After writing, each field is checked through reflection. If an error occurs, the overall result is error and each package reports `Applied`, `Failed` or `NotAttempted`; cross-package rollback is not claimed. Use editor Undo separately for applied packages. If all targets already have the requested values, the tool reports `NoChange` without creating a transaction or dirtying packages.

## Performance

### Widget performance structure diagnostics

`InspectWidgetPerformance` reads only the design-time WidgetTree of one Widget Blueprint and summarizes structural indicators that may affect UI complexity. It does not create Widgets, enter PIE, compile, save or modify assets.

```json
{
  "BlueprintPath": "/Game/UI/WBP_Inventory",
  "MaxWidgets": 500
}
```

`BlueprintPath` is the required Widget Blueprint asset path. Optional `MaxWidgets` defaults to `500` and must be a JSON integer from `1` to `1000`. Fractions, strings and booleans are rejected. Reaching the limit returns `bTruncated: true`, meaning the statistics cover only the traversed prefix, not the entire tree.

#### Returned data

- `MeasurementStatus` is always `AuthoredIndicatorsOnly`: results are indicators of the authored structure, not measured performance.
- `WidgetsAnalyzed`, `MaxDepth` and `WidgetClassCounts`: analyzed node count, maximum tree depth and widget class counts.
- `PanelComplexity`: Canvas Panel and Overlay instance counts and the largest number of direct children in any single container of each type.
- `PropertyBindingCount`: number of property binding entries in the Widget Blueprint.
- `VolatileWidgetCount`, `RetainerBoxCount`, `InvalidationBoxCount`, `ListViewCount`: counts of the corresponding widgets or flags.
- `bCycleDetected`: `true` when a Widget appears again on the current recursion path. The tool stops that path to avoid unbounded traversal.
- `bDuplicateReferenceDetected`: `true` when an already-counted Widget is reachable through another path. Shared references are deduplicated and are not misreported as cycles.
- `bTruncated`: `true` when the analyzed node count reaches `MaxWidgets`.

These indicators do not report milliseconds, CPU, GPU, memory, Slate Tick/Paint cost or actual runtime invalidation behavior. They help identify structures worth investigating, such as deep hierarchies, many direct children, excessive bindings or volatile widgets. To sample running Widgets, use `MeasureWidgetPerformance`; for a bounded native Trace, use `CaptureWidgetTrace` and follow the target and cleanup rules in the [runtime workflow](#runtimeworkflow). Use Unreal Insights for further analysis and Widget Reflector to inspect actual Slate hierarchy, invalidation and painting behavior.

## OptionalUIFrameworks

### Optional UI frameworks

MCPUMG can use the corresponding tools when CommonUI or ModelViewViewModel (MVVM) is already enabled in the project. Call `GetUIFrameworkCapabilities` first to read each framework's state: `NotInstalled`, `InstalledDisabled`, `EnabledNotLoaded` or `Available`. This query does not change project, module or asset state.

To use an optional framework, have the project owner manually enable its plugin as needed and restart the editor. MCPUMG does not enable plugins or load disabled modules on your behalf.

`GetUIFrameworkCapabilities.ModelViewViewModel.State` describes native MVVM only. `EnhancedModule.OptInModuleDeclared`, `ModuleLoaded`, `CanWriteBindingsNow` and `AvailabilityReason` describe the `MCPUMGMVVM` enhanced module. The base version does not provide full Binding writes even when native MVVM is `Available`. The enhanced version requires the `MCPUMGMVVM` Editor module to be included and loaded, with the native `ModelViewViewModel` plugin enabled. Editing the package descriptor without the corresponding build artifacts does not provide these tools. Use `tools/list` from the running editor as the authority.

#### CommonUI

`ConfigureCommonUIWidget` modifies only an existing instance in the specified Widget Blueprint tree. Parameters are `BlueprintPath`, `WidgetName`, `Properties` and optional `dryRun`, which checks the complete request without changing assets.

```json
{
  "BlueprintPath": "/Game/UI/WBP_Menu",
  "WidgetName": "ConfirmButton",
  "Properties": {"bIsLocked": "True"},
  "dryRun": true
}
```

Supported widgets and configurable fields:

| Widget | Configurable settings |
| --- | --- |
| CommonButtonBase | Style, lock/select/toggle behavior, click/touch/press methods and legacy TriggeringInputAction |
| CommonActivatableWidget | Back, automatic activation, focus/modal behavior and activation/deactivation visibility |
| CommonTextBlock | Style, ScrollStyle, MobileFontSizeMultiplier |

The tool accepts only fields that pass the widget-family allowlist, edit-condition and editability checks. It does not call CommonUI functions, modify Style default objects, configure Enhanced Input, enable plugins or automatically save.

`ConfigureCommonUIInput` can dry-run allowlisted input fields on an existing CommonUI Widget, then write references to existing persistent assets. Depending on widget type, it supports `CommonButtonBase.TriggeringEnhancedInputAction`, `CommonActivatableWidget.InputMapping`/`InputMappingPriority`, and `CommonActionWidget.EnhancedInputAction`/`InputActions`. Parameters are `BlueprintPath`, `WidgetName`, non-empty `Properties` and optional `dryRun`. It validates only fields and asset references; the returned `InputChainStatus: NotVerifiedByAssetConfiguration` does not establish that the entire input chain works.

At runtime, obtain a token with `ListRuntimeWidgets`, then use `InspectCommonUI` to read the instance or a specified `WidgetName`. `ControlCommonUI` accepts `Action` values `Activate`, `Deactivate`, `Push` and `Remove`. `Push` requires a container `WidgetName` and compiled `WidgetClassPath`; `Remove` uses the current stacked target's `TargetToken`. These operations act on existing instances without saving Widget Blueprints. See [Runtime interaction and diagnostics](#runtimeworkflow).

#### MVVM

`GetMVVMView` reads existing Contexts and Bindings on one Widget Blueprint. It does not create or modify MVVM data.

`AddMVVMViewModelContext` adds a real ViewModel Context to an existing Widget Blueprint. `BlueprintPath`, `ViewModelClass` and `CreationType` are all required; `CreationType` accepts only `Manual` or `CreateInstance`.

```json
{
  "BlueprintPath": "/Game/UI/WBP_Inventory",
  "ViewModelClass": "/Game/UI/VM/BP_InventoryViewModel.BP_InventoryViewModel_C",
  "CreationType": "CreateInstance"
}
```

The ViewModel class must implement `NotifyFieldValueChanged`, be a currently valid concrete non-Widget class, and allow the requested creation strategy. The tool does not save assets. After adding the Context, inspect it with `GetMVVMView`, then explicitly compile and save as needed.

`ValidateMVVMBinding` is a read-only preflight and does not add, remove or modify Bindings. It validates only one direct `OneTime` property relationship with exactly matching types. The source may be a ViewModel Context or Widget; the destination must be a public writable runtime property on an existing Widget.

```json
{
  "BlueprintPath": "/Game/UI/WBP_Inventory",
  "SourceType": "ViewModel",
  "SourceName": "InventoryViewModel",
  "SourceProperty": "Title",
  "DestinationWidgetName": "TitleText",
  "DestinationProperty": "Text",
  "BindingMode": "OneTime"
}
```

Functions, nested paths, static arrays, conversion functions, implicit conversions, private or EditorOnly properties, and notification-driven binding modes are outside this validator's scope.

##### Opt-in enhanced MVVM module

The enhanced module adds `GetMVVMViewDetails`, `ValidateMVVMBindingAdvanced`, `SetMVVMBinding`, `RemoveMVVMBinding`, `UpdateMVVMViewModelContext` and `RemoveMVVMViewModelContext`. First read existing Context and Binding GUIDs and fingerprints, then validate complete paths with the read-only validator. Omit `BindingId` when creating a Binding with `SetMVVMBinding`; when updating, supply both `BindingId` and the current `ExpectedFingerprint`. `SourcePath` and `DestinationPath` are non-empty ordered arrays of field names, not dot-separated strings.

```json
{"BlueprintPath":"/Game/UI/WBP_Inventory","SourceType":"ViewModel","SourceName":"InventoryViewModel","SourcePath":["Title"],"DestinationWidgetName":"TitleText","DestinationPath":["Text"],"BindingMode":"OneTime"}
```

Enhanced tools support `OneTime`, `OneWay` and native `TwoWay`. Notification-driven modes require actual FieldNotify descriptors; both ends of `TwoWay` must also be readable, writable and of the same type. Native compilers in UE 5.2 to 5.8 do not accept **TwoWay combined with conversion functions**, so the tool rejects this before writing. One-way bindings can use `SourceToDestinationConversion` to reference an existing, loaded, valid single-parameter conversion `UFunction`; provide only this field without a reverse conversion. Write tools compile and attempt Undo on failure, but do not save assets. `RemoveMVVMBinding` requires `BindingId` and `ExpectedFingerprint`. Updating or deleting a Context requires the exact `ViewModelId` and expected previous values. When deleting a Context referenced by Bindings, `CascadeBindingIds` must list exactly all dependent Binding IDs or the request is rejected. Explicitly save the Widget Blueprint afterward as needed.

Native MVVM in UE 5.2 cannot carry notification bindings across a non-final UObject property into fields on another object. Enhanced validators and write tools reject these `OneWay` and `TwoWay` paths before modification, including cases where the object field still points to an instance of the same class. `OneTime` keeps its existing path validation. Root-level FieldNotify fields, paths traversing only structs and final UObject fields are not rejected by this restriction. UE 5.3 and later provide the corresponding native mechanism, but specific paths and project MVVM settings still need validation. In UE 5.3, an intentionally null dynamic source still produces native error logs; whether subscriptions and value updates resume after the object returns needs separate verification. `GetUIFrameworkCapabilities.ModelViewViewModel.EnhancedModule.BindingLimits.DynamicObjectSourceNotifications` reports the current engine's `EngineSupported`, `Reason` and `RequiresNativePathValidation`. Support for the mechanism does not mean every path and setting has been validated.
