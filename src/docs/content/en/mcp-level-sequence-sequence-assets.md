---
title: Find, Create, and Save Level Sequences
type: doc
slug: mcp-level-sequence-sequence-assets
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-level-sequence
documentKind: product-manual
websiteRoute: /en/works/mcp-level-sequence/docs/sequence-assets/
lang: en
translationKey: doc:mcp-level-sequence:sequence-assets
sourceHash: c60d824d009840781cfc4189dbede0d6663cec0bcbe3b9c5a4f77f8cefce6e59
translationStatus: translated
generatedBodyHash: f05ec414bd90f8cdbfd3dbfed50932d84b0573bfc3a046498705d031947f455f
docPage:
  work: mcp-level-sequence
  group: features
  slug: sequence-assets
  order: 1
---

## Discovery and pagination

| Group | Tools | Purpose |
|---|---|---|
| Sequence | `ListSequences`, `GetSequenceDetail`, `CreateSequence` | Discover, inspect with pagination, and create sequences |

- `ListSequences`: 100 by default, capped at 500 per page.
- `GetSequenceDetail`: pages a stable combined Binding/Track/Section traversal with `Offset` and `MaxItems`.

Find the asset path first, then use it to read the details. Paged responses show the total, the current offset, whether there is more to read, and `NextOffset` when applicable. If you have not found the object yet, use the next offset to continue.

## Open, save, and close sequences

| Group | Tools | Purpose |
|---|---|---|
| Lifecycle | `OpenAsset`, `SaveAsset`, `CloseAsset` | Open, save one asset, and verify close results |

Mutation and save tools accept only valid `/Game/...` Level Sequence paths. Read-only discovery, inspection, opening, capture, and closing may access other readable sequence locations. Editing tools reject PIE/save/GC busy states and read-only MovieScenes, and use editor transactions for Undo.

Edits stay in the editor until saved. To keep them, call `SaveAsset` before closing. It saves only the specified Level Sequence. `CloseAsset` checks whether the editors for the asset and its subobjects have closed. If an editor refuses to close, the tool reports a failure.
