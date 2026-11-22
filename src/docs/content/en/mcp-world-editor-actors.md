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
sourceHash: 88977cd335c7b7881d955f3700db2801bbb3c4ef4765b918993c04b8139d33f0
translationStatus: translated
generatedBodyHash: ae6041dc3b525ae6d67df0352e8cb0934f9398ba7d1399680a75cb8d6b5b2900
docPage:
  work: mcp-world-editor
  group: actors
  slug: actors
  order: 1
---

## Identify actors

`ListActors` and `GetSelectedActors` return `ActorPath`, `FName`, `Label`, and `LevelPath`. Every tool that uses `ActorName/ActorNames` to address existing actors accepts the full `ActorPath` as the preferred exact identifier. Legacy labels and FNames execute only when they uniquely identify one actor in the current world; ambiguous input is rejected with sorted candidate paths instead of selecting, moving, editing, or deleting the wrong actor. Refresh discovery after an actor is renamed or moved to another level because its path changes.

## Placement modes

`PlaceActors` uses `Mode=Ground`, `Surface`, `Grid`, `Bounds`, or `Vertex` with `ActorNames` (up to 100 exact paths or unique names) to reposition existing actors. Ground and Surface trace downward and place the transformed bounds bottom on the hit; `bAlignNormal` optionally aligns Surface local +Z. Grid rounds world pivot coordinates using `GridSize`. Bounds places actors successively beside `ReferenceActor` using `Axis`, `Side`, and `Gap`. Vertex snaps to a vertex of `ReferenceActor`'s specified static-mesh `ReferenceComponent` and `LOD` within `SearchRadius` and `MaxVertices`. `Mode=Array` instead duplicates `SourceActor` `Count` times (1–100); `Spacing`, optional per-axis variation, and `Seed` control the resulting world transforms. Review the returned final transforms before saving.
