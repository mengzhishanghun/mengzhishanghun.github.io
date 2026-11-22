---
title: Create and Modify Blueprint Functions
type: doc
slug: mcp-blueprint-members-and-types
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-blueprint
documentKind: product-manual
websiteRoute: /en/works/mcp-blueprint/docs/members-and-types/
lang: en
translationKey: doc:mcp-blueprint:members-and-types
sourceHash: 1e5d38a58408cfaa091687bb439675f743dec77e4f9cc0243f56efa3211fc8c2
translationStatus: translated
generatedBodyHash: 63358a1f0788dfb210493df938710cd0b42c3d118d21ff631c913ff7613c072a
docPage:
  work: mcp-blueprint
  group: members-types
  slug: members-and-types
  order: 2
---

## Create, rename, or remove functions

| Tool | Purpose | Notes |
| --- | --- | --- |
| `ListBlueprintMembers` | Lists functions, events, dispatchers, and local variables by page. | Use pagination for large Blueprints. |
| `CreateFunction` | Creates a Blueprint function and its parameters. | Requires a Blueprint path, function name, and parameter definitions. |
| `RenameFunction` | Renames a user function and updates references that can be updated safely. | Start with dry-run; reference updates require explicit approval. |
| `RemoveFunction` | Removes a user function. | References or an inability to recover safely block removal. |

Function renames and signature edits analyze impact first. The tool rejects the edit if it cannot safely update overrides, Delegate bindings, derived classes, or references.

## Edit a function signature

Before calling `ModifyFunctionSignature`, use `GetGraphDetail` to find the function graph and its Entry/Result identifiers. Use these identifiers instead of display names. Choose one operation: `AddInput`, `AddOutput`, `RenamePin`, `RemovePin`, or `ChangePinType`. The default is `bDryRun=true`; reference updates require `bApproveReferenceUpdates=true`. Parameter removal or type changes also require `bAllowPotentialDataLoss=true`. The tool updates call sites that can be handled safely and attempts rollback on failure. It does not save automatically.

Parameters on function Entry and Result nodes belong to the signature. Use `SetPinDefaults` to change an input-pin literal on an ordinary graph node.

![Function signature and connected implementation](/media-occurrence/doc%3Amcp-blueprint%3Amembers-and-types%3Amedia%3A1)

## Example: the renamed function and its caller

These two images show a function definition and its call site after renaming. Use dry-run before renaming and explicitly approve reference updates when required. Use `SaveAsset` to keep the change.

![Renamed function](/media-occurrence/doc%3Amcp-blueprint%3Amembers-and-types%3Amedia%3A2)

![Updated function caller](/media-occurrence/doc%3Amcp-blueprint%3Amembers-and-types%3Amedia%3A3)

MCPBlueprint does not provide a generic tool to invoke an arbitrary Blueprint function and return its runtime result.
