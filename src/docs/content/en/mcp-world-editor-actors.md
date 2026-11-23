---
title: Find and Place Actors
type: doc
slug: mcp-world-editor-actors
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
documentKind: product-manual
websiteRoute: /en/works/mcp-world-editor/docs/actors/
lang: en
translationKey: doc:mcp-world-editor:actors
sourceHash: 25affd69af14637423f662a6c0df3a1a2ed9bfdcf377635d3019a13dba3545aa
translationStatus: translated
generatedBodyHash: d2ba6086dc99c0cf90dcf532ebe1603223f23d260cda47690d8e229ca2f10c86
docPage:
  work: mcp-world-editor
  group: features
  slug: actors
  order: 6
---

## Identify actors

`ListActors` and `GetSelectedActors` return `ActorPath`, `FName`, `Label`, and `LevelPath`. Every tool that uses `ActorName/ActorNames` to address existing actors accepts the full `ActorPath` as the preferred exact identifier. Legacy labels and FNames execute only when they uniquely identify one actor in the current world; ambiguous input is rejected with sorted candidate paths instead of selecting, moving, editing, or deleting the wrong actor. For example, if two levels have actors with the same label, use `LevelPath` to identify the intended one and pass that row’s `ActorPath` to the editing tool. Look up the path again after a rename or level move.

## Placement modes

`PlaceActors` uses `Mode=Ground`, `Surface`, `Grid`, `Bounds`, or `Vertex` with `ActorNames` (up to 100 exact paths or unique names) to reposition existing actors. Ground and Surface trace downward and place the transformed bounds bottom on the hit; `bAlignNormal` optionally aligns Surface local +Z. Grid rounds world pivot coordinates using `GridSize`. Bounds places actors successively beside `ReferenceActor` using `Axis`, `Side`, and `Gap`. Vertex snaps to a vertex of `ReferenceActor`'s specified static-mesh `ReferenceComponent` and `LOD` within `SearchRadius` and `MaxVertices`. `Mode=Array` instead duplicates `SourceActor` `Count` times (1–100); `Spacing`, optional per-axis variation, and `Seed` control the resulting world transforms. Review the returned final transforms before saving.

For existing actors, choose what they should align to: a surface, the grid, a reference actor’s bounds, or a mesh vertex. Use Array to make spaced copies. When reviewing the final transforms, also check which actors are new copies in the level.
