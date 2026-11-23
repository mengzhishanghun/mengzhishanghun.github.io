---
title: Set Up UMG Event Logic
type: doc
slug: mcp-umg-events-navigation-animation
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-umg
documentKind: product-manual
websiteRoute: /en/works/mcp-umg/docs/events-navigation-animation/
lang: en
translationKey: doc:mcp-umg:events-navigation-animation
sourceHash: de6652f546ab6235b483621da551be08f0f0a3dfd1cdc24eb607bff76274c69b
translationStatus: translated
generatedBodyHash: 7e821650495e358aba1004d4ebdc802debbef6ecbd3d6bb210c843e9fda04816
docPage:
  work: mcp-umg
  group: features
  slug: events-navigation-animation
  order: 10
---

## Event nodes and interaction logic

First identify the event and the change you expect when it fires. For example, to add a click action to an existing button, provide the Widget Blueprint path, the button name, and the action you want. Configure a property binding separately with `SetPropertyBinding`.

Once you have the Widget Blueprint and widget, bind the event with `BindWidgetEvent`, then use `AddEventActions` to set what it does when it fires. To remove the binding, use `UnbindWidgetEvent`. For advanced graph operations, [connect MCPBlueprint](/en/works/mcp-blueprint/docs/connect/) first.

| Tool | Purpose |
| --- | --- |
| BindWidgetEvent | Bind widget event |
| UnbindWidgetEvent | Remove a widget event binding |
| AddEventActions | Add event actions |
| SetPropertyBinding | Set a widget property binding |

To check live interactions, open the target page in PIE and [inspect its runtime instance](/en/works/mcp-umg/docs/runtime-diagnostics/). See [focus navigation](/en/works/mcp-umg/docs/navigation/) for focus rules, and [UMG animations](/en/works/mcp-umg/docs/animation/) for timelines and keys.
