---
title: Create, Open, and Save Niagara Systems
type: doc
slug: mcp-niagara-niagara-system-assets
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-niagara
documentKind: product-manual
websiteRoute: /en/works/mcp-niagara/docs/niagara-system-assets/
lang: en
translationKey: doc:mcp-niagara:niagara-system-assets
sourceHash: 048fe95e95c0315e38ea41f18a6ddaf4ef8ef769e1ae3b2a012d0444243822ba
translationStatus: translated
generatedBodyHash: 0cc8d9dc5e22decdf4ab0bdb4a89cf485223cd72f46827054faea7825ce6fd18
docPage:
  work: mcp-niagara
  group: features
  slug: niagara-system-assets
  order: 2
---

## Create a system or copy a template

`CreateNiagaraSystem` accepts only a valid long package name in a writable mount and rejects a `.ObjectName` suffix. Disk packages, loaded packages, and exact Asset Registry entries are checked before creation, so an existing asset is never overwritten. To make a variant of an existing effect, find the template and provide `TemplatePath` to copy it to a new package path. With no template path, the Niagara factory creates an empty system. After creation, note the canonical object path and package name, check the dirty state, and call `SaveAsset` to keep the asset.

## Open and save systems

`SaveAsset` uses non-fatal package-name conversion and rejects read-only targets. It succeeds only when `SavePackage` succeeds, the file exists, and the package is no longer dirty. After saving, use `OpenAsset` to open the system and check that you have the right asset. This call requires Unreal Editor and its asset editor subsystem to be available.
