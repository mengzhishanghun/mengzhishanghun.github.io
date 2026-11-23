---
title: Add an Interface to a Blueprint
type: doc
slug: mcp-blueprint-interfaces
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-blueprint
documentKind: product-manual
websiteRoute: /en/works/mcp-blueprint/docs/interfaces/
lang: en
translationKey: doc:mcp-blueprint:interfaces
sourceHash: 19d83bd26c79989bb484c789a19d9f7e080f1d693ff5791dc5ea530442273888
translationStatus: translated
generatedBodyHash: 22a020b6fc4c401afbd692d023340ac7f91d83f377f827d748437fc7059c57c3
docPage:
  work: mcp-blueprint
  group: features
  slug: interfaces
  order: 7
---

## Read the current interfaces and specify the new one

Use `GetBlueprintOverview` to confirm the target `BlueprintPath` and see whether the interface is already listed. If it needs to be added, pass its class path to `AddInterface`. Check the same Blueprint’s interface list after adding it, then call `SaveAsset` if you want to keep the change.
