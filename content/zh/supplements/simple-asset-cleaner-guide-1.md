---
title: SimpleAssetCleaner 使用指南
description: 根据根资源与引用关系识别候选未引用资产，提供提交时处理与全量清理入口。
type: doc
slug: simple-asset-cleaner-guide
categoryId: ue-tools
categoryName: UE工具
categoryOrder: 0
order: 0
status: 正式文档
date: 2025-11-01
draft: false
sitePublish: false
tags:
  - SimpleAssetCleaner
  - UE工具
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19183435
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/19183435
workIds:
  - simple-asset-cleaner
lang: zh
translationKey: doc:simple-asset-cleaner-guide:supplement:1
---

# SimpleAssetCleaner 使用指南

依据根资源和引用关系识别候选未引用资产，并提供提交时处理与全量清理入口。

## 安装与配置

### 步骤1：安装插件

1.  将插件文件夹复制到项目的 `Plugins` 目录
    
    ```
    YourProject/
    └── Plugins/
        └── SimpleAssetCleaner/
    ```
    
2.  打开项目，在 `Edit > Plugins` 中搜索 `SimpleAssetCleaner`
    
3.  勾选启用，重启编辑器
    

### 步骤2：基础配置

打开项目设置：`Editor > Project Settings > General > Simple Asset Cleaner`

**自动清理开关：**

配置需要保留的根资源和保护路径后，再勾选 `Enable Auto Clean`。

默认配置下，插件会：

-   以所有地图文件作为根资源
-   在提交时自动检查和清理
-   保护项目外的插件和引擎资源

**进阶配置（推荐团队项目）：**

**1\. 配置根资源类型**

在 `Root Asset Classes` 中添加：

-   `UWorld` - 地图（默认已包含）
-   `UBlueprint` - 蓝图类（如果蓝图是核心资产）
-   `UDataAsset` - 数据资产（如果有大量配置）

**2\. 添加保护路径**

在 `Additional Root Paths` 中添加：

-   `/Game/Core/` - 核心系统目录
-   `/Game/Config/` - 配置文件目录
-   `/Game/Managers/` - 管理器目录

**3\. 可选启用详细日志**

首次使用建议勾选 `Enable Verbose Logging`，观察插件的工作过程。熟悉后可以关闭以减少日志输出。

### 步骤3：开始使用

**日常工作：**  
提交时按配置检查候选未引用资源，并查看处理结果。

**深度清理：**  
当需要清理整个项目时，点击设置中的 `Clean All Source Control Assets` 按钮。

## 功能与参数

### 提交时处理

开启自动清理后，工具会在提交时按引用分析结果处理文件。

**工作流程：**

1.  你正常工作，创建或修改资源
2.  添加资源到版本控制（Add to Source Control）
3.  打开提交窗口准备提交代码
4.  **插件自动在后台检测**哪些资源没有被引用
5.  未引用的资源自动从提交列表中移除（回滚）
6.  提交窗口只显示真正需要提交的文件

**典型场景：**

美术同学测试了10个材质球，最终只有2个用在了场景中。提交时插件自动识别未被场景引用的8个材质，自动回滚，提交窗口干干净净。

### 全量清理

除了日常的自动清理，SimpleAssetCleaner 还提供了全量清理功能，适合定期维护或重大版本迭代。

**使用场景：**

-   项目重大版本迭代前的大扫除
-   接手遗留项目，需要清理历史包袱
-   定期维护，保持仓库健康

**操作方式：**

1.  打开 `Editor > Project Settings > General > Simple Asset Cleaner`
2.  点击 `Clean All Source Control Assets` 按钮
3.  等待扫描完成（会显示进度条）
4.  查看日志了解清理了哪些资源

**安全保障：**

| 资源状态 | 处理方式 |
| --- | --- |
| 新增但未提交的未引用资源 | 从版本控制回滚，但本地文件保留 |
| 已提交的未引用资源 | 从版本控制删除并删除本地文件 |

**重要提醒：**

全量清理会删除已提交的未引用文件，使用前务必：

-   确保有完整的版本控制历史可回溯
-   在测试分支先试运行
-   团队成员提前沟通

### 根资源配置

SimpleAssetCleaner 通过"根资源"的概念来判断资源是否被使用。

**什么是根资源？**

根资源就是你的项目中最核心的资源，比如：

-   地图文件（.umap）
-   主要的蓝图类（如GameMode、PlayerController）
-   配置数据表

