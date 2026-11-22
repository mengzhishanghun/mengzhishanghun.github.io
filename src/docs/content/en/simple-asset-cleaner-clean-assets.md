---
title: Clean Unreferenced Assets on Submission
type: doc
slug: simple-asset-cleaner-clean-assets
draft: false
sitePublish: true
tags:
  - Asset Management
  - Reference Analysis
workIds:
  - simple-asset-cleaner
documentKind: product-manual
websiteRoute: /en/works/simple-asset-cleaner/docs/clean-assets/
lang: en
translationKey: doc:simple-asset-cleaner:clean-assets
sourceHash: 7899444f18825a6e301c1ef03b300a7a60e7ef1595667f342b7d6d2155d7a313
translationStatus: translated
generatedBodyHash: d71cc4df651bd24f0986378d9091743a06ae48cfdcfdd57f31cb4020d6bdb878
docPage:
  work: simple-asset-cleaner
  group: cleanup
  slug: clean-assets
  order: 1
---

## Identify Unreferenced Assets

The plugin analyzes only the project’s `/Content/` (`/Game/`). It does not process plugin assets such as `/PluginName/Content/`, engine assets, C++ source or header files, or references outside `/Content/`. Maps, Blueprints, and data assets can act as roots. Roots and their direct and indirect references are kept. Only assets unreachable from every root are cleanup candidates.

## Automatic Cleanup on Submission

`Enable Auto Clean` is on by default. After creating assets and choosing **Add to Source Control**, open the submission dialog. The plugin checks newly added files and reverts unreferenced ones, leaving local copies intact. Tracked files are unaffected.

For example, if a scene references only two of ten test materials, the other eight are reverted from the pending submission and remain available locally.

## Clean Selected Assets from the Context Menu

In the Content Browser, select one or more assets or folders, then open **Simple Asset Cleaner** from the context menu and choose **Clean Unreferenced Assets**. Review the candidates in the dialog and select the files to clean.

## Compare Automatic and Context Menu Cleanup

| Asset status | Automatic cleanup on submission | Context-menu “Clean Unreferenced Assets” |
|---------|--------------|-------------------|
| Newly added | Revert, **retain local copy** | Revert, **retain local copy** |
| Tracked | No action | **Delete (server + local)** |
