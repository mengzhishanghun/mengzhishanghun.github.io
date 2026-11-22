---
title: 配置根资产与保护范围
type: doc
slug: simple-asset-cleaner-protect-assets
draft: false
sitePublish: true
tags:
  - 资产管理
  - 引用分析
workIds:
  - simple-asset-cleaner
docPage:
  work: simple-asset-cleaner
  group: workflows
  slug: protect-assets
  order: 3
documentKind: product-manual
websiteRoute: /zh/works/simple-asset-cleaner/docs/protect-assets/
lang: zh
translationKey: doc:simple-asset-cleaner:protect-assets
---

### 根资产配置

#### Root Asset Classes
- **默认**：`UWorld`（地图文件）
- **功能**：这些类型的资产（包括父类/派生类）被视为根
- **示例**：
  - `UWorld` - 地图（.umap）及派生类型
  - `UDataAsset` - 数据资产及派生类型
- **注意**：自动包含父类和所有派生类

#### Custom Root Assets
- **功能**：手动指定个别资产为根
- **示例**：`/Game/Core/GameMode.GameMode`
- **用途**：Root Asset Classes 未涵盖的关键资产

#### Additional Root Paths
- **功能**：这些路径下的所有资产都视为根
- **示例**：`/Game/Essential/`、`/Game/Core/`
- **用途**：保护整个系统文件夹不被清理

---

### 根资源配置

SimpleAssetCleaner 通过“根资源”判断资源是否被使用。

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

手动指定资源作为根，适合标记重要但类型不常见的资源。

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
