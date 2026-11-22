---
title: Set Up UMG Focus Navigation
type: doc
slug: mcp-umg-navigation
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-umg
documentKind: product-manual
websiteRoute: /en/works/mcp-umg/docs/navigation/
lang: en
translationKey: doc:mcp-umg:navigation
sourceHash: 109d36e1d3ef7c7121b9b4d0b688d3427614446bd74184a1786d1fa21932f885
translationStatus: translated
generatedBodyHash: 9861ce9e91b9badbe9c98057bb4c304a656be123ec5a15b39979f8a80ab91123
docPage:
  work: mcp-umg
  group: interaction
  slug: navigation
  order: 2
---

`SetWidgetNavigation` configures native `UWidgetNavigation` data for one widget in a Widget Blueprint template. It does not send input, change runtime focus or save assets. A successful call only marks the in-memory asset dirty; call `SaveWidgetBlueprint` when ready to save.

## Read rules for all six directions

```json
{"BlueprintPath":"/Game/UI/WBP_Menu","WidgetName":"PlayButton"}
```

`GetWidgetNavigation` always returns `Up`, `Down`, `Left`, `Right`, `Next` and `Previous`. If no navigation object is configured, all six report `Escape`.

## Preflight and update selected directions

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
