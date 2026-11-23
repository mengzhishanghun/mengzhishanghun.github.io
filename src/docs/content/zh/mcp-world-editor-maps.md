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
  group: features
  slug: maps
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/maps/
lang: zh
translationKey: doc:mcp-world-editor:maps
---

## 运行地图检查

打开要检查的地图，再运行 `MapCheck`。先看 `Complete`，再读错误、警告和带 token 的可见消息。如果 Message Log 的界面过滤隐藏了消息，或 `MaxMessages` 截断了结果，`Complete=false`。此时先检查过滤设置或消息上限，再重新检查；不能用这次不完整的结果判断地图是否通过。每次检查都会为当前地图新增日志页，历史页和界面过滤设置会保留。

需要保存或构建地图时，参阅[保存关卡包](/zh/works/mcp-world-editor/docs/save-level-packages/)、[构建导航并查询路径](/zh/works/mcp-world-editor/docs/navigation/)或[构建关卡灯光](/zh/works/mcp-world-editor/docs/lighting-build/)。
