---
title: Reuse Component Instances and Named Slots
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
sourceHash: 0da2ee69ca1febe2a7efed559315754c39b7485a510773429ffcf7c5e572b791
translationStatus: translated
generatedBodyHash: df94c9f8aa865cb1f7b6b23a9b20ee4b252ebf02e8ca0696d698816e61da0cba
docPage:
  work: mcp-umg
  group: features
  slug: components-styles
  order: 5
---

## Component instances and Named Slots

These steps apply to component instances already in the tree. If you do not have a component yet, use `ExtractWidgetComponent` to turn an existing subtree into one.

### Create or replace Named Slot content

Check the host instance and what is currently in the slot. The request below is for an empty `Header` slot. If it already contains a widget, check that widget’s name before choosing to replace it or clear the slot.

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

### Set nested UserWidget instance properties

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

To turn another part of the tree into its own component, use `ExtractWidgetComponent` separately.
