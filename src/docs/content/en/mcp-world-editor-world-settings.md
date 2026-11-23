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
sourceHash: e68287d1e68652854aebecb8ca8d18f0234bebf7091fa5ddb9e388583afbb6e1
translationStatus: translated
generatedBodyHash: 489ff275b04820e251579e983a65a915da1632b4ecd4b7ce7697a9ec93b493f4
docPage:
  work: mcp-world-editor
  group: features
  slug: world-settings
  order: 5
---

## Read and edit properties

`GetWorldSettings` returns exact names and UE text values for every property currently editable on the instance. The result includes properties that still have their default values. Read-only BlueprintVisible fields cannot be edited. `SetWorldSettings` requires exact case, rejects property flags or `CanEditChange` conditions that disable editing, and pairs `PreEditChange` with `PostEditChangeProperty` inside the transaction. An import failure first restores the old value; if restoration also fails, the error reports the transaction rollback result, and a failed rollback means editor state may have changed.

Use the read result to confirm the name and record its current text value before editing. Read the same property back afterward. If rollback fails, check the value in the editor before deciding whether to send another edit.
