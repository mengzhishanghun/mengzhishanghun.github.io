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
sourceHash: 77d6543de3b3f83c2efe6ebfb5f194aa1b5ca5711b0f465d4c9adcebd5eec4ca
translationStatus: translated
generatedBodyHash: de862eb61879bac468bc6d43957f7e649cad1b69a338276691c0d16c4cad9896
docPage:
  work: mcp-animation
  group: features
  slug: find-assets
  order: 1
---

## Skeletons and AnimSequences

| Tool | Purpose |
|---|---|
| `ListSkeletons` / `GetSkeletonDetail` | Discover Skeletons and read bones, virtual bones, compatible skeletons, blend profiles, and slot groups. |
| `ListAnimSequences` / `GetAnimSequenceDetail` | Discover AnimSequences and read duration, sampling rate, notifies, float curves, and compression status. |

Find the asset with the list tool, then pass its returned path to the matching detail tool. `GetAnimSequenceDetail` shows float-curve summaries, bone and curve compression settings, compression validity, and approximate sizes. Curves and compression settings are read-only through MCP; edit them in Unreal Editor.

Detail tools provide structured summaries rather than every curve key or per-bone animation track.

## List and detail limits

- List tools use `Offset` and `MaxResults`, return at most 256 entries per page, and report `TotalCount`, `Returned`, `HasMore`, and `NextOffset` when available. If there are more results, use the returned offset for the next page.
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
