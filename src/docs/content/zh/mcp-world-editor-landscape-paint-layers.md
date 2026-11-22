---
title: 编辑 Landscape 绘制层与权重
type: doc
slug: mcp-world-editor-landscape-paint-layers
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
docPage:
  work: mcp-world-editor
  group: landscape
  slug: landscape-paint-layers
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/landscape-paint-layers/
lang: zh
translationKey: doc:mcp-world-editor:landscape-paint-layers
---

## 创建与绑定绘制层

`GetLandscapeLayerInfo` 列出主 Landscape 的绘制层绑定。`CreateLandscapeLayerInfo` 用 `PackagePath`、`LayerName` 和 `bWeightBlended` 预览新的 `/Game/...` 资产，再以 `bDryRun=false`、`ExpectedPlanHash` 创建；资产还需单独保存。`BindLandscapeLayerInfo` 在已加载的非分区主 Landscape 上预览将已有 `LayerInfoPath` 绑定到 `LayerName`，或以 `bUnbind=true` 解绑。用新的 `ExpectedPlanHash` 执行；存在已绘制分配时拒绝解绑，且不会删除资产。

## 读取并写入权重

`GetLandscapeWeightData` 从精确绑定的 `LayerInfoPath` 读取端点包含在内的顶点区域（最多 65,536 个按行排列的 `uint8` 权重）；启用 Edit Layers 时指定 `EditLayerGuid`。`SetLandscapeWeightData` 接受精确 `WeightData`，或笔刷字段（`BrushCenterX/Y`、`BrushRadius`、`BrushTargetWeight`、`BrushStrength`）。它要求已加载、非分区的主 Landscape，且每个受影响组件已有目标分配。先预览有界区域，再用 `ExpectedCurrentDataHash` 和 `ExpectedProposedDataHash` 执行；权重混合层可能归一化其他绘制层的权重。`GetLandscapeEditLayers` 列出 Edit Layer GUID；`EditLandscapeLayer` 可预览创建、删除、重排、重命名、可见性、锁定、Alpha 或混合模式变更，执行须使用新的当前哈希和计划哈希。删除须 `bAllowDataLoss=true`；UE 5.8 不提供所需的公开编辑层混合模式 setter。
