---
title: 编辑与散布植被
type: doc
slug: mcp-world-editor-foliage
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
docPage:
  work: mcp-world-editor
  group: actors
  slug: foliage
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/foliage/
lang: zh
translationKey: doc:mcp-world-editor:foliage
---

## 查询并编辑植被实例

先用 `ListFoliageTypes` 查找已加载的植被类型及精确路径。`AddFoliageInstances` 通过静态网格 `MeshPath` 和世界坐标 `Transforms` 添加实例；旧的 `Locations` 只指定位置，旋转和缩放为默认值。编辑已加载植被时，用 `FoliageInstances` 的 `Operation=Query`、精确 `IFAPath` 和 `FoliageTypePath` 查询，通过 `Offset`、`Limit`（最多 100）分页。`Update`、`Remove` 或 `Move` 指定 `Indices` 前，先按默认 `bDryRun=true` 预览，再用相同请求、`bDryRun=false`、`ExpectedCurrentSnapshotHash` 和 `ExpectedPlanHash` 执行。`Update` 的变换数必须与索引数一致。`Move` 还需要另一个已加载的 `TargetIFAPath` 和 `ExpectedTargetSnapshotHash`；World Partition 中源与目标植被分区都须已加载，位置也须属于所选分区。索引仅对对应快照有效。

## 预览并应用散布

`ScatterFoliage` 在 WorldStatic 地面上预览确定性的散布候选。提供已有植被类型的精确 IFA/类型路径、XY 矩形（`MinX`、`MinY`、`MaxX`、`MaxY`）、允许的 Z 范围、`Seed`、`MaxSlopeDegrees`、`MinSpacing`，以及 `Count`（最多 100）或 `Density`；`MaxSamples` 限制采样次数。查看预览后，带两个返回的哈希执行。非植被 ISM/HISM 组件使用 `InstancedMeshes`：通过精确 `ComponentPath` 分页 `Query`，或用世界坐标 `Transforms` 和快照索引预览并执行 `Add`、`Update`、`Remove`。植被组件应使用 `FoliageInstances`。
