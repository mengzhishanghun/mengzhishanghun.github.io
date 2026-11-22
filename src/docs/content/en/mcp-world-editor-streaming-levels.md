---
title: Manage Streaming Levels and Move Actors
type: doc
slug: mcp-world-editor-streaming-levels
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
documentKind: product-manual
websiteRoute: /en/works/mcp-world-editor/docs/streaming-levels/
lang: en
translationKey: doc:mcp-world-editor:streaming-levels
sourceHash: 110a5a16f8470bfa94c2c6d8c2a74554e970e2f9f02cb7952120a0487954a31f
translationStatus: translated
generatedBodyHash: 7647b6ca240464224827bb1a423e064b1c51a3dd384cfe89eb0ac076b72e44bd
docPage:
  work: mcp-world-editor
  group: world-partition
  slug: streaming-levels
  order: 1
---

## Remove a streaming level

`RemoveStreamingLevel` is not itself undoable. It requests that Unreal Engine preserve the existing Undo buffer, but stale references may still cause the engine to reset that buffer, so Undo-history preservation is not guaranteed. The tool removes Actor, Component, Object, and BSP selections that belong to the target level. It snapshots and verifies restoration of selected Actors, Components, and Objects outside that level; BSP selections in other levels are left untouched rather than cleared globally. If removal fails, the tool also attempts to restore the target-level selection and reports whether restoration was verified.

## Move actors to a level

`MoveActorsToLevel` attempts to restore and verify the pre-call Actor, Component, Object, and BSP selection, and returns an error when complete restoration cannot be verified. It rejects the request before moving actors when Selection Lock is enabled or actor identity cannot be mapped uniquely. If the batch result is inconsistent, the tool does not issue an automatic Undo because it cannot prove that the top transaction belongs to this call; inspect both actor locations and selection state before continuing.
