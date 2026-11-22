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
sourceHash: c501036cc44c4a1663a24134ccf0b0f2f4a2cb60e99397a574d7a90645fe77b6
translationStatus: translated
generatedBodyHash: 1361b56d8b1ba86d9497b4884dd16f515f613c1ec9499fd6aecddff9cd386e03
docPage:
  work: mcp-blueprint
  group: members-types
  slug: variables
  order: 1
---

## Read, add, and remove variables

| Tool | Purpose | Notes |
| --- | --- | --- |
| `AddVariable` | Adds a Blueprint member variable. | Requires a Blueprint path, variable name, and `TypeName`. |
| `RemoveVariable` | Removes a member variable. | References or an inability to recover safely block removal. |
| `AddLocalVariable` | Adds a local variable to a function graph. | Requires a function name, variable name, and type. |
| `RemoveLocalVariable` | Removes a function-local variable. | References or an inability to recover safely block removal. |

Local-variable operations require function-graph and variable-declaration identifiers.

## Edit a member variable and its declaration default

Use `GetBlueprintOverview` to find a member variable declared by this Blueprint. Supply only the fields to change: `TypeName`, `DefaultValue`, `NewName`, `bInstanceEditable`, `Category`, or `Tooltip`. `DefaultValue` uses UE text; an empty `Category` restores Unreal's default category, and an empty `Tooltip` removes its metadata. Referenced variables cannot change type, and RepNotify variables cannot be renamed through this tool. Use `SaveAsset` when you want to keep the change.

A declaration default belongs to a member variable declared in the current Blueprint. Use `SetPinDefaults` for a node input literal. `ModifyVariable` does not change overrides on existing level instances.
