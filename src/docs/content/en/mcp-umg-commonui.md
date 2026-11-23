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
sourceHash: 5aebd7b9ea83292bf7408a966b49d458cb6277c1c999cd13188879fe8c8a9b69
translationStatus: translated
generatedBodyHash: d9881e1bfe712b6dd5d33a69809b9f314fc937b87653c7db31b8946561b2ac76
docPage:
  work: mcp-umg
  group: features
  slug: commonui
  order: 13
---

## Check framework availability

Call `GetUIFrameworkCapabilities` to check whether CommonUI is available in this project. The possible states are `NotInstalled`, `InstalledDisabled`, `EnabledNotLoaded` or `Available`. This query does not change project, module or asset state.

If the project needs CommonUI, have the project owner enable the plugin manually and restart the editor. MCPUMG does not enable plugins or load disabled modules on your behalf.

For data binding, see [MVVM contexts and bindings](/en/works/mcp-umg/docs/mvvm/).

## Configure existing widgets, input, and live instances

To change the lock behavior of an existing button, identify its blueprint and widget name, then use the example below to preflight the property. To check whether input actually reaches the widget, test on the running page. Asset configuration can only validate the fields and references.

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
