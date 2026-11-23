---
title: 编辑 Actor 样条
type: doc
slug: mcp-world-editor-actor-splines
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
  slug: actor-splines
  order: 9
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/actor-splines/
lang: zh
translationKey: doc:mcp-world-editor:actor-splines
---

## 读取并修改样条点

普通样条组件先用 `GetSplineData` 的 `ActorName`、精确 `ComponentName` 和可选 `CoordinateSpace=Local|World` 查询。把返回的 `SnapshotHash` 传给 `ApplySplinePatch`，通过有序 `Operations` 执行 `Add`、`Remove`、`SetLocation`、`SetTangents`、`SetRotation`、`SetScale`、`SetType` 或 `SetClosedLoop`。先预览，正式执行需 `bDryRun=false` 与预览的 `PlanHash`；插入和删除会改变同一批后续操作的索引。`SetSplineMesh` 用局部坐标的 `Start`、`StartTangent`、`End`、`EndTangent` 编辑一个样条网格组件，也可指定截面缩放、滚转、前向轴和静态网格。编辑 Landscape 样条时，请改用《编辑 Landscape 专用样条》中的工具。

`ApplySplinePatch` 支持 Blueprint SCS 样条组件，构造脚本重跑后会重新核验当前组件。已经由构造脚本改写，或配置为将点交给构造脚本处理的样条会在写入前拒绝。重建或读回失败时，Undo 事务中可能保留变更；重试前先检查返回状态。

例如，先删除一个点，再修改它后面的点时，后一步要按删除后的索引填写。完成后重新读取样条点，确认点的位置、顺序和闭合状态符合预期。
