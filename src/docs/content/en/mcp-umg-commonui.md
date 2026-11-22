---
title: Configure CommonUI Widgets and Input
type: doc
slug: mcp-umg-commonui
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-umg
documentKind: product-manual
websiteRoute: /en/works/mcp-umg/docs/commonui/
lang: en
translationKey: doc:mcp-umg:commonui
sourceHash: 02002941ac77911978e4501379c10d718200187d083eca94599d55a26915b1c9
translationStatus: translated
generatedBodyHash: 763e5b4bfe2b039aecc3d676e54f3def8964f49bbbbd154995f054427e4a7611
docPage:
  work: mcp-umg
  group: framework-integration
  slug: commonui
  order: 1
---

## Check framework availability

Call `GetUIFrameworkCapabilities` to check whether CommonUI is available in this project. The possible states are `NotInstalled`, `InstalledDisabled`, `EnabledNotLoaded` or `Available`. This query does not change project, module or asset state.

To use an optional framework, have the project owner manually enable its plugin as needed and restart the editor. MCPUMG does not enable plugins or load disabled modules on your behalf.

For data binding, see [MVVM contexts and bindings](/en/works/mcp-umg/docs/mvvm/).

## Configure existing widgets, input, and live instances

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

At runtime, obtain a token with `ListRuntimeWidgets`, then use `InspectCommonUI` to read the instance or a specified `WidgetName`. `ControlCommonUI` accepts `Action` values `Activate`, `Deactivate`, `Push` and `Remove`. `Push` requires a container `WidgetName` and compiled `WidgetClassPath`; `Remove` uses the current stacked target's `TargetToken`. These operations act on existing instances without saving Widget Blueprints. See [Runtime interaction and diagnostics](/en/works/mcp-umg/docs/runtime-diagnostics/#find-the-target-runtime-instance).
