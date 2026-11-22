---
title: Change a Blueprint Parent Class
type: doc
slug: mcp-blueprint-class-inheritance
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-blueprint
documentKind: product-manual
websiteRoute: /en/works/mcp-blueprint/docs/class-inheritance/
lang: en
translationKey: doc:mcp-blueprint:class-inheritance
sourceHash: c210d016b72abceceaa82cb17a66f96628c2a661d666226cdb729c534876dd21
translationStatus: translated
generatedBodyHash: 7c8325c8731058d7948fc69c0dcf902e91e30c87e925466b9e74d6c5ec246f55
docPage:
  work: mcp-blueprint
  group: class-structure
  slug: class-inheritance
  order: 3
---

## Check and change class inheritance

To change class inheritance with `ReparentBlueprint`, supply `NewParentClassPath` as a full native path, a unique loaded short name, or a Blueprint-generated class. Start with `bDryRun=true` to inspect the risks. Explicit `bAllowPotentialDataLoss=true` is required if the new parent is not a subclass of the old parent, the old parent is missing, or interfaces conflict. The tool refreshes graphs and attempts Undo rollback on failure.

Class inheritance and component attachment are separate settings. Use `ReparentComponent` to move a component within the same Blueprint. Call `SaveAsset` to keep a change to class inheritance.
