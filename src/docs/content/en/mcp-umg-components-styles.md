---
title: Reuse Components and Widget Styles
type: doc
slug: mcp-umg-components-styles
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-umg
documentKind: product-manual
websiteRoute: /en/works/mcp-umg/docs/components-styles/
lang: en
translationKey: doc:mcp-umg:components-styles
sourceHash: 1cb034a4a7134ffc67ead2f3b1d90b0213c9338615f0d97196c329c11360a91c
translationStatus: translated
generatedBodyHash: 85fe4dca026aed9bc193ef33b2ac34c5234540f7a8ff553a07e4b30db40020aa
docPage:
  work: mcp-umg
  group: workflows
  slug: components-styles
  order: 2
---

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

At runtime, obtain a token with `ListRuntimeWidgets`, then use `InspectCommonUI` to read the instance or a specified `WidgetName`. `ControlCommonUI` accepts `Action` values `Activate`, `Deactivate`, `Push` and `Remove`. `Push` requires a container `WidgetName` and compiled `WidgetClassPath`; `Remove` uses the current stacked target's `TargetToken`. These operations act on existing instances without saving Widget Blueprints. See [Runtime interaction and diagnostics](/en/works/mcp-umg/docs/preview-runtime/#runtimeworkflow).

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
