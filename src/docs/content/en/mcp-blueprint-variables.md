---
title: Manage Member and Local Variables
type: doc
slug: mcp-blueprint-variables
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-blueprint
documentKind: product-manual
websiteRoute: /en/works/mcp-blueprint/docs/variables/
lang: en
translationKey: doc:mcp-blueprint:variables
sourceHash: 73b77b8f7177ee28a31c0c6872a64a3e9648cdeb744c782bf5d60922a52ae624
translationStatus: translated
generatedBodyHash: 3a9af0d49b3b5a3b2b45bfc690062956c41e02a9030beb7ae81bbcc79def0562
docPage:
  work: mcp-blueprint
  group: features
  slug: variables
  order: 4
---

## Read, add, and remove variables

| Tool | Purpose | Notes |
| --- | --- | --- |
| `AddVariable` | Adds a Blueprint member variable. | Requires a Blueprint path, variable name, and `TypeName`. |
| `RemoveVariable` | Removes a member variable. | References or an inability to recover safely block removal. |
| `AddLocalVariable` | Adds a local variable to a function graph. | Requires a function name, variable name, and type. |
| `RemoveLocalVariable` | Removes a function-local variable. | References or an inability to recover safely block removal. |

Decide whether the variable belongs to the Blueprint or to a single function. Local-variable edits require the function-graph and variable-declaration identifiers. Find existing locals with `ListBlueprintMembers`.

## Edit a member variable and its declaration default

Use `GetBlueprintOverview` to find a member variable declared by this Blueprint. Supply only the fields to change: `TypeName`, `DefaultValue`, `NewName`, `bInstanceEditable`, `Category`, or `Tooltip`. For example, if you only want to change the category, make `Category` the only field you change. `DefaultValue` uses UE text; an empty `Category` restores Unreal's default category, and an empty `Tooltip` removes its metadata. Referenced variables cannot change type, and RepNotify variables cannot be renamed through this tool. Use `SaveAsset` when you want to keep the change.

A declaration default belongs to a member variable declared in the current Blueprint. Use `SetPinDefaults` for a node input literal. `ModifyVariable` does not change overrides on existing level instances.
