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
sourceHash: 314b716c38c80bb435fcd0264bfd4806d0a5c668c6629876abe1a084cf067003
translationStatus: translated
generatedBodyHash: ba2594a4456194b4213f139119d8744c493dcd092f4380b36ede8feaa6dab4c7
docPage:
  work: mcp-behavior-tree
  group: editing
  slug: edit-tree
  order: 1
---

## Create and inspect a behavior tree

Use `CreateBehaviorTree` to create a tree and specify its Blackboard path. Use `ListBehaviorTrees` to find existing trees page by page.

`GetBehaviorTreeDetail` returns stable `NodeId` values for editing calls, the linked Blackboard and its keys, nested tree structure, decorators, services, reflected editable properties, and floating nodes. Large results are bounded by depth, node, property, and text limits and report `bTruncated` when incomplete. `ListBehaviorTrees` supports deterministic sorting, filtering, and `Offset`/`MaxResults` paging.

## Edit tree structure and nodes

| Area | Tools |
|---|---|
| Tree structure | `AddCompositeNode`, `AddTaskNode`, `ConnectNodes`, `RemoveNode` |
| Nodes | `SetNodeProperties`, `AddDecorator`, `AddService` |

Editing tools use Unreal transactions and mark affected packages dirty. Node properties use Unreal import-text strings; for example, booleans use `true`/`false`, enums use their names, and vectors use `(X=0.0,Y=0.0,Z=0.0)`. Property maps accept string values only, and a failed import leaves the property's previous value unchanged. Blackboard selector properties take a Blackboard key name and are validated against the selector's native type filters.

Blueprint task, decorator, and service logic is not authored here. Create and compile those Blueprint classes with a Blueprint-capable tool, then pass the generated `_C` class path.

## Validate, save, and repair

Run `ValidateBehaviorTree` before saving.

`SimpleParallel` has `Default` and `Background` output pins. Use `ParentOutputPin="Background"` when adding or moving the background subtree. Run validation before saving; validation reports structural errors, missing classes, invalid key bindings, invalid decorator abort modes, and unconnected nodes.

Asset arguments use Unreal content paths such as `/Game/AI/BT_Enemy` and `/Game/AI/BB_Enemy`. Newly created or edited assets remain dirty until `SaveAsset` succeeds.

`SaveAsset`, `OpenAsset`, and `CloseAsset` only accept Behavior Tree or Blackboard assets. Saving fails closed when the editor graph cannot be synchronized or Unreal cannot write the package; a successful MCP result therefore means the package save succeeded.

A Behavior Tree that has runtime nodes but no editor graph is rejected instead of being rebuilt as an empty graph. Repair that asset in the Behavior Tree editor before using MCP editing or save tools.
