---
title: Manage Plugin Folders
type: doc
slug: plugin-manager-folder-actions
draft: false
sitePublish: true
tags:
  - UnrealEngine
  - Plugins
  - Dependency Analysis
workIds:
  - plugin-manager
documentKind: product-manual
websiteRoute: /en/works/plugin-manager/docs/folder-actions/
lang: en
translationKey: doc:plugin-manager:folder-actions
sourceHash: d33b98490d07776030f672cc671f5a5fac4bf53508a6cf2fdc5f8da7cd11c992
translationStatus: translated
generatedBodyHash: 48bf2d9cb2b61ee19a125460234df6e03373824491998ca3ad72d5a267c0b505
docPage:
  work: plugin-manager
  group: features
  slug: folder-actions
  order: 3
---

## Move, Delete, or Rename Plugin Folders

Close the UE editor first, then select the plugin in the Project or Marketplace tab.

- Move: Move the plugin between the project and Marketplace directories. If two plugins share a name, remove one first.
- Delete: Send the plugin to the Recycle Bin.
- Correct the folder name: Rename a garbled folder to match the plugin name.

Engine plugins cannot be moved or deleted. The tool removes read-only attributes so it can handle files in Perforce and similar version control environments.

## Folder and List Shortcuts

- **Open directory** - Open project/engine/plugin directories in one click
- **Close project** - Attempt to close the UE editor
- **Reload** - Refresh the plugin list after external changes
