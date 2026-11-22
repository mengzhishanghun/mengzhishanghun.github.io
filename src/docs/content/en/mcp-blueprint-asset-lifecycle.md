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
sourceHash: e462438ae246416e88520596ff317c48f806026003ecd7d1db7faf2bef1622e8
translationStatus: translated
generatedBodyHash: bc061888315f94345f6c6c7e9afad5117664ab9bce61599db7ee560eaf6812a0
docPage:
  work: mcp-blueprint
  group: assets-graphs
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

Large asset lists support bounded pagination. Use the asset paths returned by the tools. Ordinary edits mark an asset dirty; `SaveAsset` writes those changes to disk.

## Compile and read diagnostics

| Tool | Purpose | Notes |
| --- | --- | --- |
| `GetCompileErrors` | Retrieves current Blueprint compilation diagnostics. | Use it to handle errors or warnings reported by the editor. |
| `CompileBlueprint` | Compiles the selected Blueprint and returns diagnostics. | Use it to handle errors or warnings reported by the editor. |

obtain compiler diagnostics and fix the reported Blueprint errors before saving.

## Reload from disk or delete assets

| Tool | Purpose | Notes |
| --- | --- | --- |
| `ReloadBlueprintFromDisk` | Replaces the in-memory Blueprint with its disk version. | Defaults to dry-run; discarding unsaved changes requires explicit approval. |
| `DeleteAsset` | Deletes an asset. | Deletion has stricter reference and recovery-safety checks. |

- Reloading from disk defaults to dry-run and requires explicit approval before discarding in-memory state.
- Destructive deletion has stricter Undo/Redo and Package safety requirements than ordinary graph edits.
