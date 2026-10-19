---
title: SimpleAssetCleaner
description: Identify candidate unreferenced assets from roots and references, with submission-time handling and full cleanup actions.
type: work
slug: simple-asset-cleaner
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
order: 7
status: Official documentation
featured: false
draft: false
sitePublish: false
tags:
  - Asset management
  - Reference analysis
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19183435
links:
  - label: Original article on CNBlogs
    href: https://www.cnblogs.com/mengzhishanghun/p/19183435
docIds:
  - simple-asset-cleaner-guide
sourceDate: 2025-11-01
lang: en
translationKey: simple-asset-cleaner
sourceHash: f24aaace633f8e3a08491a55f8aaf747d9bf7fa539cb08ed2e42c3155eed298f
translationStatus: translated
generatedBodyHash: 172ad9c7cfd988d7c9e4da413c771e960cd15a471d4e309bf5f51e5b779f5a9c
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/listings/b0cf0a4d-c1a2-45f6-8bfb-7a92313379c2
    - kind: docs
      href: /docs/zh/guides/ue-tools/simple-asset-cleaner-guide/
  compatibility:
    - platforms:
        - Windows (Win64)
        - macOS
        - Linux
      requirements:
        - UE 5.2–5.8
---
## Overview

SimpleAssetCleaner checks candidate unreferenced assets in Unreal Engine projects through reference relationships. It traces direct and indirect references from configured root assets, handles candidate files during submission, and provides cleanup for the whole version-controlled project.

Results depend on root and protected path settings, so it should be used alongside project asset management rules.

## Background and goals

Production leaves test materials, Blueprints, and other resources temporarily unreferenced by scenes. File names and directories alone cannot easily show whether core content still depends on them indirectly.

The tool starts from resources the project considers important to form an inspectable reference scope. Teams can review candidates before submission or consolidated cleanup while configuring special resources separately.

## Core capabilities

### Configuring analysis roots

The tool traces reference chains from project-defined root assets and protected directories, then lists assets outside that coverage as candidates. Configure the retention scope to match actual project usage.

### Handling candidates during submission

With automatic cleanup enabled, the plugin checks newly added version-controlled assets during submission. New files considered unreferenced are reverted from the submission list while local files remain, allowing developers to inspect them before deciding what to keep.

This action targets routine submissions and does not delete all historical files from disk.

### Full cleanup and logs

Full cleanup scans version-controlled assets, with results available in logs. Unlike submission-time reverts, it may delete committed unreferenced resources from both version control and local storage.

Detailed logs help review processing and candidate scope during initial configuration.

## Use cases

It suits teams managing UE asset accumulation, checking test resources during routine submissions, or reviewing historical resources during maintenance.

With many asset directories or indirect references, defining roots and protected paths first helps avoid decisions based only on directory names.

## Scope and limitations

Reference analysis assumes configured roots. Assets outside roots or protected paths that business logic still uses in special workflows must be identified and added by the project.

Full cleanup may delete committed files. Review logs and results on a recoverable version before applying it to a production project.

For operation steps and parameter details, see the [user guide](/en/docs/guides/ue-tools/simple-asset-cleaner-guide/).
