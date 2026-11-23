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
sourceHash: 88521a10ac7938ac1c47c28666e68e2b7b9f81743a18cf14884cce2ab8f6cad4
translationStatus: translated
generatedBodyHash: a9f1b351fcdce8f1a161d4ce0d7615376d36e851452bf9f2fc6f41cf791c0267
docPage:
  work: plugin-manager
  group: features
  slug: find
  order: 1
---

## Filter by Source

The tabs separate **Project** plugins in the project’s `Plugins` directory, **Marketplace** plugins installed from Fab, and **Engine** plugins bundled with UE. Each tab shows its current count.

![UEPluginManager engine plugin list](/media-occurrence/doc%3Aplugin-manager%3Afind%3Amedia%3A1)

In the DocsDemo example project, the Engine tab lists installed engine plugins by name, author, category, and status.

## Search, Sort, and Inspect Dependencies

Open the relevant tab and search by name, author, category, description, dependency, or dependent plugin. Search ignores case. If you separate terms with spaces, results must match every term.

Click a column header to sort. The arrow shows the current sort direction. Select a plugin to see its details, what it depends on, and which plugins depend on it. Plugins with the same name show a red **Conflict** status.

![UEPluginManager search and dependencies for EnhancedInput](/media-occurrence/doc%3Aplugin-manager%3Afind%3Amedia%3A2)

Search for EnhancedInput and select it to see its description, dependencies, and dependent plugins on the right. This example reads plugin information from a local UE 5.7 installation.
