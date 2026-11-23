---
title: Add an Actor Component
type: doc
slug: mcp-world-editor-actor-components
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
documentKind: product-manual
websiteRoute: /en/works/mcp-world-editor/docs/actor-components/
lang: en
translationKey: doc:mcp-world-editor:actor-components
sourceHash: cd4a313f63db2599135e82e36fc226483f837db7242bb74ae4fc8660202ad5cf
translationStatus: translated
generatedBodyHash: 661277b366dd172c487c4887dc816fdd5984e8acf0be2752b0e11bec78588d3d
docPage:
  work: mcp-world-editor
  group: features
  slug: actor-components
  order: 11
---

## Choose a component class

`AddComponent` accepts an exact full component class path or a short name that uniquely matches a currently loaded class; ambiguous short names are rejected with sorted full-path candidates. It rejects non-`ActorComponent`, abstract, deprecated, superseded, and `ClassWithin`-incompatible classes. The tool follows Unreal Editor’s creation order: it adds the instance component to the serialized array, sends the creation notification, and registers the component. If attachment, root assignment, or registration fails, it removes the new component and cancels the transaction.

Identify the target actor before choosing the class to add. If the short name matches more than one class, pick the intended full path from the returned candidates before trying again. After creation, check the new component and where it is attached on the actor.
