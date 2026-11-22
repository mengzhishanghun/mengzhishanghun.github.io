---
title: 安装并配置版本控制
type: doc
slug: simple-asset-cleaner-setup
draft: false
sitePublish: true
tags:
  - 资产管理
  - 引用分析
workIds:
  - simple-asset-cleaner
docPage:
  work: simple-asset-cleaner
  group: setup
  slug: setup
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-asset-cleaner/docs/setup/
lang: zh
translationKey: doc:simple-asset-cleaner:setup
---

**SimpleAssetCleaner** 自动识别并移除 Unreal Engine 项目中未被引用的资产，保持仓库整洁。

> **重要**：此插件可以从版本控制中删除资产。使用前请仔细阅读。

**兼容性**：Unreal Engine 5.2–5.8

---

## 配置

**位置**：编辑器 > 项目设置 > General > Simple Asset Cleaner

![](/media-occurrence/doc%3Asimple-asset-cleaner%3Asetup%3Amedia%3A1)

### 版本控制提供者（重要！）

插件会自动包装当前版本控制提供者，用来监控提交。

![](/media-occurrence/doc%3Asimple-asset-cleaner%3Asetup%3Amedia%3A2)

**不要手动选择代理提供者！**
- 始终选择你实际的版本控制提供者（Perforce、Git、SVN 等）
- 插件会在后台自动包装
- 直接选择代理可能导致问题

**正确设置**：
- 使用：`Perforce`、`Git`、`Subversion` 等
- 避免：`Perforce_Proxy`、`Git_Proxy` 或任何以 `_Proxy` 结尾的提供者

### 通用设置

#### Language / 语言
- **默认**：English
- **选项**：中文 / English
- **功能**：切换所有 UI 文本和日志语言
- **行为**：修改后实时生效，无需重启编辑器

#### Enable Verbose Logging / 启用详细日志
- **默认**：关闭
- **功能**：用于调试的详细日志
- **建议**：仅在排查问题时开启

## 支持

**报告问题时请提供**：
- Unreal Engine 版本
- 版本控制系统（Perforce/Git/SVN）
- 插件设置截图
- 日志输出（启用详细日志后）

---

**兼容性**：Unreal Engine 5.2–5.8 | 已在 Windows 上测试，理论上支持所有平台

**记住**：先保守处理。资产随时可以删除，但恢复需要版本控制历史！

## 联系方式

如有使用问题或合作需求，请前往联系页面。

- **联系入口：** [联系与合作](https://mzsh.me/contact/)

## SimpleAssetCleaner 使用指南

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

## 功能与参数

### 日志选项

插件提供可选的详细日志，方便调试和监控。

**启用方式：**  
在项目设置中勾选 `Enable Verbose Logging`

**日志内容包括：**

-   扫描了哪些文件
-   检测到哪些未引用资源
-   执行了哪些清理操作
-   引用链追踪过程（用于调试）

在首次使用或遇到问题时，建议启用详细日志，方便了解插件的工作过程。

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
