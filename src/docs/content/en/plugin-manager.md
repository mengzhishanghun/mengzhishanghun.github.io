---
title: UEPluginManager User Manual
description: Complete English product manual for UEPluginManager
type: doc
slug: plugin-manager
categoryId: open-source-tools
categoryName: Open Source Tools
categoryOrder: 1
draft: false
sitePublish: true
tags:
  - UnrealEngine
  - Plugins
  - Dependency Analysis
workIds:
  - plugin-manager
documentKind: product-manual
websiteRoute: /docs/zh/tools/plugin-manager/
lang: en
translationKey: plugin-manager
sourceHash: 2974c25464669fec95beb208f966c983f9e35aafe6a19e0020fcee6ce05b5954
translationStatus: translated
generatedBodyHash: 7b1718c54cf908ff4bb0f23f0f446a8104dc6672faac296f85aeb72243eea8a0
---

# UEPluginManager

A UE plugin management tool for managing all plugins in a UE project and its associated engine.

## Features

### Plugin Browsing
- **Automatic scanning** - Scan project, Marketplace, and engine plugins
- **Source tabs** - Plugins are divided into three tabs:
  - **Project** - Plugins under the project's Plugins directory
  - **Marketplace** - Plugins downloaded and installed through Fab
  - **Engine** - Plugins bundled with UE
- **Category management** - Tabs display category counts in real time
- **Engine identification** - Supports installed engines through the registry and source builds through GUIDs
- **Search filtering** - Search by name/author/category/description/dependencies/dependents
  - Case-insensitive
  - Supports space-separated keywords that must all match
- **Sorting** - Click column headers to sort; arrows show direction
- **Dependency analysis** - View plugin dependencies and dependents
- **Conflict detection** - Same-name plugin conflicts display a red “Conflict” status

### Plugin Operations
- **Enable/disable** - Modify .uproject with confirmation for dependency chains
- **Restore defaults** - Remove .uproject overrides to restore the plugin's default state
- **Move plugins** - Move between project and Marketplace locations; engine plugins cannot be moved
- **Delete plugins** - Move to the recycle bin; engine plugins cannot be deleted
- **Directory correction** - Rename garbled folders to match the plugin name

### Shortcuts
- **Open directory** - Open project/engine/plugin directories in one click
- **Close project** - Attempt to close the UE editor
- **Reload** - Refresh the plugin list after external changes

## Usage

1. Download `UEPluginManager.exe` from Release and run it in the UE project directory
2. The tool automatically scans project and engine plugins
3. Locate plugins using the search field and tabs
4. Click a plugin to view details and dependencies
5. Manage plugin state using the buttons on the right

## Notes

- **Before operations**: Close the UE editor before moving, deleting, or correcting plugin directories
- **Read-only files**: The tool automatically removes the read-only attribute for compatibility with version control systems such as Perforce
- **Conflicting plugins**: Delete one of the same-name plugins before enabling or moving the other
