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
sourceHash: 7988153b2eaaf4057a485267174c9b8c17960dde2b0d1dd78270f9fc36a7888b
translationStatus: translated
generatedBodyHash: f7f3daa653b1b013ca9d2eedfe759e9d3e4f07eda22b9be083ffc6616b7244e1
docPage:
  work: mcp-blueprint
  group: members-types
  slug: interfaces
  order: 4
---

## Read the current interfaces and specify the new one

Use `GetBlueprintOverview` to confirm the target `BlueprintPath` and its implemented interfaces. Pass the interface class path to `AddInterface`, then call `SaveAsset` if you want to keep the change.
