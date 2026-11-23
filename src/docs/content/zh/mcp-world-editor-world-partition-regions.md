---
title: 加载与卸载 World Partition 区域
type: doc
slug: mcp-world-editor-world-partition-regions
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
docPage:
  work: mcp-world-editor
  group: features
  slug: world-partition-regions
  order: 14
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/world-partition-regions/
lang: zh
translationKey: doc:mcp-world-editor:world-partition-regions
---

## World Partition 区域加载

`LoadRegion` 通过 Unreal Engine 公开的 World Partition 加载器 API 创建并加载持久的编辑器区域。`BoundsMin` 与 `BoundsMax` 都必须包含有限的数值字段 `X`、`Y`、`Z`，且每个轴的最小值必须严格小于对应最大值。无效边界会在创建加载器之前被拒绝。

先确定要加载的范围，再提供两个包围角的坐标。如果只在平面上选好了范围，也要补齐有效的高度区间。

## World Partition 区域生命周期

单轴最长 1,000,000 Unreal 单位、总体积最多 1e17 立方单位，同时最多保留 16 个由 MCP 创建的活动区域。加载成功后会返回 `RegionHandle`。把它传给 `UnloadRegion`，即可卸载该区域并释放对应的 Editor Loader Adapter。句柄不会按 bounds 猜测或复用；切换/清理 World 以及卸载插件模块时，插件会自动释放仍由它管理的区域，此后旧句柄会失效。

加载成功后保留返回的 `RegionHandle`。区域内的编辑完成后，用这个句柄卸载；换了地图需要重新加载时，使用新返回的句柄。
