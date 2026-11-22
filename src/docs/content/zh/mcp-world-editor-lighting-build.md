---
title: 构建关卡灯光
type: doc
slug: mcp-world-editor-lighting-build
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
  slug: lighting-build
  order: 4
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/lighting-build/
lang: zh
translationKey: doc:mcp-world-editor:lighting-build
---

## 预览与构建状态

`BuildLighting` 默认只预览。要执行构建，请传回预览返回的 `PlanHash`，并设置 `DryRun=false`。

灯光构建使用 Preview 品质，返回 `OperationId`；用 `GetBuildStatus` 查询终态。只有所有启用的灯光场景均已应用结果，灯光构建才报告成功。工具不会提供进度百分比，也不会自动保存地图。地图切换或卸载会使仍在运行的操作 ID 失效。
