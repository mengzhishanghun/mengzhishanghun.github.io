---
title: Create Blackboards and Manage Keys
type: doc
slug: mcp-behavior-tree-blackboard-keys
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-behavior-tree
documentKind: product-manual
websiteRoute: /en/works/mcp-behavior-tree/docs/blackboard-keys/
lang: en
translationKey: doc:mcp-behavior-tree:blackboard-keys
sourceHash: 4864b4002e2662cbf5b302eba8f4888345727a2ace7fc2233b113d98a29176c7
translationStatus: translated
generatedBodyHash: c3eeff1ae22b26a286aecbe51626c2eeed05143e031d0b57edbf2b62f9b9e56e
docPage:
  work: mcp-behavior-tree
  group: features
  slug: blackboard-keys
  order: 2
---

## Create and link a Blackboard

Create a Blackboard with `CreateBlackboard`. Pass its path when creating the tree, or use `SetBehaviorTreeBlackboard` to link it to an existing tree.

## Blackboard key rules

Supported key types are `Bool`, `Int`, `Float`, `Vector`, `Rotator`, `Name`, `String`, `Object`, `Class`, and `Enum`.

- `Object` and `Class` keys may specify `BaseClass`.
- `Enum` keys require `Enum`; `BaseClass` and `Enum` are rejected for unrelated key types.
- `KeyName` cannot be empty or `None`.
- A key selector is checked with Unreal's native filter semantics, including Object/Class base-class restrictions and Enum identity. A same-named key of the wrong type is invalid.
- `RemoveBlackboardKey` scans the project’s Behavior Trees. If it finds a reference or cannot finish scanning, it refuses to delete the key unless you explicitly accept the risk with `bForce=true`. For routine cleanup, update the nodes that use the key before trying to remove it.

| Area | Tools |
|---|---|
| Blackboard | `AddBlackboardKey`, `RemoveBlackboardKey` |

If you changed a key that a tree uses, validate the associated tree first, then call `SaveAsset` for the Blackboard. See [behavior tree validation and saving](/en/works/mcp-behavior-tree/docs/edit-tree/).
