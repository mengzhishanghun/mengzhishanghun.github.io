---
title: Configure Root Assets and Protection
type: doc
slug: simple-asset-cleaner-protect-assets
draft: false
sitePublish: true
tags:
  - Asset Management
  - Reference Analysis
workIds:
  - simple-asset-cleaner
documentKind: product-manual
websiteRoute: /en/works/simple-asset-cleaner/docs/protect-assets/
lang: en
translationKey: doc:simple-asset-cleaner:protect-assets
sourceHash: e4a3446c8bb960a1ded54d78dbcc67872ccec954b7dba45dfe1a1a0b5d2a6b04
translationStatus: translated
generatedBodyHash: 41d48c08cccfbef23cb72139fdf32403e938121cd9459630aa7a3b7dca3e5d17
docPage:
  work: simple-asset-cleaner
  group: workflows
  slug: protect-assets
  order: 3
---

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
