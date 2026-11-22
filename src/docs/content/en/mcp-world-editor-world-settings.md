---
title: Edit World Settings
type: doc
slug: mcp-world-editor-world-settings
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
documentKind: product-manual
websiteRoute: /en/works/mcp-world-editor/docs/world-settings/
lang: en
translationKey: doc:mcp-world-editor:world-settings
sourceHash: 7a7903ffb4cf4dc1fe14b3503a829565e2aaa1912ca029a8607be2da14a70b9d
translationStatus: translated
generatedBodyHash: 105fa032c2ddcc8c23fd838e133480df06a73faf34f81b754d884b28a8310234
docPage:
  work: mcp-world-editor
  group: levels
  slug: world-settings
  order: 5
---

## Read and edit properties

`GetWorldSettings` returns exact names and UE text values for every property currently editable on the instance. It no longer hides default-valued properties or presents read-only BlueprintVisible fields as writable discovery results. `SetWorldSettings` requires exact case, rejects property flags or `CanEditChange` conditions that disable editing, and pairs `PreEditChange` with `PostEditChangeProperty` inside the transaction. An import failure first restores the old value; if restoration also fails, the error reports the transaction rollback result, and a failed rollback means editor state may have changed.
