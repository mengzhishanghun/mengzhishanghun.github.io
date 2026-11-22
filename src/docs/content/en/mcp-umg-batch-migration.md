---
title: Migrate Widget Properties in Batches
type: doc
slug: mcp-umg-batch-migration
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-umg
documentKind: product-manual
websiteRoute: /en/works/mcp-umg/docs/batch-migration/
lang: en
translationKey: doc:mcp-umg:batch-migration
sourceHash: f734da9e2441e82a7070cb453b06833a2ea268370793f4d8e62f66acd2c942a1
translationStatus: translated
generatedBodyHash: 2a65fb8816a55106b5db27d42e779aa08254c46beed947619cd51ce470715710
docPage:
  work: mcp-umg
  group: workflows
  slug: batch-migration
  order: 5
---

## BatchMigration

### Batch property migration

`BatchSetWidgetProperties` defaults to `dryRun:true`. Every target must provide the `expectedFingerprint` returned by `ExportWidgetSpec`. Any stale fingerprint, duplicate target or invalid property rejects the entire request with zero changes. Limits are 16 WBPs and 256 widgets.

Actual execution uses one Undo transaction per WBP and leaves them all unsaved. It does not automatically compile or save, and does not support Slot, relationship or structural migration. After writing, each field is checked through reflection. If an error occurs, the overall result is error and each package reports `Applied`, `Failed` or `NotAttempted`; cross-package rollback is not claimed. Use editor Undo separately for applied packages. If all targets already have the requested values, the tool reports `NoChange` without creating a transaction or dirtying packages.
