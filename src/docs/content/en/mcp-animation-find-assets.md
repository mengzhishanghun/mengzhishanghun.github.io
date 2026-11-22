---
title: Find, Inspect, and Save Animation Assets
type: doc
slug: mcp-animation-find-assets
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-animation
documentKind: product-manual
websiteRoute: /en/works/mcp-animation/docs/find-assets/
lang: en
translationKey: doc:mcp-animation:find-assets
sourceHash: 5d31b9ed5f358044739f39850a04af2ab3ed216fc732fa92a658a3075d82592d
translationStatus: translated
generatedBodyHash: 6c182d81361ca00fd2818f13e2d7a23c7f44e0aa2528914bcb26277f26b3a65e
docPage:
  work: mcp-animation
  group: assets
  slug: find-assets
  order: 1
---

## Skeletons and AnimSequences

| Tool | Purpose |
|---|---|
| `ListSkeletons` / `GetSkeletonDetail` | Discover Skeletons and read bones, virtual bones, compatible skeletons, blend profiles, and slot groups. |
| `ListAnimSequences` / `GetAnimSequenceDetail` | Discover AnimSequences and read duration, sampling rate, notifies, float curves, and compression status. |

`GetAnimSequenceDetail` exposes read-only float-curve summaries, bone and curve compression settings, compression validity, and approximate sizes. Curve and compression writes are intentionally unavailable: those operations can rebuild the animation data model, trigger expensive recompression, and use editing APIs that evolved across UE 5.2–5.8. Automated writes would carry unacceptable asset-corruption risk until transactional rollback, version compatibility, and bounded execution can all be guaranteed.

Detail tools provide structured summaries rather than every curve key or per-bone animation track.

## List and detail limits

- List tools use `Offset` and `MaxResults`, return at most 256 entries per page, and report `TotalCount`, `Returned`, `HasMore`, and `NextOffset` when available.
- Detail tools cap collections such as bones, states, notifies, and curves at 256 entries and report true totals plus `*Truncated` flags. Detail collections cannot be paged. If a collection exceeds the limit, inspect it in Unreal Editor.

## Open and save animation assets

| Tool | Purpose |
|---|---|
| `SaveAsset` | Explicitly save a modified asset. |
| `OpenAsset` | Open an asset in Unreal Editor. |

- Call the matching `List*` tool first to obtain canonical asset paths. Asset writes are restricted to valid project content under `/Game`.
- Write tools run on the editor game thread and use Undo transactions where applicable. Successful changes mark assets dirty.
- Changes are not saved implicitly. Call `SaveAsset` after verifying the result; Unreal Editor Undo remains available where supported.
- Write tools reject execution with a reason while the editor is busy with PIE, saving, or garbage collection.