插件会从这些根资源出发，追踪所有直接或间接引用的资源。只要资源在这条引用链上，就会被保留；否则视为未引用。

**三种配置方式：**

**1\. Root Asset Classes（根资源类型）**

指定哪些类型的资源是"根"。默认包含 `UWorld`（地图文件）。

常用配置：

-   `UWorld` - 所有地图（默认已包含）
-   `UBlueprint` - 所有蓝图类
-   `UDataAsset` - 所有数据资产
-   `UDataTable` - 所有数据表

**2\. Custom Root Assets（自定义根资源）**

手动指定特定的资源作为根，适合标记那些很重要但类型不常见的资源。

例如：

-   `/Game/Core/MainGameMode` - 主游戏模式
-   `/Game/Config/GlobalSettings` - 全局配置

**3\. Additional Root Paths（根路径）**

保护整个目录下的所有资源，这些资源及其引用的内容都会被保留。

例如：

-   `/Game/Core/` - 核心系统目录
-   `/Game/Config/` - 配置文件目录
-   `/Game/Essential/` - 必需资源目录

**工作原理示意：**

```
地图 A (根资源)
  ├─ 引用了材质 M1
  │   └─ 引用了纹理 T1 ✅ 保留
  └─ 引用了蓝图 BP1
      └─ 引用了材质 M2 ✅ 保留

材质 M3 ❌ 未被任何根资源引用 → 清理
```

### 日志选项

插件提供了可选的详细日志功能，方便调试和监控。

**启用方式：**  
在项目设置中勾选 `Enable Verbose Logging`

**日志内容包括：**

-   扫描了哪些文件
-   检测到哪些未引用资源
-   执行了哪些清理操作
-   引用链追踪过程（用于调试）

在首次使用或遇到问题时，建议启用详细日志，方便了解插件的工作过程。

## 使用范围与注意事项

### 5.1 配置建议

**✅ 推荐做法：**

-   **自动清理配置** - 根据项目资源变化定期检查设置
-   **先明确根资源与保护范围** - 覆盖需要保留的地图、蓝图、配置资源和目录
-   **逐步添加资源类型** - 确认项目中哪些类型是核心资源（蓝图、数据表等）
-   **关键目录添加到保护路径** - 确保核心系统不会被误删
-   **首次使用启用详细日志** - 了解插件的工作过程

**⚠️ 注意事项：**

-   **首次使用建议在测试分支试运行** - 观察清理结果是否符合预期
-   **全量清理前务必确保版本控制可恢复** - 至少有一个可回滚的提交点
-   **团队使用时统一配置规则** - 将配置文件加入版本控制，确保所有成员一致
-   **定期检查配置是否需要更新** - 项目演进过程中核心资源类型可能变化

### 5.2 源控制提供器说明

SimpleAssetCleaner 支持所有 Unreal Engine 支持的版本控制系统：

-   ✅ Perforce
-   ✅ Git
-   ✅ SVN
-   ✅ Plastic SCM
-   ✅ 其他通过UE API集成的系统

**配置要点：**

在 `Editor > Preferences > Source Control` 中选择你实际使用的提供器（如 Perforce、Git、Subversion 等）。

⚠️ **重要：** 不要选择带 `_Proxy` 后缀的选项（如 `Perforce_Proxy`），这是插件的内部实现，会自动处理。

### 5.3 清理结果对照表

| 资源状态 | 自动清理（提交时） | 手动全量清理 |
| --- | --- | --- |
| 新添加的未引用资源 | 回滚（本地保留） | 回滚（本地保留） |
| 已提交的未引用资源 | 不处理 | 删除（服务器+本地） |
| 被引用的资源 | 正常提交 | 保留 |
| 插件和引擎资源 | 不处理 | 不处理 |

### 5.4 什么资源会被保护

SimpleAssetCleaner 只分析和清理 **项目Content目录**（`/Game/` 路径）下的资源。

**清理范围之外的资源：**

-   ❌ 插件资源（如 `/YourPlugin/Content/`）
-   ❌ 引擎资源（`/Engine/` 路径）
-   ❌ C++代码文件（.h、.cpp）
-   ❌ 外部引用（Content目录外的文件）

**按根资源配置保留的资源：**

-   ✅ 配置为根资源类型的资源
-   ✅ 自定义根资源列表中的资源
-   ✅ 根路径下的所有资源
-   ✅ 任何被以上资源直接或间接引用的资源

---

原文于 2025-11-01 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/19183435)。
