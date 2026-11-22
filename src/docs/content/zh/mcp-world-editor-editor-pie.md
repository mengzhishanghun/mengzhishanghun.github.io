---
title: 查看与控制 PIE 状态
type: doc
slug: mcp-world-editor-editor-pie
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
docPage:
  work: mcp-world-editor
  group: editor
  slug: editor-pie
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/editor-pie/
lang: zh
translationKey: doc:mcp-world-editor:editor-pie
---

## 启动队列与取消

PIE 启动请求排队后即视为编辑器忙碌；`PIEControl/GetState` 与 `GetEditorState` 会区分 `Idle`、`StartQueued` 和 `Playing`，`Stop` 可取消尚未开始的排队请求。
