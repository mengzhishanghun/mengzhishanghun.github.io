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
sourceHash: 42ce731ce9153f495e789d0c4254de2292650a3cefd7a58f8445b8f6dfef0a3c
translationStatus: translated
generatedBodyHash: ef0bfaf927ebb4509af69723df7dd1e0886e10bef8766183575934eb5a7b27c4
docPage:
  work: mcp-blueprint
  group: features
  slug: class-inheritance
  order: 12
---

## Check and change class inheritance

Check the current parent with `GetBlueprintOverview`. To change it, call `ReparentBlueprint` with `NewParentClassPath` as a full native path, a unique loaded short name, or a Blueprint-generated class. Start with `bDryRun=true` to inspect the risks. Explicit `bAllowPotentialDataLoss=true` is required if the new parent is not a subclass of the old parent, the old parent is missing, or interfaces conflict. The tool refreshes the graphs after applying the change and attempts to roll it back with Undo if it fails. Check the Blueprint overview for the current parent before saving.

Class inheritance and component attachment are separate settings. Use `ReparentComponent` to move a component within the same Blueprint. Call `SaveAsset` to keep a change to class inheritance.
