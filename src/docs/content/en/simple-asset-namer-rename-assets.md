---
title: Rename Assets Automatically or in Batches
type: doc
slug: simple-asset-namer-rename-assets
draft: false
sitePublish: true
tags:
  - Asset Management
  - Naming Conventions
workIds:
  - simple-asset-namer
documentKind: product-manual
websiteRoute: /en/works/simple-asset-namer/docs/rename-assets/
lang: en
translationKey: doc:simple-asset-namer:rename-assets
sourceHash: 7f74bc6f9c2d78f4178eab5eda603a5613217d31a6b42da8c6773a09c274e9d6
translationStatus: translated
generatedBodyHash: 793a2fe71cb4b56c28c68b2f60724a64a13f442a318ed6703eeb815edfff1359
docPage:
  work: simple-asset-namer
  group: naming
  slug: rename-assets
  order: 2
---

## Apply Rules When Creating or Renaming Assets

`Auto Rename on Create` (`bAutoRenameOnCreate`) runs on creation or import; `Auto Rename on Rename` (`bAutoRenameOnRename`) rechecks the name after a manual rename. Configure them independently. Type rules and path filters still apply.

## Batch Rename from the Context Menu

All context-menu entries are grouped under the **Simple Asset Namer** submenu.

**Asset context menu**

1. Select one or more assets
2. Right-click → **Simple Asset Namer** → **Auto Rename**

**Folder context menu**

1. Right-click a folder
2. **Simple Asset Namer** → **Auto Rename All Assets**

Before a batch, check the path scope and keep a recoverable version. The plugin processes fewer than 100 assets individually. At 100 or more, it runs ten batches, retries failed batches together once, and retries remaining failures individually with detailed errors.

## Review Results and Troubleshoot Failures

After completion, a results window appears with three tabs:

- **Success**: Assets successfully renamed
- **Errors**: Failed assets and reasons
- **Skipped**: Skipped assets and reasons

**Common errors**:
| Error message | Description |
|---------|------|
| Source control not connected | Version control is disconnected |
| Checked out by another user | File checked out by another user |
| File is read-only | File is read-only |
| Target file already exists | Destination file already exists |
| Asset has unsaved changes | Asset contains unsaved changes |

Success records show the old and new names. For skips, check the name, type rule, path filter, or whether a read-only file can be checked out. Check for a collision if the target exists. If many files report unknown errors, right-click the folder in the Content Browser, choose **Fix Up Redirectors in Folder**, and try again. Renaming uses the UE API to update references and create redirectors. Check references after a batch and use Ctrl+Z to undo if needed.
