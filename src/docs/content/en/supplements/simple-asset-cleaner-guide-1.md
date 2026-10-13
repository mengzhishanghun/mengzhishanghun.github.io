---
title: SimpleAssetCleaner User Guide
description: Identify candidate unreferenced assets using roots and references, with submission handling and full cleanup.
type: doc
slug: simple-asset-cleaner-guide
categoryId: ue-tools
categoryName: UE Tools
categoryOrder: 0
order: 0
status: Official Documentation
date: 2025-11-01
draft: false
sitePublish: false
tags:
  - SimpleAssetCleaner
  - UE Tools
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19183435
links:
  - label: Original CNBlogs article
    href: https://www.cnblogs.com/mengzhishanghun/p/19183435
workIds:
  - simple-asset-cleaner
lang: en
translationKey: doc:simple-asset-cleaner-guide:supplement:1
sourceHash: 3bea3a594546cb87cb88ee8deaf4c16dfe7474ed064d84e3fd42f76f2fc53142
translationStatus: translated
generatedBodyHash: 7ea30da72261d69f9cb63f4f258d1f1448bb347d4201e6cd68b62973951f181c
---

# SimpleAssetCleaner User Guide

Identifies candidate unreferenced assets using roots and reference relationships, with entry points for submission handling and full cleanup.

## Installation and Configuration

### Step 1: Install the Plugin

1.  Copy the plugin folder into your project's `Plugins` directory
    
    ```
    YourProject/
    └── Plugins/
        └── SimpleAssetCleaner/
    ```
    
2.  Open the project and search for `SimpleAssetCleaner` under `Edit > Plugins`
    
3.  Enable it and restart the editor
    

### Step 2: Basic Configuration

Open project settings: `Editor > Project Settings > General > Simple Asset Cleaner`

**Automatic cleanup toggle:**

Configure the root assets and protected paths to retain before checking `Enable Auto Clean`.

With default configuration, the plugin:

-   Uses all maps as root assets
-   Automatically checks and cleans on submission
-   Protects plugin and engine assets outside the project

**Advanced configuration (recommended for teams):**

**1\. Configure root asset types**

Add to `Root Asset Classes`:

-   `UWorld` - Maps (included by default)
-   `UBlueprint` - Blueprint classes, if Blueprints are core assets
-   `UDataAsset` - DataAssets, if the project has substantial configuration data

**2\. Add protected paths**

Add to `Additional Root Paths`:

-   `/Game/Core/` - Core systems directory
-   `/Game/Config/` - Configuration directory
-   `/Game/Managers/` - Manager directory

**3\. Optionally enable verbose logging**

On first use, enable `Enable Verbose Logging` to observe the plugin. Once familiar, disable it to reduce log output.

### Step 3: Start Using It

**Daily work:**  
Check candidate unreferenced assets according to configuration during submission and review the results.

**Deep cleanup:**  
To clean the entire project, click `Clean All Source Control Assets` in settings.

## Features and Parameters

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

### Root Asset Configuration

SimpleAssetCleaner uses “root assets” to determine whether assets are in use.

**What is a root asset?**

Root assets are the most central assets in your project, such as:

-   Map files (.umap)
-   Main Blueprint classes, such as GameMode and PlayerController
-   Configuration data tables

Starting from these roots, the plugin tracks all directly or indirectly referenced assets. Assets on these reference chains are retained; others are considered unreferenced.

**Three configuration methods:**

**1\. Root Asset Classes**

Specify which asset types are roots. `UWorld` (maps) is included by default.

Common configurations:

-   `UWorld` - All maps (included by default)
-   `UBlueprint` - All Blueprint classes
-   `UDataAsset` - All DataAssets
-   `UDataTable` - All data tables

**2\. Custom Root Assets**

Manually designate particular assets as roots, useful for important assets of less common types.

For example:

-   `/Game/Core/MainGameMode` - Main game mode
-   `/Game/Config/GlobalSettings` - Global configuration

**3\. Additional Root Paths**

Protect all assets in an entire directory. These assets and everything they reference are retained.

For example:

-   `/Game/Core/` - Core systems directory
-   `/Game/Config/` - Configuration directory
-   `/Game/Essential/` - Essential assets directory

**How it works:**

```
Map A (root asset)
  ├─ References material M1
  │   └─ References texture T1 ✅ Retain
  └─ References Blueprint BP1
      └─ References material M2 ✅ Retain

Material M3 ❌ Not referenced by any root → Clean up
```

### Logging Options

The plugin provides optional verbose logging for debugging and monitoring.

**Enable it:**  
Check `Enable Verbose Logging` in project settings

**Logs include:**

-   Files scanned
-   Unreferenced assets detected
-   Cleanup operations performed
-   Reference-chain tracing for debugging

Enable verbose logging on first use or when problems arise to understand the plugin's operation.

## Scope and Notes

### 5.1 Configuration Recommendations

**✅ Recommended practices:**

-   **Automatic cleanup configuration** - Review settings periodically as project assets change
-   **Define roots and protection scope first** - Cover maps, Blueprints, configuration assets, and directories that must be retained
-   **Add asset types gradually** - Determine which types are core assets, such as Blueprints and data tables
-   **Protect critical directories** - Prevent accidental deletion of core systems
-   **Enable verbose logging on first use** - Observe how the plugin works

**⚠️ Notes:**

-   **Try it on a test branch first** - Check that cleanup matches expectations
-   **Ensure version control recovery before full cleanup** - Keep at least one recoverable commit
-   **Use consistent team configuration** - Put configuration files under version control so all members use the same rules
-   **Review configuration periodically** - Core asset types may change as the project evolves

### 5.2 Source Control Providers

SimpleAssetCleaner supports all version control systems supported by Unreal Engine:

-   ✅ Perforce
-   ✅ Git
-   ✅ SVN
-   ✅ Plastic SCM
-   ✅ Other systems integrated through the UE API

**Configuration points:**

Choose your actual provider, such as Perforce, Git, or Subversion, under `Editor > Preferences > Source Control`.

⚠️ **Important:** Do not choose options ending in `_Proxy`, such as `Perforce_Proxy`. These are internal plugin implementations and are handled automatically.

### 5.3 Cleanup Results

| Asset status | Automatic cleanup (submission) | Manual full cleanup |
| --- | --- | --- |
| Newly added unreferenced asset | Revert (retain local copy) | Revert (retain local copy) |
| Submitted unreferenced asset | No action | Delete (server + local) |
| Referenced asset | Submit normally | Retain |
| Plugin and engine assets | No action | No action |

### 5.4 Protected Assets

SimpleAssetCleaner analyzes and cleans only assets in the **project Content directory** (`/Game/` path).

**Assets outside cleanup scope:**

-   ❌ Plugin assets, such as `/YourPlugin/Content/`
-   ❌ Engine assets (`/Engine/` path)
-   ❌ C++ code files (.h, .cpp)
-   ❌ External references (files outside Content)

**Assets retained through root configuration:**

-   ✅ Assets of configured root types
-   ✅ Assets listed as custom roots
-   ✅ All assets under root paths
-   ✅ Assets directly or indirectly referenced by any of the above

---

Originally published on 2025-11-01 on [CNBlogs](https://www.cnblogs.com/mengzhishanghun/p/19183435).
