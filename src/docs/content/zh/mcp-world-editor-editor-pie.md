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
  group: features
  slug: editor-pie
  order: 20
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/editor-pie/
lang: zh
translationKey: doc:mcp-world-editor:editor-pie
---

## 启动队列与取消

PIE 启动请求一进入队列，编辑器便处于忙碌状态。`PIEControl/GetState` 与 `GetEditorState` 会区分 `Idle`、`StartQueued` 和 `Playing`，`Stop` 可取消尚未开始的排队请求。

发出启动请求后，先查状态。看到 `StartQueued` 时，等到 `Playing` 再做依赖播放的操作。若在排队时取消，取消后再次查询，确认状态回到 `Idle`。
