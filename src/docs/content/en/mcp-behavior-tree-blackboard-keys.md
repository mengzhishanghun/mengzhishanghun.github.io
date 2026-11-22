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
sourceHash: dd349f241593e2b1dd7c83d7a4d778589a9a58cd9a02ea64771eb4344cdeaf16
translationStatus: translated
generatedBodyHash: 3155ca12491a206b95eb1f1d6c332f440f2fff8707e728e89a09bfe162d549cb
docPage:
  work: mcp-behavior-tree
  group: editing
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
- `RemoveBlackboardKey` scans project Behavior Trees and refuses unresolved references or scan failures unless `bForce=true` explicitly accepts the risk.

| Area | Tools |
|---|---|
| Blackboard | `AddBlackboardKey`, `RemoveBlackboardKey` |

Call `SaveAsset` for the Blackboard after reviewing the changes. See [behavior tree validation and saving](/en/works/mcp-behavior-tree/docs/edit-tree/).
