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
sourceHash: 724c327b7e2d3cfb33d9df740a276ec7399c6eb6c151a6fe0d67c69ef0c97234
translationStatus: translated
generatedBodyHash: fc738e8b65c3035cba1238ec5180bc488ee0821004f85738ba6b818ed9d3a80b
docPage:
  work: simple-asset-namer
  group: features
  slug: rename-assets
  order: 2
---

## Apply Rules When Creating or Renaming Assets

`Auto Rename on Create` (`bAutoRenameOnCreate`) runs on creation or import; `Auto Rename on Rename` (`bAutoRenameOnRename`) rechecks the name after a manual rename. Configure them independently. Type rules and path filters still apply.

## Batch Rename from the Context Menu

Try the rules on a small selection first. Check the path scope and keep a recoverable version before running a batch.

All context-menu entries are grouped under the **Simple Asset Namer** submenu.

**Asset context menu**

1. Select one or more assets
2. Right-click → **Simple Asset Namer** → **Auto Rename**

**Folder context menu**

1. Right-click a folder
2. **Simple Asset Namer** → **Auto Rename All Assets**

The plugin processes fewer than 100 assets individually. At 100 or more, it runs ten batches, retries failed batches together once, and retries remaining failures individually with detailed errors.

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

Compare the old and new names for successful renames, then use the skip or error messages to decide what to do with the remaining assets. For skips, check the name, type rule, path filter, or whether a read-only file can be checked out. Check for a collision if the target exists. If many files report unknown errors, right-click the folder in the Content Browser, choose **Fix Up Redirectors in Folder**, and try again. Renaming uses the UE API to update references and create redirectors. Check references after a batch and use Ctrl+Z to undo if needed.
