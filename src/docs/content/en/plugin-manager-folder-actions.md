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
sourceHash: 062d2f5e5f5568226d48036faf7da7a961b1ec0753055095b8c2e482cb7fbdb7
translationStatus: translated
generatedBodyHash: 2a538c7872ecf39ed9904c1cbafaa88318935272d6cc8a69e4a1481074eb3535
docPage:
  work: plugin-manager
  group: plugins
  slug: folder-actions
  order: 3
---

## Move, Delete, or Rename Plugin Folders

Close the UE editor before changing plugin folders. Project and Marketplace plugins can move between those locations. Engine plugins cannot be moved or deleted. Deleting sends the plugin to the recycle bin, and directory correction renames a garbled folder to match the plugin. The tool removes the read-only attribute for environments using Perforce or similar version control. Resolve any same-name conflict before moving the remaining plugin.

## Folder and List Shortcuts

- **Open directory** - Open project/engine/plugin directories in one click
- **Close project** - Attempt to close the UE editor
- **Reload** - Refresh the plugin list after external changes
