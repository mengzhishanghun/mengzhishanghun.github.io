---
title: Inspect, Edit, and Validate Behavior Trees
type: doc
slug: mcp-behavior-tree-edit-tree
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-behavior-tree
documentKind: product-manual
websiteRoute: /en/works/mcp-behavior-tree/docs/edit-tree/
lang: en
translationKey: doc:mcp-behavior-tree:edit-tree
sourceHash: 78c1940bc712db0d5758aade297226c0cb2d781a93fedbe7e4572dcf60ea16ec
translationStatus: translated
generatedBodyHash: f0ac78334d892b8cba30ea415aa67529b63c7fa7a2c1a752380f78a339d8169a
docPage:
  work: mcp-behavior-tree
  group: features
  slug: edit-tree
  order: 1
---

## Create and inspect a behavior tree

To create a tree, call `CreateBehaviorTree` with the Blackboard path. To edit an existing tree, find it with `ListBehaviorTrees`, then use its details to locate the node.

`GetBehaviorTreeDetail` returns stable `NodeId` values for editing calls, the linked Blackboard and its keys, nested tree structure, decorators, services, reflected editable properties, and floating nodes. Large results are bounded by depth, node, property, and text limits and report `bTruncated` when incomplete. `ListBehaviorTrees` supports deterministic sorting, filtering, and `Offset`/`MaxResults` paging.

## Edit tree structure and nodes

| Area | Tools |
|---|---|
| Tree structure | `AddCompositeNode`, `AddTaskNode`, `ConnectNodes`, `RemoveNode` |
| Nodes | `SetNodeProperties`, `AddDecorator`, `AddService` |

Before moving or editing an existing node, get its `NodeId` from the tree details. Edits use Unreal transactions and stay in memory until saved. Node properties use Unreal import-text strings; for example, booleans use `true`/`false`, enums use their names, and vectors use `(X=0.0,Y=0.0,Z=0.0)`. Property maps accept string values only, and a failed import leaves the property's previous value unchanged. Blackboard selector properties take a Blackboard key name and are validated against the selector's native type filters.

Blueprint task, decorator, and service logic is not authored here. Create and compile those Blueprint classes with a Blueprint-capable tool, then pass the generated `_C` class path.

## Validate, save, and repair

Run `ValidateBehaviorTree` and fix any reported problems before saving.

`SimpleParallel` has `Default` and `Background` output pins. Use `ParentOutputPin="Background"` when adding or moving the background subtree. Validation reports structural errors, missing classes, invalid key bindings, invalid decorator abort modes, and unconnected nodes.

Asset arguments use Unreal content paths such as `/Game/AI/BT_Enemy` and `/Game/AI/BB_Enemy`. Newly created or edited assets remain dirty until `SaveAsset` succeeds.

`SaveAsset`, `OpenAsset`, and `CloseAsset` only accept Behavior Tree or Blackboard assets. Saving fails closed when the editor graph cannot be synchronized or Unreal cannot write the package; a successful MCP result therefore means the package save succeeded.

A Behavior Tree that has runtime nodes but no editor graph is rejected instead of being rebuilt as an empty graph. Repair that asset in the Behavior Tree editor before using MCP editing or save tools.
