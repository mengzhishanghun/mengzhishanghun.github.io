---
title: Find and Edit Animation Notifies
type: doc
slug: mcp-animation-animation-notifies
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-animation
documentKind: product-manual
websiteRoute: /en/works/mcp-animation/docs/animation-notifies/
lang: en
translationKey: doc:mcp-animation:animation-notifies
sourceHash: 43fa2eeb3bae55a84fbb53790459ea90d0a8bbb568fca6debd85aa27eb6e59e9
translationStatus: translated
generatedBodyHash: 46ed19951e67d02920c89d3f7a5babc6fa3c78b7402cd4a8ece7b942c5450685
docPage:
  work: mcp-animation
  group: features
  slug: animation-notifies
  order: 4
---

## Find classes and edit notifies

| Tool | Purpose |
|---|---|
| `ListNotifyClasses` | Discover native and Blueprint AnimNotify/AnimNotifyState classes. |

| Tool | Purpose |
|---|---|
| `AddNotify` / `RemoveNotify` | Add or remove a notify on an AnimSequence or Montage. |

Before adding a notify, find the class with `ListNotifyClasses` and check whether the destination is an AnimSequence or a Montage. Before removing one, locate it in the asset’s details. After the edit, check the notify list on that same asset.

For paths, transactions, and saving, see how to [open and save animation assets](/en/works/mcp-animation/docs/find-assets/).
