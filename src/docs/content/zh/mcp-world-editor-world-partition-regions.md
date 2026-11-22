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
  group: world-partition
  slug: world-partition-regions
  order: 3
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/world-partition-regions/
lang: zh
translationKey: doc:mcp-world-editor:world-partition-regions
---

## World Partition 区域加载

`LoadRegion` 通过 Unreal Engine 公开的 World Partition 加载器 API 创建并加载持久的编辑器区域。`BoundsMin` 与 `BoundsMax` 都必须包含有限的数值字段 `X`、`Y`、`Z`，且每个轴的最小值必须严格小于对应最大值。无效边界会在创建加载器之前被拒绝。

## World Partition 区域生命周期

单轴最长 1,000,000 Unreal 单位、总体积最多 1e17 立方单位，同时最多保留 16 个由 MCP 创建的活动区域。成功结果返回不可推测的 `RegionHandle`，调用 `UnloadRegion` 可卸载并释放对应的官方 Editor Loader Adapter。句柄不会按 bounds 猜测或复用；切换/清理 World 以及卸载插件模块时，插件会自动释放仍由它管理的区域，此后旧句柄会失效。
