---
title: Find Plugins and Dependencies
type: doc
slug: plugin-manager-find
draft: false
sitePublish: true
tags:
  - UnrealEngine
  - Plugins
  - Dependency Analysis
workIds:
  - plugin-manager
documentKind: product-manual
websiteRoute: /en/works/plugin-manager/docs/find/
lang: en
translationKey: doc:plugin-manager:find
sourceHash: ff732205fea5ba43288682d72314cbbef1566454c7356c781cef707de6103b1c
translationStatus: translated
generatedBodyHash: edbadb70436fccc7657be18b125844e48fc7f988c5605568d5eb668b7f306fb3
docPage:
  work: plugin-manager
  group: workflows
  slug: find
  order: 1
---

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

## Usage

1. Download `UEPluginManager.exe` from Release and run it in the UE project directory
2. The tool automatically scans project and engine plugins
3. Locate plugins using the search field and tabs
4. Click a plugin to view details and dependencies
5. Manage plugin state using the buttons on the right
