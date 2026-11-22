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
sourceHash: 6d9fecf19e6d98182f5c82676f861c6c0b478dff127b068380991ba6f46e756f
translationStatus: translated
generatedBodyHash: 4a98e2d041708fc5523f0e3d59438c618f3acfa010fcf1913ec67f1b42875334
docPage:
  work: mcp-umg
  group: component-reuse
  slug: components-styles
  order: 1
---

## Component instances and Named Slots

Use `ExtractWidgetComponent` to turn an existing subtree into a reusable component first. The steps here apply to component instances already in the tree.

### Create or replace Named Slot content

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

Use `ExtractWidgetComponent` to turn an existing subtree into a reusable component first. The steps here apply to component instances already in the tree.
