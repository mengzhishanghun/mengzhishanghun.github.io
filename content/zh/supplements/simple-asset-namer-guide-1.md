---
title: SimpleAssetNamer 使用指南
description: 按资产类型和路径规则处理自动命名与批量重命名。
type: doc
slug: simple-asset-namer-guide
categoryId: ue-tools
categoryName: UE工具
categoryOrder: 0
order: 0
status: 正式文档
date: 2026-03-25
draft: false
sitePublish: false
tags:
  - SimpleAssetNamer
  - UE工具
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19770922
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/19770922
workIds:
  - simple-asset-namer
lang: zh
translationKey: doc:simple-asset-namer-guide:supplement:1
---

# SimpleAssetNamer 使用指南

使用资产类型规则、路径范围和词缀配置，处理新建资产及已有资产的命名。

## 安装与设置

### 步骤1：安装插件

将插件文件夹复制到项目的 `Plugins` 目录，重启编辑器。

### 步骤2：配置命名规则

路径：`Edit > Project Settings > Simple Asset Namer`

**基础配置：**

1.  **General**：开启/关闭自动重命名
2.  **Filter**：配置黑名单/白名单路径
3.  **Delimiter**：配置分隔符和旧词缀
4.  **Naming Rules**：为每种资产类型配置前缀和后缀

使用前检查默认规则是否符合项目的命名约定。

### 步骤3：开始使用

-   **自动模式**：正常工作即可，创建/导入资产时自动命名
-   **批量模式**：选中文件夹，使用批量重命名功能

## 命名规则

**命名规则配置：**

每种资产类型可以配置独立的前缀和后缀：

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

**核心名称提取：**

插件不是简单地在名称前加前缀。它会先**分析现有名称结构**，提取出核心名称，再生成标准命名：

```
输入: "bp_MyCharacter"    → 核心: "MyCharacter"  → 输出: "BP_MyCharacter"
输入: "SM-tree-01"        → 核心: "tree-01"      → 输出: "SM_tree_01"
输入: "Blueprint_Player"  → 核心: "Player"       → 输出: "BP_Player"
输入: "MyMaterial_Mat"    → 核心: "MyMaterial"   → 输出: "M_MyMaterial"
```

提取过程会尝试匹配并移除：

1.  当前类型配置的前缀/后缀
2.  旧词缀列表（`LegacyAffixes`）中的所有词缀
3.  分隔符识别列表中的分隔符（`_`、`-`、`.`）

## 路径筛选

**黑名单模式（默认）：**

排除指定路径下的资产，默认排除 UE 内部目录：

```
ExcludePaths:
  /Game/__ExternalActors__    // World Partition 自动生成
  /Game/__ExternalObjects__   // World Partition 自动生成
  /Game/Developers            // 开发者个人目录
  /Game/Collections           // 集合目录
```

**白名单模式：**

只处理指定路径下的资产，适合渐进式推行命名规范：

```
IncludePaths:
  /Game/Characters/
  /Game/Items/
```

## 分隔符与历史词缀

```cpp
// 生成命名时使用的连接符
FString Delimiter = "_";               // BP_MyActor

// 识别现有命名时的分隔符列表
TArray<FString> DelimiterDetectionList = {"_", "-", "."};

// 旧词缀列表（用于识别历史命名的前缀和后缀）
TArray<FString> LegacyAffixes;  // 如 "bp", "Blueprint", "sm", "mat"
```

## 自动处理开关

- bAutoRenameOnCreate：创建或导入资产时按规则命名。
- bAutoRenameOnRename：手动改名后重新检查命名规则。

## 查看结果

批量重命名后会弹出详细的结果对话框，包含：

-   成功数量和明细（原名 → 新名）
-   跳过数量和原因（已是标准名称、无匹配规则、目标已存在等）
-   错误数量和具体信息

## 批量操作

选择目标文件夹后使用批量重命名入口。先检查包含或排除路径，再查看成功、跳过与错误明细。批量操作前保留可恢复的版本，并核对重命名后的资产引用。

---

原文于 2026-03-25 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/19770922)。
