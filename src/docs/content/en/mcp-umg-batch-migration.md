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
sourceHash: 051e8ff2e6c982bc2b94731aeb92325252eee0008c1f11658b4ae20b60bcc390
translationStatus: translated
generatedBodyHash: f9e2455d52462def010b376d57837bc130261b3f24aabcaa0389ec8618ce9786
docPage:
  work: mcp-umg
  group: features
  slug: batch-migration
  order: 4
---

## Preflight, apply, and undo

Use this workflow to edit the properties of existing widgets in bulk. It applies to values on the widgets themselves. List the assets, widget names, and values you want to change, then read the fingerprint for each target. Check the target list after the dry run. If an asset changes in the meantime, fetch fresh fingerprints and run the preflight again.

`BatchSetWidgetProperties` defaults to `dryRun:true`. Every target must provide the `expectedFingerprint` returned by `ExportWidgetSpec`. Any stale fingerprint, duplicate target or invalid property rejects the entire request with zero changes. Limits are 16 WBPs and 256 widgets.

Applying changes creates a separate Undo transaction for each WBP and leaves its edits in memory. The tool does not compile or save, or change slots, relationships, or the widget tree structure. After writing, each field is checked through reflection. If an error occurs, the overall result is error and each package reports `Applied`, `Failed` or `NotAttempted`; the tool does not roll back changes across packages. Use editor Undo separately for applied packages. If all targets already have the requested values, the tool reports `NoChange` without creating a transaction or dirtying packages.

If execution fails, check the per-package results before deciding which edits to undo. Once you have corrected the problem, fetch fresh fingerprints and run preflight only for targets that still need changes.
