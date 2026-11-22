---
title: Group and Attach Actors
type: doc
slug: mcp-world-editor-actor-hierarchy
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
documentKind: product-manual
websiteRoute: /en/works/mcp-world-editor/docs/actor-hierarchy/
lang: en
translationKey: doc:mcp-world-editor:actor-hierarchy
sourceHash: 3f048fd07a289f4019ee91ffc8927811d02ce7d99391f4f2b343f50b17c64033
translationStatus: translated
generatedBodyHash: 4f78cc59dd70f2deede56dbd7ade9eb15c73b7d342e52114ba35f370589a9ac6
docPage:
  work: mcp-world-editor
  group: actors
  slug: actor-hierarchy
  order: 5
---

## Actor grouping

`GroupActors` resolves and validates the complete actor list before making changes, rejects duplicate or cross-level grouping targets, and calls Unreal Engine's actor-array grouping APIs directly. It does not clear or replace the editor selection to drive the operation, so selections of surviving actors are preserved. If an explicitly selected GroupActor is disbanded and destroyed, that removed object naturally disappears from the selection.

## Actor attachment transactions

`AttachActor` and `DetachActor` include both actors and the scene components that actually change hierarchy in the editor transaction, so Undo/Redo restores the component hierarchy, socket, and transform. If the engine rejects an operation or the resulting parent state does not match the request, the tool attempts to restore the original parent component, socket, and transform before returning an error. `Original attachment restored` reports whether that restoration was verified; when it is `false`, treat editor state as potentially changed and inspect it before continuing.
