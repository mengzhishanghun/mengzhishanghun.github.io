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
sourceHash: 4fa2f316608e1d449e057881e80a1df1ddca3d48e8df46484d97df545671a9c2
translationStatus: translated
generatedBodyHash: 0f4d6bea7053de55c503d219011492f8feba3d6184fb9e31a808686d4219ea7e
docPage:
  work: mcp-world-editor
  group: features
  slug: actor-hierarchy
  order: 10
---

## Actor grouping

`GroupActors` resolves and validates the complete actor list before making changes, rejects duplicate or cross-level grouping targets, and passes the list directly to Unreal Engine’s actor-array grouping API. Grouping leaves the selection of surviving actors intact. If a selected GroupActor is destroyed when you disband it, it disappears from the selection.

To group actors in the same level, pass the full list to `GroupActors` in one call. Then check the group and compare the selection with what you had before. Use the attachment operation below when you want one actor attached to another.

## Actor attachment transactions

`AttachActor` and `DetachActor` include both actors and the scene components that actually change hierarchy in the editor transaction, so Undo/Redo restores the component hierarchy, socket, and transform. If the engine rejects an operation or the resulting parent state does not match the request, the tool attempts to restore the original parent component, socket, and transform before returning an error. `Original attachment restored` reports whether that restoration was verified; when it is `false`, treat editor state as potentially changed and inspect it before continuing.

If an error leaves restoration unverified, check the actual parent component, socket, and transform before making another edit.
