---
title: Configure MVVM Contexts and Bindings
type: doc
slug: mcp-umg-mvvm
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-umg
documentKind: product-manual
websiteRoute: /en/works/mcp-umg/docs/mvvm/
lang: en
translationKey: doc:mcp-umg:mvvm
sourceHash: 4fe77a62245f29864b5f5fc2d2623f4ea7056f21309c0af7b370692c6c66b846
translationStatus: translated
generatedBodyHash: fbbbe4371445d60bb45cf492994363b2fda421f4e5efe9ac36f3ac8b8dd95427
docPage:
  work: mcp-umg
  group: features
  slug: mvvm
  order: 14
---

## Check framework availability

Call `GetUIFrameworkCapabilities` to check whether ModelViewViewModel (MVVM) is available in this project. The possible states are `NotInstalled`, `InstalledDisabled`, `EnabledNotLoaded` or `Available`. This query does not change project, module or asset state.

To use an optional framework, have the project owner manually enable its plugin as needed and restart the editor. MCPUMG does not enable plugins or load disabled modules on your behalf.

`GetUIFrameworkCapabilities.ModelViewViewModel.State` describes native MVVM only. `EnhancedModule.OptInModuleDeclared`, `ModuleLoaded`, `CanWriteBindingsNow` and `AvailabilityReason` describe the `MCPUMGMVVM` enhanced module. The base version does not provide full Binding writes even when native MVVM is `Available`. The enhanced version requires the `MCPUMGMVVM` Editor module to be included and loaded, with the native `ModelViewViewModel` plugin enabled. Editing the package descriptor without the corresponding build artifacts does not provide these tools. Use `tools/list` from the running editor as the authority.

## Read views, add contexts, and validate bindings

Check whether the Widget Blueprint already has the ViewModel Context you need. Read its configuration if it exists. To create or update a full binding, check for the enhanced module as described below.

Use `GetMVVMView` to see the contexts and bindings already in a Widget Blueprint. This query does not create or change MVVM data.

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

## Enable the optional enhanced MVVM module

The enhanced module adds `GetMVVMViewDetails`, `ValidateMVVMBindingAdvanced`, `SetMVVMBinding`, `RemoveMVVMBinding`, `UpdateMVVMViewModelContext` and `RemoveMVVMViewModelContext`. First read existing Context and Binding GUIDs and fingerprints, then validate complete paths with the read-only validator. Omit `BindingId` when creating a Binding with `SetMVVMBinding`; when updating, supply both `BindingId` and the current `ExpectedFingerprint`. `SourcePath` and `DestinationPath` are non-empty ordered arrays of field names, not dot-separated strings.

```json
{"BlueprintPath":"/Game/UI/WBP_Inventory","SourceType":"ViewModel","SourceName":"InventoryViewModel","SourcePath":["Title"],"DestinationWidgetName":"TitleText","DestinationPath":["Text"],"BindingMode":"OneTime"}
```

Enhanced tools support `OneTime`, `OneWay` and native `TwoWay`. Notification-driven modes require actual FieldNotify descriptors; both ends of `TwoWay` must also be readable, writable and of the same type. Native compilers in UE 5.2 to 5.8 do not accept **TwoWay combined with conversion functions**, so the tool rejects this before writing. One-way bindings can use `SourceToDestinationConversion` to reference an existing, loaded, valid single-parameter conversion `UFunction`; provide only this field without a reverse conversion. Write tools compile and attempt Undo on failure, but do not save assets. `RemoveMVVMBinding` requires `BindingId` and `ExpectedFingerprint`. Updating or deleting a Context requires the exact `ViewModelId` and expected previous values. When deleting a Context referenced by Bindings, `CascadeBindingIds` must list exactly all dependent Binding IDs or the request is rejected. Explicitly save the Widget Blueprint afterward as needed.

Native MVVM in UE 5.2 cannot carry notification bindings across a non-final UObject property into fields on another object. Enhanced validators and write tools reject these `OneWay` and `TwoWay` paths before modification, including cases where the object field still points to an instance of the same class. `OneTime` keeps its existing path validation. Root-level FieldNotify fields, paths traversing only structs and final UObject fields are not rejected by this restriction. UE 5.3 and later provide the corresponding native mechanism, but specific paths and project MVVM settings still need validation. In UE 5.3, an intentionally null dynamic source still produces native error logs; whether subscriptions and value updates resume after the object returns needs separate verification. `GetUIFrameworkCapabilities.ModelViewViewModel.EnhancedModule.BindingLimits.DynamicObjectSourceNotifications` reports the current engine's `EngineSupported`, `Reason` and `RequiresNativePathValidation`. Support for the mechanism does not mean every path and setting has been validated.
