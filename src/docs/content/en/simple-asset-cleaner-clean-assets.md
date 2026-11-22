---
title: Clean Unreferenced Assets
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
sourceHash: 0448ed9477c7fc06625c93d9a87c4564822475f29e200ac074d7a516abaa7c34
translationStatus: translated
generatedBodyHash: 0e69e7d1c576a4b45e6c9f3b1d10022285fc888c2301fba42820ad76bee14004
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

## Scan the Whole Project

Full cleanup is useful for periodic maintenance, taking over a legacy project, or preparing a major release. It deletes committed files that are no longer referenced. Make sure you have a recoverable commit, try it on a test branch, and tell your team beforehand.

1. Open `Editor > Project Settings > General > Simple Asset Cleaner`.
2. Click `Clean All Source Control Assets` and wait for the progress bar to finish.
3. Review the log to see which assets were cleaned up.

## Cleanup Results by File Status

| Asset status | Automatic cleanup on submission | Context menu cleanup of selected assets | Manual full cleanup |
| --- | --- | --- | --- |
| Newly added, unreferenced | Revert and keep the local copy | Revert and keep the local copy | Revert and keep the local copy |
| Tracked, unreferenced | No action | Delete (server and local) | Delete submitted unreferenced assets (server and local) |
| Referenced | Submit normally | Retain | Retain |
| Plugin and engine assets | No action | No action | No action |
