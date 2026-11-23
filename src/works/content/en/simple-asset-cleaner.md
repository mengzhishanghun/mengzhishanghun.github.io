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
  - Simple series
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19183435
links:
  - label: Original article on CNBlogs
    href: https://www.cnblogs.com/mengzhishanghun/p/19183435
docIds:
  - simple-asset-cleaner-setup
  - simple-asset-cleaner-clean-assets
  - simple-asset-cleaner-protect-assets
  - simple-asset-cleaner-add-dependencies
sourceDate: 2025-11-01
lang: en
translationKey: simple-asset-cleaner
sourceHash: 8320222bed96d1b69f50d61f2f84fba5672bb9a2e717021737cc3d5ebca73d36
translationStatus: translated
generatedBodyHash: fab8fb7dd48d2d45ce68c660a166f3cf6c6658c59d65855bb02dbf1aaff35e03
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/listings/b0cf0a4d-c1a2-45f6-8bfb-7a92313379c2
    - kind: docs
      href: /en/works/simple-asset-cleaner/docs/setup/
websiteCoverUrl: /media/covers/works/simple-asset-cleaner-20261101.webp
coverAlt: SimpleAssetCleaner cover
---

## Overview

SimpleAssetCleaner follows direct and indirect references from selected root assets to find potentially unused assets in an Unreal Engine project. You can handle newly added candidates at submission time or scan the entire version-controlled project.

Results depend on root and protected path settings, so it should be used alongside project asset management rules.

## Background and goals

Production leaves test materials, Blueprints, and other resources temporarily unreferenced by scenes. File names and directories alone cannot easily show whether core content still depends on them indirectly.

The tool starts from resources the project considers important to form an inspectable reference scope. Teams can review candidates before submission or consolidated cleanup while configuring special resources separately.

## Core capabilities

### Configuring analysis roots

The tool traces reference chains from project-defined root assets and protected directories, then lists assets outside that coverage as candidates. Configure the retention scope to match actual project usage.

Maps (`UWorld`) are the default roots. Add asset types in `Root Asset Classes`, name individual assets in `Custom Root Assets`, or protect whole folders in `Additional Root Paths`. The cleaner preserves project assets reachable through direct or indirect references from the roots.

### Handling candidates during submission

With automatic cleanup enabled, the plugin checks newly added version-controlled assets during submission. New files considered unreferenced are reverted from the submission list while local files remain, allowing developers to inspect them before deciding what to keep.

This action targets routine submissions and does not delete all historical files from disk.

### Full cleanup and logs

Full cleanup scans version-controlled assets, with results available in logs. Unlike submission-time reverts, it may delete committed unreferenced resources from both version control and local storage.

Detailed logs help review processing and candidate scope during initial configuration.

To check a smaller set, right-click selected assets or folders in the Content Browser and review the candidates in the dialog. Like full cleanup, this action can delete tracked unreferenced assets. It reverts newly added assets and keeps their local copies.

## Use cases

It suits teams managing UE asset accumulation, checking test resources during routine submissions, or reviewing historical resources during maintenance.

With many asset directories or indirect references, defining roots and protected paths first helps avoid decisions based only on directory names.

## Workflow

1. Enable the plugin and restart the editor. In source control settings, select the provider your project uses. The plugin wraps it automatically; leave entries ending in `_Proxy` unselected.
2. Check the root assets and protected folders. For example, if a map references a material and the material references a texture, the cleaner keeps both. Cleanup is limited to assets in the project’s `/Content/` (`/Game/`). Plugin assets, engine assets, and C++ files are outside its scope.
3. Try it on a test branch first and turn on `Enable Verbose Logging` to inspect candidates and reference chains. During submission, you can also review untracked dependencies and confirm which files to add. This is separate from cleaning up unreferenced assets.

![](/media-occurrence/work%3Asimple-asset-cleaner%3Amedia%3A1)

[See how to check dependencies](/en/works/simple-asset-cleaner/docs/add-dependencies/)

## Scope and limitations

Reference analysis assumes configured roots. Assets outside roots or protected paths that business logic still uses in special workflows must be identified and added by the project.

Full cleanup may delete committed files. Review logs and results on a recoverable version before applying it to a production project.

For operation steps and parameter details, see the [user guide](/en/works/simple-asset-cleaner/docs/setup/).

## Compatibility and Support

Supports Unreal Engine 5.2–5.8. The plugin has been tested on Windows; support for other platforms is theoretical. When reporting an issue, include the engine version, source control system, a screenshot of the settings, and output with verbose logging enabled.

For usage questions or collaboration inquiries, visit the contact page.

- **Contact:** [Contact and Collaboration](https://mzsh.me/contact/)
