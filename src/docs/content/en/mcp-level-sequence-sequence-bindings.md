---
title: Edit Object Bindings and Camera Cuts
type: doc
slug: mcp-level-sequence-sequence-bindings
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-level-sequence
documentKind: product-manual
websiteRoute: /en/works/mcp-level-sequence/docs/sequence-bindings/
lang: en
translationKey: doc:mcp-level-sequence:sequence-bindings
sourceHash: 69894cc3760bd939c5a6ed342132bb45aa538a92bd2a358df9d002a2d9349993
translationStatus: translated
generatedBodyHash: ce825be303ca6c2371ea724907b83afab89e55dab3a740fa561f295863daf654
docPage:
  work: mcp-level-sequence
  group: sequence-editing
  slug: sequence-bindings
  order: 1
---

## Object bindings and camera cuts

| Group | Tools | Purpose |
|---|---|---|
| Binding | `ListBindings`, `AddBinding`, `RemoveBinding` | Page, add, and cascade-remove object bindings |
| Camera | `AddCameraCut`, `SetCameraCut` | Create and modify camera cuts |

- `ListBindings`: 100 by default, capped at 500 and stably sorted by BindingId.

Mutation and save tools accept only valid `/Game/...` Level Sequence paths. Read-only discovery, inspection, opening, capture, and closing may access other readable sequence locations. Editing tools reject PIE/save/GC busy states and read-only MovieScenes, and use editor transactions for Undo.

Binding and track removal cascade through owned objects. Binding removal also removes local Camera Cut sections that reference the subtree in the same transaction. Destructive operations are rejected for invalid, locked, read-only, or unresolved non-local Camera Cut sequence references. Name selectors report ambiguity instead of choosing the first match. Prefer `BindingId` from `ListBindings` and `TrackName` from `GetSequenceDetail`.

Spawnable creation has version-sensitive template ownership, Undo, and spawner paths and needs dedicated runtime validation before exposure.

Camera Cut frames use the sequence’s `TickResolution`; see [Time Units and Frame Rates](/en/works/mcp-level-sequence/docs/sequence-timing/).
