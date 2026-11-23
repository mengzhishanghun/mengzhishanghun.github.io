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
sourceHash: 420913a4df9640f6fb77b741e96383326fa735bc9a5f7c88472ac542055999f2
translationStatus: translated
generatedBodyHash: 851250f94610469a150ff3e5e6509520befebad55ffc678f1e4afb0fd6b65ba6
docPage:
  work: mcp-umg
  group: features
  slug: navigation
  order: 11
---

`SetWidgetNavigation` configures native `UWidgetNavigation` data for one widget in a Widget Blueprint template. It does not send input, change runtime focus or save assets. A successful call only marks the in-memory asset dirty; call `SaveWidgetBlueprint` when ready to save.

## Read rules for all six directions

```json
{"BlueprintPath":"/Game/UI/WBP_Menu","WidgetName":"PlayButton"}
```

`GetWidgetNavigation` always returns `Up`, `Down`, `Left`, `Right`, `Next` and `Previous`. If no navigation object is configured, all six report `Escape`.

## Preflight and update selected directions

For example, to move focus down from the start button to the options button, read the start button’s current rules, then preflight that direction with `dryRun`. After applying the change, read the rule back and test moving focus down from the start button in PIE.

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

Omit `dryRun` or set it to `false` to apply the rules. The tool checks every direction in the request before writing them in one transaction. To restore a direction's default escape rule, submit just that direction:

```json
{"BlueprintPath":"/Game/UI/WBP_Menu","WidgetName":"PlayButton","Rules":{"Down":{"Rule":"Escape"}}}
```

Invalid directions, missing/cross-tree/self-referencing explicit targets and missing custom functions fail before any object is modified.
