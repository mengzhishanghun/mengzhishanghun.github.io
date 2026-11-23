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
sourceHash: cbf4050ff052d1cbf47139891e5183795f0797743320389798f3bf71d87dfc2f
translationStatus: translated
generatedBodyHash: 51d84e2fbfb068a188af5724bb7019ca4f5dc0e6e51a1b673b750532e643cdc0
docPage:
  work: mcp-world-editor
  group: features
  slug: editor-pie
  order: 20
---

## Queued starts and cancellation

As soon as a PIE start request enters the queue, the editor is busy. `PIEControl/GetState` and `GetEditorState` distinguish `Idle`, `StartQueued`, and `Playing`, while `Stop` can cancel a queued start.

Read the state after requesting a start. If it is `StartQueued`, wait for `Playing` before taking an action that needs a live session. If you cancel a queued start, read the state again and check that it returns to `Idle`.
