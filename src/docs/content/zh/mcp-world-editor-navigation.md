---
title: 构建导航并查询路径
type: doc
slug: mcp-world-editor-navigation
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
docPage:
  work: mcp-world-editor
  group: levels
  slug: navigation
  order: 3
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/navigation/
lang: zh
translationKey: doc:mcp-world-editor:navigation
---

## 构建范围与预览

`BuildNavigation` 默认只预览。要执行构建，请传回预览返回的 `PlanHash`，并设置 `DryRun=false`。

普通地图和 World Partition 地图的导航构建均调用引擎公开的同步 `UNavigationSystemV1::Build`，范围是已注册且已加载可见的编辑器关卡（`Scope=LoadedVisibleEditorWorld`）。已加载但隐藏的关卡及未加载关卡不在本次范围内；预览以 `ExcludedLoadedHiddenLevelPaths` 列出被排除的已加载隐藏关卡。改变关卡可见性会使预览哈希失效，关卡关联或可见性切换期间须等待状态稳定再预览或执行。导航构建保留编辑器 Undo，不隐式执行 `MapCheck` 或保存包。World Partition 构建可能清除已加载导航数据块；`bCompleteWorldPartitionBuild=false`、`bSaved=false` 不代表完成整个分区世界的离线构建。

## 查询路径

`FindNavigationPath` 接受世界坐标 `Start` 和 `End`，在当前已加载的默认导航数据上同步查询路径，返回是否找到、是否为部分路径、长度和有界点列；它不会触发构建。`MaxPoints` 为 2–1000，超过上限时结果标记 `bTruncated=true`。
