---
title: 编辑 Landscape 专用样条
type: doc
slug: mcp-world-editor-landscape-splines
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
  slug: landscape-splines
  order: 3
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/landscape-splines/
lang: zh
translationKey: doc:mcp-world-editor:landscape-splines
---

## 查看拓扑并修改控制点

Landscape 专用样条先用 `GetLandscapeSplineTopology` 查看拓扑，再用 `PatchLandscapeSplineTopology` 执行 `AddPoint`、`UpdatePoint`、`DeletePoint`、`AddSegment`、`UpdateSegment` 或 `DeleteSegment`，按操作传入精确点/线段路径及局部坐标或切线。先预览，再以 `ExpectedTopologyHash` 与 `ExpectedPlanHash` 应用。该有界拓扑编辑要求已加载、非分区且没有保留样条 Edit Layer 的 Landscape。`ApplyLandscapeSplines` 可另外预览将样条作用于精确 `EditLayerGuid`，用 `ExpectedPlanHash` 应用；存在保留样条层时必须指定它的 GUID。目标层须可用且未锁定。这些操作不会保存关卡或资产。
