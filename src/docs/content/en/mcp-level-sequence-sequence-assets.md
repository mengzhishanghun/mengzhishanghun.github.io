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
sourceHash: 76614c027a3395543e45dd105a165f5136cd2ea176e5fc6eb47713c4e3db9565
translationStatus: translated
generatedBodyHash: 67976cfba35a0ac6b0827f82cab37bb906b975dab448474fd728c99764ef70b5
docPage:
  work: mcp-level-sequence
  group: assets
  slug: sequence-assets
  order: 1
---

## Discovery and pagination

| Group | Tools | Purpose |
|---|---|---|
| Sequence | `ListSequences`, `GetSequenceDetail`, `CreateSequence` | Discover, inspect with pagination, and create sequences |

- `ListSequences`: 100 by default, capped at 500 per page.
- `GetSequenceDetail`: pages a stable combined Binding/Track/Section traversal with `Offset` and `MaxItems`.

Paged responses report totals, the current offset, whether more data exists, and a `NextOffset` when applicable. Clients should continue paging instead of assuming that one response contains the whole asset.

## Open, save, and close sequences

| Group | Tools | Purpose |
|---|---|---|
| Lifecycle | `OpenAsset`, `SaveAsset`, `CloseAsset` | Open, save one asset, and verify close results |

Mutation and save tools accept only valid `/Game/...` Level Sequence paths. Read-only discovery, inspection, opening, capture, and closing may access other readable sequence locations. Editing tools reject PIE/save/GC busy states and read-only MovieScenes, and use editor transactions for Undo.

A successful edit only marks the package dirty; it never saves implicitly. `SaveAsset` saves only the specified Level Sequence package. After requesting a close, `CloseAsset` queries editors for the asset and its subobjects again; if an editor refuses to close, the tool reports failure instead of a false success.
