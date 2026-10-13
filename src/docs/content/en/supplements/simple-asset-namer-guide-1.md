---
title: SimpleAssetNamer User Guide
description: Handle automatic naming and batch renaming using asset types and path rules.
type: doc
slug: simple-asset-namer-guide
categoryId: ue-tools
categoryName: UE Tools
categoryOrder: 0
order: 0
status: Official Documentation
date: 2026-03-25
draft: false
sitePublish: false
tags:
  - SimpleAssetNamer
  - UE Tools
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19770922
links:
  - label: Original CNBlogs article
    href: https://www.cnblogs.com/mengzhishanghun/p/19770922
workIds:
  - simple-asset-namer
lang: en
translationKey: doc:simple-asset-namer-guide:supplement:1
sourceHash: 1978d26651530abc618696cb5c2051c69925d079a6bf42bc1e1d4b805fed738d
translationStatus: translated
generatedBodyHash: 33cdb995e2e5b7dc02319a4095667a6aa44c229121de5cfb58fa35a5eb7e9d96
---

# SimpleAssetNamer User Guide

Use asset-type rules, path scope, and affix configuration to name new and existing assets.

## Installation and Settings

### Step 1: Install the Plugin

Copy the plugin folder into your project's `Plugins` directory and restart the editor.

### Step 2: Configure Naming Rules

Path: `Edit > Project Settings > Simple Asset Namer`

**Basic configuration:**

1.  **General**: Enable/disable automatic renaming
2.  **Filter**: Configure blacklist/whitelist paths
3.  **Delimiter**: Configure separators and legacy affixes
4.  **Naming Rules**: Configure prefixes and suffixes for each asset type

Check that default rules match your project's naming conventions before use.

### Step 3: Start Using It

-   **Automatic mode**: Work normally; assets are named automatically on creation/import
-   **Batch mode**: Select a folder and use batch renaming

## Naming Rules

**Naming rule configuration:**

Each asset type can have its own prefix and suffix:

```cpp
USTRUCT(BlueprintType)
struct FAssetNamingRule
{
    FString Prefix;  // 如 "BP"
    FString Suffix;  // 如 "Mat"
};

// 配置示例
TMap<TSoftClassPtr<UObject>, FAssetNamingRule> AssetTypeNamingRules;
// UBlueprint      → Prefix: "BP",  Suffix: ""
// UStaticMesh     → Prefix: "SM",  Suffix: ""
// UMaterialInstance → Prefix: "MI", Suffix: ""
// UTexture2D      → Prefix: "T",   Suffix: ""
```

**Core name extraction:**

The plugin does more than prepend a prefix. It first **analyzes the existing name structure**, extracts the core name, then generates the standard name:

```
Input: "bp_MyCharacter"    → Core: "MyCharacter"  → Output: "BP_MyCharacter"
Input: "SM-tree-01"        → Core: "tree-01"      → Output: "SM_tree_01"
Input: "Blueprint_Player"  → Core: "Player"       → Output: "BP_Player"
Input: "MyMaterial_Mat"    → Core: "MyMaterial"   → Output: "M_MyMaterial"
```

Extraction attempts to match and remove:

1.  The prefix/suffix configured for the current type
2.  All affixes in the legacy list (`LegacyAffixes`)
3.  Separators in the detection list (`_`, `-`, `.`)

## Path Filtering

**Blacklist mode (default):**

Excludes assets under specified paths; UE internal directories are excluded by default:

```
ExcludePaths:
  /Game/__ExternalActors__    // World Partition 自动生成
  /Game/__ExternalObjects__   // World Partition 自动生成
  /Game/Developers            // 开发者个人目录
  /Game/Collections           // 集合目录
```

**Whitelist mode:**

Processes only assets under specified paths, suitable for gradually introducing naming conventions:

```
IncludePaths:
  /Game/Characters/
  /Game/Items/
```

## Delimiters and Legacy Affixes

```cpp
// 生成命名时使用的连接符
FString Delimiter = "_";               // BP_MyActor

// 识别现有命名时的分隔符列表
TArray<FString> DelimiterDetectionList = {"_", "-", "."};

// 旧词缀列表（用于识别历史命名的前缀和后缀）
TArray<FString> LegacyAffixes;  // 如 "bp", "Blueprint", "sm", "mat"
```

## Automatic Processing Toggles

- bAutoRenameOnCreate: Apply naming rules when assets are created or imported.
- bAutoRenameOnRename: Recheck naming rules after manual renaming.

## Viewing Results

Batch renaming displays a detailed results dialog containing:

-   Success counts and details (old name → new name)
-   Skip counts and reasons, such as already standard, no matching rule, or existing target
-   Error counts and specific information

## Batch Operations

Select the target folder and use the batch-renaming entry point. Check included or excluded paths first, then review success, skip, and error details. Retain a recoverable version before batch operations and check asset references after renaming.

---

Originally published on 2026-03-25 on [CNBlogs](https://www.cnblogs.com/mengzhishanghun/p/19770922).
