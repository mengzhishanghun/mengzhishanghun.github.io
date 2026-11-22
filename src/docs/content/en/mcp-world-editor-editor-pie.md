---
title: Inspect and Control PIE
type: doc
slug: mcp-world-editor-editor-pie
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
documentKind: product-manual
websiteRoute: /en/works/mcp-world-editor/docs/editor-pie/
lang: en
translationKey: doc:mcp-world-editor:editor-pie
sourceHash: dbe7a0e8e28d02a5829de0d6ee9ae6dd9f02e390ff850d518435a320d2c62ebc
translationStatus: translated
generatedBodyHash: c68423afe6f1cd684dd002f2ef6dc822108fc3ed7332b31ac308ce7c278e3067
docPage:
  work: mcp-world-editor
  group: editor
  slug: editor-pie
  order: 2
---

## Queued starts and cancellation

The editor becomes busy as soon as a PIE start request is queued. `PIEControl/GetState` and `GetEditorState` distinguish `Idle`, `StartQueued`, and `Playing`, while `Stop` can cancel a queued start.
