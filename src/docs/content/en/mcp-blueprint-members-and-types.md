---
title: Edit Blueprint Members, Functions, and Types
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
sourceHash: fc4e8b037a0bfe21c0bc25d66ad455b054d5a221b380caf397bc12c169c988ed
translationStatus: translated
generatedBodyHash: 9f20523ab7be5dafaa3911a70adfcff9d82836641a4179dd1dd4971a2610f01b
docPage:
  work: mcp-blueprint
  group: workflows
  slug: members-and-types
  order: 2
---

### 1. `ModifyVariable`: declaration defaults and node values

Use `GetBlueprintOverview` to find a member variable declared by this Blueprint. Supply only the fields to change: `TypeName`, `DefaultValue`, `NewName`, `bInstanceEditable`, `Category`, or `Tooltip`. `DefaultValue` uses UE text; an empty `Category` restores Unreal's default category, and an empty `Tooltip` removes its metadata. Referenced variables cannot change type, and RepNotify variables cannot be renamed through this tool. Use `SaveAsset` when you want to keep the change.

### 2. `ModifyFunctionSignature`: function parameters and node pins

Use `GetGraphDetail` to find the function graph and required Entry/Result identifiers; do not substitute display names. Choose one operation: `AddInput`, `AddOutput`, `RenamePin`, `RemovePin`, or `ChangePinType`. The default is `bDryRun=true`; reference updates require `bApproveReferenceUpdates=true`. Parameter removal or type changes also require `bAllowPotentialDataLoss=true`. The tool updates call sites that can be handled safely and attempts rollback on failure. It does not save automatically.

## Members, functions, Structs, and Enums

- Variable tools manage types, defaults, Category, Tooltip, and safe removal.
- Function tools create, rename, make supported signature changes, or safely remove user functions.
- Local-variable operations require function-graph and variable-declaration identifiers.
- Struct/Enum edits use field or entry identifiers and report reference impact.
- Operations that may lose data or change the meaning of serialized Enum values require separate explicit approval.

Function renames and signature edits analyze impact first. Unsafe overrides, Delegate bindings, derived classes, or references cause rejection before the edit.

### Function rename example

These two images show a function definition and its call site after renaming. Use dry-run before renaming and explicitly approve reference updates when required. Use `SaveAsset` to keep the change.

![Renamed function](/media-occurrence/doc%3Amcp-blueprint%3Amembers-and-types%3Amedia%3A1)

![Updated function caller](/media-occurrence/doc%3Amcp-blueprint%3Amembers-and-types%3Amedia%3A2)

### Functions, events, and bound events

These examples show a function with input and output parameters, a component-event helper function graph, and common structures for Actor lifecycle events, component-bound events, and variable pin counts.

![Function signature and connected implementation](/media-occurrence/doc%3Amcp-blueprint%3Amembers-and-types%3Amedia%3A3)

![Component-event helper graph](/media-occurrence/doc%3Amcp-blueprint%3Amembers-and-types%3Amedia%3A4)

![Actor lifecycle, bound component event, and variable-pin flow](/media-occurrence/doc%3Amcp-blueprint%3Amembers-and-types%3Amedia%3A5)
