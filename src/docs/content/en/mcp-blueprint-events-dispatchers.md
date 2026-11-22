---
title: Add Events and Manage Event Dispatchers
type: doc
slug: mcp-blueprint-events-dispatchers
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-blueprint
documentKind: product-manual
websiteRoute: /en/works/mcp-blueprint/docs/events-dispatchers/
lang: en
translationKey: doc:mcp-blueprint:events-dispatchers
sourceHash: cfbc4365f0040f5fc5a365103455e8378e8a2027502ba7c369ea9fb9d8eed989
translationStatus: translated
generatedBodyHash: 0433175e1cb98fa2a202c1dc63a14ea9e00517fd3ff27d14b91a54259f781722
docPage:
  work: mcp-blueprint
  group: members-types
  slug: events-dispatchers
  order: 3
---

## Create events or edit dispatchers

| Tool | Purpose | Notes |
| --- | --- | --- |
| `CreateCustomEvent` | Creates a Custom Event in an Event Graph. | The target must be an actual Event Graph. |
| `AddEventNode` | Adds a supported event node. | Specify the Blueprint and event type. |
| `AddBoundEvent` | Adds a bound event for a component or delegate. | The component and delegate must be resolvable. |
| `AddEventDispatcher` | Adds an Event Dispatcher. | Specify its name and signature. |
| `RemoveEventDispatcher` | Removes an Event Dispatcher. | References or an inability to recover safely block removal. |

Set the signature when adding an Event Dispatcher. Custom Events and Event Dispatchers have fewer signature-editing options than ordinary functions.

## Examples: Actor lifecycle and component bindings

The examples show a component-event helper function and a graph with Actor lifecycle events, a bound component event, and a node with a variable pin count.

![Component-event helper graph](/media-occurrence/doc%3Amcp-blueprint%3Aevents-dispatchers%3Amedia%3A1)

![Actor lifecycle, bound component event, and variable-pin flow](/media-occurrence/doc%3Amcp-blueprint%3Aevents-dispatchers%3Amedia%3A2)
