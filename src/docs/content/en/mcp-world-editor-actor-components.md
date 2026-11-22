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
sourceHash: a14c6d1bf49a491a918222c4b350a7c71d9c45131a7968a59c76a264d65cc1bb
translationStatus: translated
generatedBodyHash: 9ad1522ff41d62922e0e6d809440d11fa247d9c2be12c9569bd097433acedfd9
docPage:
  work: mcp-world-editor
  group: actors
  slug: actor-components
  order: 6
---

## Choose a component class

`AddComponent` accepts an exact full component class path or a short name that uniquely matches a currently loaded class; ambiguous short names are rejected with sorted full-path candidates. It rejects non-`ActorComponent`, abstract, deprecated, superseded, and `ClassWithin`-incompatible classes. Instance components follow the Unreal Editor creation order for serialization, creation notification, and registration; attachment, root assignment, or registration failure cleans up the new component and cancels the transaction.
