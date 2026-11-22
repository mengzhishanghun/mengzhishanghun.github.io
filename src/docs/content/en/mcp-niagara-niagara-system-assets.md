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
sourceHash: c284738f43e4cfce303348dc82ba5defe8fff65230a754f118ba62f95668b57c
translationStatus: translated
generatedBodyHash: 3b110a3d521d90988b240b95928ecacee158f23dbe22258b1cc376144799d808
docPage:
  work: mcp-niagara
  group: systems
  slug: niagara-system-assets
  order: 2
---

## Create a system or copy a template

`CreateNiagaraSystem` accepts only a valid long package name in a writable mount and rejects a `.ObjectName` suffix. Disk packages, loaded packages, and exact Asset Registry entries are checked before creation, so an existing asset is never overwritten. `TemplatePath` performs a real template duplication; without it, the Niagara factory creates an empty system. The response reports the canonical object path, package name, and dirty state; call `SaveAsset` to persist it.

## Open and save systems

`SaveAsset` uses non-fatal package-name conversion and rejects read-only targets. It succeeds only when `SavePackage` succeeds, the file exists, and the package is no longer dirty. `OpenAsset` checks both the editor and AssetEditorSubsystem lifecycle.
