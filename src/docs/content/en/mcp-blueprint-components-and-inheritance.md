---
title: Manage Blueprint Components and Attachments
type: doc
slug: mcp-blueprint-components-and-inheritance
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-blueprint
documentKind: product-manual
websiteRoute: /en/works/mcp-blueprint/docs/components-and-inheritance/
lang: en
translationKey: doc:mcp-blueprint:components-and-inheritance
sourceHash: 8e4cf738174e1202a90bd6325d66c125be72d1226f18f1e2b4e24a74432fdfda
translationStatus: translated
generatedBodyHash: 4d3c28385e9f613af5836f19556362491ccab9c727eefdbc93b5a9c620d075da
docPage:
  work: mcp-blueprint
  group: features
  slug: components-and-inheritance
  order: 10
---

## Read and edit the local component tree

| Tool | Purpose | Notes |
| --- | --- | --- |
| `GetComponents` | Shows an Actor Blueprint's component tree, parents, and template information. | Applies only to Actor Blueprints. |
| `AddComponent` | Adds a local SCS component. | Specify the component class, name, and optional parent component. |
| `RenameComponent` | Renames a local SCS component and updates member references. | The new name must be unique. |
| `RemoveComponent` | Removes a component. | References or an inability to recover safely block removal. |
| `DuplicateComponent` | Duplicates a local component and its template properties. | The actual local scene root cannot be duplicated. |
| `ReparentComponent` | Moves a local SceneComponent below another SceneComponent. | Cannot create cycles; use SetRootComponent for an actual local root. |
| `SetRootComponent` | Makes a local SceneComponent the root. | The target must be a local SceneComponent. |
| `GetComponentProperties` | Reads editable component-template properties by page. | Supply the Blueprint path, component name, and pagination parameters. |

## Edit SCS component-template properties

Find the local SCS `ComponentName` with `GetComponents`, then check editable template properties with `GetComponentProperties`. To make the edit, call `SetComponentProperties`. Supply `Properties` as a map of property names to UE-text values, for example `RelativeLocation: "(X=0,Y=0,Z=50)"` or `bHiddenInGame: "True"`. The tool edits only component templates added by this Blueprint. An invalid property rolls back the whole call and reports the property name with a format hint. Save separately with `SaveAsset` when needed.

This changes a component template added by this Blueprint, such as `StaticMesh` or `RelativeLocation`. Existing Actor instance overrides stay as they are. Use `SetClassDefaults` for defaults on the generated class.

## Change component attachments

`ReparentComponent` changes the attachment tree of local SceneComponents within the same Actor Blueprint. Supply the component name and new `NewParentName`. A component cannot attach to itself or a descendant, and non-SceneComponents cannot be reparented. Use `SetRootComponent` for the actual local root. After editing, check the parent or root in the component tree before saving the changes you want to keep.
