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
sourceHash: 12c5c21720c19e1ecf5fcbe79a50f3d550889d769898a7690e34ac4c1839c90b
translationStatus: translated
generatedBodyHash: a3c1996b3b5aa8a1fd427eee87a6f1bd2004bc1ae3eb3d726ebac747cfbdb3e4
docPage:
  work: simple-asset-cleaner
  group: workflows
  slug: clean-assets
  order: 1
---

## Cleanup Scope

### Project Content Only
- **Only** assets in the project's `/Content/` folder (`/Game/` path)

### Untouched Content
- Plugin assets such as `/PluginName/Content/`
- Engine assets
- Code files (C++ headers/source files)
- References outside `/Content/`

---

## How It Works

The plugin uses **reference-chain analysis**:

1. **Root assets** - Always considered “in use,” such as maps, Blueprints, and DataAssets
2. **Reference chains** - Assets directly or indirectly referenced by roots are considered “in use”
3. **Unreferenced assets** - Assets unreachable from every root are cleaned up

### Automatic Cleanup on Submission (Recommended)

- Triggered when opening the version control submission dialog
- Checks only newly added files
- Reverts unreferenced files from version control
- **Local copies are safe** - Files are not deleted from disk

---

## Context Menu

Right-click folders or assets in the Content Browser and choose the **Simple Asset Cleaner** submenu for these features:

### Clean Unreferenced Assets

Scans assets in the selection and displays unreferenced assets with checkboxes. Cleanup runs after the user selects and confirms them.

- Supports selecting one or multiple files or folders
- Newly added files: reverted, with local copies retained
- Tracked files: **deleted from both server and local disk**

#### Enable Auto Clean
- **Default**: Enabled
- **Function**: Check references before submission
- **Behavior**: Revert unreferenced newly added files, preserving local files
- **Recommendation**: Keep enabled for everyday use

## Important Notes

### Operation Comparison

| Asset status | Automatic cleanup on submission | Context-menu “Clean Unreferenced Assets” |
|---------|--------------|-------------------|
| Newly added | Revert, **retain local copy** | Revert, **retain local copy** |
| Tracked | No action | **Delete (server + local)** |

### Step 3: Start Using It

**Daily work:**  
Check candidate unreferenced assets according to configuration during submission and review the results.

**Deep cleanup:**  
To clean the entire project, click `Clean All Source Control Assets` in settings.

### Submission Handling

With automatic cleanup enabled, the tool processes files during submission using reference-analysis results.

**Workflow:**

1.  Work normally, creating or modifying assets
2.  Add assets to version control (Add to Source Control)
3.  Open the submission dialog to prepare a submission
4.  **The plugin automatically detects in the background** which assets are unreferenced
5.  Unreferenced assets are automatically removed from the submission list (reverted)
6.  The submission dialog shows only files that actually need to be submitted

**Typical scenario:**

An artist tests 10 materials, but only 2 are ultimately used in the scene. During submission, the plugin identifies and reverts the 8 unreferenced materials, leaving a clean submission list.

### Full Cleanup

Besides daily automatic cleanup, SimpleAssetCleaner offers full cleanup for periodic maintenance or major version changes.

**Use cases:**

-   Cleanup before a major project version change
-   Taking over a legacy project and removing accumulated unused content
-   Regular maintenance to keep the repository healthy

**Procedure:**

1.  Open `Editor > Project Settings > General > Simple Asset Cleaner`
2.  Click `Clean All Source Control Assets`
3.  Wait for scanning to finish; a progress bar is shown
4.  Review logs to see which assets were cleaned

**Safety measures:**

| Asset status | Action |
| --- | --- |
| Newly added, unsubmitted, unreferenced asset | Revert from version control, retaining the local file |
| Submitted, unreferenced asset | Delete from version control and local disk |

**Important reminder:**

Full cleanup deletes submitted unreferenced files. Before using it:

-   Ensure complete version control history is available for recovery
-   Try it on a test branch first
-   Communicate with team members in advance

## Scope and Notes

### 5.3 Cleanup Results

| Asset status | Automatic cleanup (submission) | Manual full cleanup |
| --- | --- | --- |
| Newly added unreferenced asset | Revert (retain local copy) | Revert (retain local copy) |
| Submitted unreferenced asset | No action | Delete (server + local) |
| Referenced asset | Submit normally | Retain |
| Plugin and engine assets | No action | No action |
