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
sourceHash: efe9179f4e3d432fa088a67f392d295a92dffa8e15ef02c325498c57bc3f305b
translationStatus: translated
generatedBodyHash: 8243ab8b81f7d21ba7884cc3495b306a9c1ccbac6622fff9e8a0def20932612f
docPage:
  work: mcp-world-editor
  group: features
  slug: streaming-levels
  order: 12
---

## Remove a streaming level

`RemoveStreamingLevel` is not itself undoable. It requests that Unreal Engine preserve the existing Undo buffer, but stale references may still cause the engine to reset that buffer, so Undo-history preservation is not guaranteed. The tool removes Actor, Component, Object, and BSP selections that belong to the target level. It snapshots and verifies restoration of selected Actors, Components, and Objects outside that level; BSP selections in other levels are left untouched rather than cleared globally. If removal fails, the tool also attempts to restore the target-level selection and reports whether restoration was verified.

Use the move operation below if you only need to put actors in another level. If you intend to remove a streaming level, confirm which level it is and deal with any edits you still need to undo before removing it.

## Move actors to a level

`MoveActorsToLevel` attempts to restore and verify the pre-call Actor, Component, Object, and BSP selection, and returns an error when complete restoration cannot be verified. It rejects the request before moving actors when Selection Lock is enabled or actor identity cannot be mapped uniquely. If the batch result is inconsistent, the tool does not issue an automatic Undo because it cannot prove that the top transaction belongs to this call; inspect both actor locations and selection state before continuing.

Confirm the destination level and the actor paths before the move. Then look up the actors again and confirm their level and new paths before editing them further.
