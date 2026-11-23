---
title: Create, Compile, and Manage Blueprint Assets
type: doc
slug: mcp-blueprint-asset-lifecycle
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-blueprint
documentKind: product-manual
websiteRoute: /en/works/mcp-blueprint/docs/asset-lifecycle/
lang: en
translationKey: doc:mcp-blueprint:asset-lifecycle
sourceHash: 6fd65f07efa7b7cdf42433da92f0da0fa9074e4d8320600201b3788b1fa1c1a7
translationStatus: translated
generatedBodyHash: 20ec160aa8c567b182c4126323625358589ed0389fedac35b7b65fd9166c28ae
docPage:
  work: mcp-blueprint
  group: features
  slug: asset-lifecycle
  order: 1
---

## Create, duplicate, and save assets

| Tool | Purpose | Notes |
| --- | --- | --- |
| `ListBlueprints` | Finds project Blueprint assets with pagination. | Use `PathFilter` and pagination to narrow large projects. |
| `GetBlueprintOverview` | Shows the Blueprint parent, graphs, variables, components, and interfaces. | Provide an exact `BlueprintPath`. |
| `CreateBlueprint` | Creates a supported Blueprint asset. | Supply the asset path and parent class; creation does not save automatically. |
| `DuplicateAsset` | Duplicates an asset. | Specify source and destination paths. |
| `RenameAsset` | Renames or moves an asset. | Specify source and destination paths. |
| `SaveAsset` | Explicitly saves the asset's current changes to disk. | Ordinary edits do not save automatically. |
| `OpenAsset` | Opens a Blueprint in the editor. | Required before capturing its graph. |
| `CloseAsset` | Closes the asset editor. | Save changes you want to keep before closing. |

In a large project, narrow the search to a folder and continue through the pages if needed. Use an asset path from the results in later calls. Ordinary edits do not write to disk; call `SaveAsset` to keep them.

## Compile and read diagnostics

| Tool | Purpose | Notes |
| --- | --- | --- |
| `GetCompileErrors` | Retrieves current Blueprint compilation diagnostics. | Use it to handle errors or warnings reported by the editor. |
| `CompileBlueprint` | Compiles the selected Blueprint and returns diagnostics. | Use it to handle errors or warnings reported by the editor. |

Use `GetCompileErrors` to read existing compiler messages. Use `CompileBlueprint` to compile the current changes. Address any reported problems before saving the version you want to keep.

## Reload from disk or delete assets

| Tool | Purpose | Notes |
| --- | --- | --- |
| `ReloadBlueprintFromDisk` | Replaces the in-memory Blueprint with its disk version. | Defaults to dry-run; discarding unsaved changes requires explicit approval. |
| `DeleteAsset` | Deletes an asset. | Deletion has stricter reference and recovery-safety checks. |

- To discard unsaved changes, preview the reload first. Explicitly approve it only after deciding that the in-memory changes can be lost.
- Destructive deletion has stricter Undo/Redo and Package safety requirements than ordinary graph edits.
