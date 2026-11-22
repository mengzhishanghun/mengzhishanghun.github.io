---
title: Edit the Widget Tree
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
sourceHash: 08d98341c272db7d782d9b2d41e1b56072be3f60334d0060aff62f1a56d0d214
translationStatus: translated
generatedBodyHash: 6c52d29f6c2c50523932c6ac3132ecd93a2656c8da5ffa28f08d0cbc1c703dfc
docPage:
  work: mcp-umg
  group: widgets-layout
  slug: layout
  order: 1
---

## Find widgets and edit their structure

| Tool | Purpose |
| --- | --- |
| ListWidgetBlueprints | List Widget Blueprints (convenience entry point) |
| GetWidgetTree | Get widget tree structure |
| GetWidgetProperties | Get widget properties |
| SearchWidgetClasses | Search available widget classes |
| AddWidget | Add widget |
| RemoveWidget | Remove widget |
| RenameWidget | Rename widget and update related bindings |
| ReparentWidget | Move widget to new parent |
| DuplicateWidget | Duplicate a widget subtree |
| WrapWidget | Wrap a widget in a new parent container |
| SetWidgetProperties | Set widget properties |
| SetSlotProperties | Set slot properties (layout parameters) |
| SetListViewEntryClass | Configure a validated `IUserObjectListEntry` class for ListView, TileView, or TreeView |

`SetListViewEntryClass` persists only the entry class. Unreal marks `UListView::ListItems` as transient, so populate items from Blueprint or runtime data with `SetListItems`/`AddItem`.

## Patch, zero, or reset properties

`SetWidgetProperties` and `SetSlotProperties` use partial updates by default. `Properties={}` is invalid; `Padding="()"` retains existing structure members rather than zeroing them. To set zero padding, supply all four edges explicitly: `(Left=0,Top=0,Right=0,Bottom=0)`.

The optional `ResetToClassDefault=true` first restores only the top-level fields specified in `Properties` to their Widget/Slot class CDO defaults, then imports the supplied values. It leaves other fields and the class default object unchanged. It does not mean zero values or read overrides from parent Blueprint instances. The returned `PropertyUpdateMode` distinguishes `PatchCurrentValue` from `ResetToClassDefault`.

## Set widget and slot layout

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

## Create, configure, and save a Widget Blueprint

| Tool | Purpose |
| --- | --- |
| CreateWidgetBlueprint | Create Widget Blueprint |
| SetWidgetBlueprintSettings | Set Widget Blueprint settings |
| SaveWidgetBlueprint | Compile and save exactly one Widget Blueprint without Save All or unrelated dirty packages |

To apply a tree specification, see [Build UMG from a Reference Image](/en/works/mcp-umg/docs/image-to-umg/). For style fields on existing widgets, see [Style Widgets](/en/works/mcp-umg/docs/widget-styles/).
