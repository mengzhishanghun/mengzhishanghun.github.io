---
title: 检查地图
type: doc
slug: mcp-world-editor-maps
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
  slug: maps
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/maps/
lang: zh
translationKey: doc:mcp-world-editor:maps
---

## 运行地图检查

`MapCheck` 在当前地图运行引擎地图检查，返回错误、警告、带 token 的可见消息和 `Complete`。如果 Message Log 的界面过滤隐藏消息，或结果被 `MaxMessages` 截断，`Complete=false`，不能据此报告检查通过。检查会新增当前地图的日志页，保留历史页和用户界面过滤设置。

需要保存或构建地图时，参阅[保存关卡包](/zh/works/mcp-world-editor/docs/save-level-packages/)、[构建导航并查询路径](/zh/works/mcp-world-editor/docs/navigation/)或[构建关卡灯光](/zh/works/mcp-world-editor/docs/lighting-build/)。
