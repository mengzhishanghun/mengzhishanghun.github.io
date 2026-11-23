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
sourceHash: 8089d61bcec9baddf5648632e3e056875d4cc76681c9c3cc7656ce935707f8c8
translationStatus: translated
generatedBodyHash: 2ed0aadd93209ff8212e920db3c9790eb563ed9f9a13793240e701fbe6fb9318
docPage:
  work: mcp-blueprint
  group: features
  slug: events-dispatchers
  order: 6
---

## Create events or edit dispatchers

| Tool | Purpose | Notes |
| --- | --- | --- |
| `CreateCustomEvent` | Creates a Custom Event in an Event Graph. | The target must be an actual Event Graph. |
| `AddEventNode` | Adds a supported event node. | Specify the Blueprint and event type. |
| `AddBoundEvent` | Adds a bound event for a component or delegate. | The component and delegate must be resolvable. |
| `AddEventDispatcher` | Adds an Event Dispatcher. | Specify its name and signature. |
| `RemoveEventDispatcher` | Removes an Event Dispatcher. | References or an inability to recover safely block removal. |

Decide whether you need an event node in the Event Graph or an Event Dispatcher with a signature. Before adding a bound component event, make sure the tool can resolve the component and delegate. You can specify the signature when creating a dispatcher. Custom Events and Event Dispatchers have fewer signature-editing options than ordinary functions.

## Examples: Actor lifecycle and component bindings

The helper function is on the right in the first image. In the second, the orange box holds Actor lifecycle nodes. The red box shows the bound overlap event and its outgoing connection. The custom event below it shows its parameter pin.

![Component-event helper graph](/media-occurrence/doc%3Amcp-blueprint%3Aevents-dispatchers%3Amedia%3A1)

![Actor lifecycle, bound component event, and variable-pin flow](/media-occurrence/doc%3Amcp-blueprint%3Aevents-dispatchers%3Amedia%3A2)
