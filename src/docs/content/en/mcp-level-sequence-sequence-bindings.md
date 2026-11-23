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
sourceHash: 56dbd574bd294b9ddd4b334115a40be517cb36666f5d7d201bda76f40fd4b553
translationStatus: translated
generatedBodyHash: 5a190bf5632d2beb16bb5128c8e34eb971090bc5834ca8ee888538cfa60f3084
docPage:
  work: mcp-level-sequence
  group: features
  slug: sequence-bindings
  order: 3
---

## Object bindings and camera cuts

| Group | Tools | Purpose |
|---|---|---|
| Binding | `ListBindings`, `AddBinding`, `RemoveBinding` | Page, add, and cascade-remove object bindings |
| Camera | `AddCameraCut`, `SetCameraCut` | Create and modify camera cuts |

- `ListBindings`: 100 by default, capped at 500 and sorted consistently by BindingId.

Before changing a cut, find the camera’s `BindingId` with `ListBindings`, then use `GetSequenceDetail` to find the section. Use `SetCameraCut` to edit an existing section or `AddCameraCut` to create one.

Mutation and save tools accept only valid `/Game/...` Level Sequence paths. Read-only discovery, inspection, opening, capture, and closing may access other readable sequence locations. Editing tools reject PIE/save/GC busy states and read-only MovieScenes, and use editor transactions for Undo.

Binding and track removal cascade through owned objects. Binding removal also removes local Camera Cut sections that reference the subtree in the same transaction. Destructive operations are rejected for invalid, locked, read-only, or unresolved non-local Camera Cut sequence references. Name selectors report ambiguity instead of choosing the first match. Prefer `BindingId` from `ListBindings` and `TrackName` from `GetSequenceDetail`.

The plugin does not currently create Spawnables.

Camera Cut frames use the sequence’s `TickResolution`; see [Time Units and Frame Rates](/en/works/mcp-level-sequence/docs/sequence-timing/).
