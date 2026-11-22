---
title: Batch-edit Widget Properties
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
sourceHash: cb25e6f123f8e12e8ce3073123ec9d249c39a5b4714b30fce151ded178211d86
translationStatus: translated
generatedBodyHash: d506ea113b61281d5b092fa093a60f02d2f6297190db502499362fcb7afb33ee
docPage:
  work: mcp-umg
  group: widgets-layout
  slug: batch-migration
  order: 4
---

## Preflight, apply, and undo

`BatchSetWidgetProperties` defaults to `dryRun:true`. Every target must provide the `expectedFingerprint` returned by `ExportWidgetSpec`. Any stale fingerprint, duplicate target or invalid property rejects the entire request with zero changes. Limits are 16 WBPs and 256 widgets.

Actual execution uses one Undo transaction per WBP and leaves them all unsaved. It does not automatically compile or save, and does not support Slot, relationship or structural migration. After writing, each field is checked through reflection. If an error occurs, the overall result is error and each package reports `Applied`, `Failed` or `NotAttempted`; the tool does not roll back changes across packages. Use editor Undo separately for applied packages. If all targets already have the requested values, the tool reports `NoChange` without creating a transaction or dirtying packages.
