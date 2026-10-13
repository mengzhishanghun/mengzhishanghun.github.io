---
title: SimpleAssetCleaner User Manual
description: Complete English product manual for SimpleAssetCleaner
type: doc
slug: simple-asset-cleaner-guide
categoryId: ue-plugins
categoryName: UE Plugins
categoryOrder: 0
draft: false
sitePublish: true
tags:
  - Asset Management
  - Reference Analysis
workIds:
  - simple-asset-cleaner
documentKind: product-manual
websiteRoute: /docs/zh/guides/ue-tools/simple-asset-cleaner-guide/
lang: en
translationKey: simple-asset-cleaner-guide
supplementSources:
  - docs/content/en/supplements/simple-asset-cleaner-guide-1.md
sourceHash: 7deeb9b800f75e9773319b1e3589b3dcf7ab962c1345ab5a3691792190277727
translationStatus: translated
generatedBodyHash: d7338c5f297a1adb430035a8104aeacedd6724816c24e916826205351b094b04
---

# SimpleAssetCleaner Plugin Tutorial

**SimpleAssetCleaner** automatically identifies and removes unreferenced assets in Unreal Engine projects to keep repositories tidy.

> **Important**: This plugin can delete assets from version control. Read carefully before use.

**Compatibility**: Unreal Engine 5.2–5.8

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

## Automatically Add Untracked Dependencies on Submission

When submitting a changelist, the plugin automatically checks dependencies of assets being submitted. If dependent files are not yet under version control, a dialog lists them. Select the dependencies to add using checkboxes; confirming automatically adds them to version control.

- **Trigger**: Automatically when submitting a changelist
- **Detection**: Files depended on by pending assets that are not yet under version control
- **Operation**: A dialog lists untracked dependencies; select and confirm to add them
- **Toggle**: Enable or disable this through “Enable Auto Add Dependencies” in settings

---

## Context Menu

Right-click folders or assets in the Content Browser and choose the **Simple Asset Cleaner** submenu for these features:

### Clean Unreferenced Assets

Scans assets in the selection and displays unreferenced assets with checkboxes. Cleanup runs after the user selects and confirms them.

- Supports selecting one or multiple files or folders
- Newly added files: reverted, with local copies retained
- Tracked files: **deleted from both server and local disk**

### Add Untracked Dependencies

Checks dependencies of selected assets, finds files outside version control, and lists them for user confirmation before adding them.

- Supports selecting one or multiple files or folders

> The context menu acts precisely on the selection, making it suitable for everyday cleanup and dependency checks on particular directories or assets.

---

## Configuration

**Location**: Editor > Project Settings > General > Simple Asset Cleaner

![](/media-occurrence/doc%3Asimple-asset-cleaner-guide%3Amedia%3A1)

### Version Control Provider (Important!)

The plugin automatically wraps your version control provider in a proxy to monitor submissions.

![](/media-occurrence/doc%3Asimple-asset-cleaner-guide%3Amedia%3A2)

**Do not select a proxy provider manually!**
- Always select your actual version control provider, such as Perforce, Git, or SVN
- The plugin wraps it automatically in the background
- Selecting a proxy directly may cause problems

**Correct settings**:
- Use: `Perforce`, `Git`, `Subversion`, etc.
- Avoid: `Perforce_Proxy`, `Git_Proxy`, or any provider ending in `_Proxy`

### General Settings

#### Enable Auto Clean
- **Default**: Enabled
- **Function**: Check references before submission
- **Behavior**: Revert unreferenced newly added files, preserving local files
- **Recommendation**: Keep enabled for everyday use

#### Enable Auto Add Dependencies
- **Default**: Enabled
- **Function**: Automatically detect untracked dependency files during submission
- **Behavior**: A dialog lists untracked dependencies; selected files are added after confirmation
- **Recommendation**: Keep enabled to prevent missing dependencies from breaking other team members' builds

#### Language
- **Default**: English
- **Options**: Chinese / English
- **Function**: Switch the language of all UI text and logs
- **Behavior**: Takes effect immediately without restarting the editor

#### Enable Verbose Logging
- **Default**: Disabled
- **Function**: Detailed logs for debugging
- **Recommendation**: Enable only when troubleshooting

### Root Asset Configuration

#### Root Asset Classes
- **Default**: `UWorld` (map files)
- **Function**: Assets of these types, including parent/derived classes, are treated as roots
- **Example**:
  - `UWorld` - Maps (.umap) and derived types
  - `UDataAsset` - DataAssets and derived types
- **Note**: Parent classes and all derived classes are automatically included

#### Custom Root Assets
- **Function**: Manually designate individual assets as roots
- **Example**: `/Game/Core/GameMode.GameMode`
- **Purpose**: Critical assets not covered by Root Asset Classes

#### Additional Root Paths
- **Function**: All assets under these paths are treated as roots
- **Example**: `/Game/Essential/`, `/Game/Core/`
- **Purpose**: Protect entire system folders from cleanup

---

## Important Notes

### Operation Comparison

| Asset status | Automatic cleanup on submission | Context-menu “Clean Unreferenced Assets” |
|---------|--------------|-------------------|
| Newly added | Revert, **retain local copy** | Revert, **retain local copy** |
| Tracked | No action | **Delete (server + local)** |

### Automatic Dependency Addition

| Dependency status | Action |
|---------|---------|
| Already under version control | No action required |
| Not under version control | Listed in a confirmation dialog for the user to select files to add |

---



## Support

**When reporting issues, provide**:
- Unreal Engine version
- Version control system (Perforce/Git/SVN)
- Plugin settings screenshot
- Log output with verbose logging enabled

---

**Compatibility**: Unreal Engine 5.2–5.8 | Tested on Windows; theoretically supports all platforms

**Remember**: Start conservatively. Assets can always be deleted, but restoration requires version control history!

## Contact

For usage questions or collaboration inquiries, visit the contact page.

- **Contact:** [Contact and Collaboration](https://mzsh.me/contact/)
