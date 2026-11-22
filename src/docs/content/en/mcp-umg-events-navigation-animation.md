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
sourceHash: e8a490a20e739041cfeeea7cea663fd6116344f5c6193a3462f036a9f986d619
translationStatus: translated
generatedBodyHash: db3c033efd6f8da2e961dc0580f558ba3e39fb42746b07fd1276866fffe8631e
docPage:
  work: mcp-umg
  group: interaction-frameworks
  slug: events-navigation-animation
  order: 1
---

## Event nodes and interaction logic

After identifying the Widget Blueprint and widget, use `BindWidgetEvent` to add the binding and `AddEventActions` to add actions. Use `UnbindWidgetEvent` to remove the binding. For advanced graph operations, [connect MCPBlueprint](/en/works/mcp-blueprint/docs/connect/) first.

| Tool | Purpose |
| --- | --- |
| BindWidgetEvent | Bind widget event |
| UnbindWidgetEvent | Remove a widget event binding |
| AddEventActions | Add event actions |
| SetPropertyBinding | Set a widget property binding |

To check live interactions, open the target page in PIE and [inspect its runtime instance](/en/works/mcp-umg/docs/runtime-diagnostics/). See [focus navigation](/en/works/mcp-umg/docs/navigation/) for focus rules, and [UMG animations](/en/works/mcp-umg/docs/animation/) for timelines and keys.
