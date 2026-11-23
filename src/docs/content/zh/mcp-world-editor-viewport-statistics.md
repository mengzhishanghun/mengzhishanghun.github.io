---
title: 切换视口统计
type: doc
slug: mcp-world-editor-viewport-statistics
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
  slug: viewport-statistics
  order: 21
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/viewport-statistics/
lang: zh
translationKey: doc:mcp-world-editor:viewport-statistics
---

## 执行受限控制台命令

`ExecuteConsoleCommand` 只接受允许列表里的七条 `stat` 命令。它调用 `GEngine->Exec`，如果引擎没有处理命令，就返回错误。UE 的 `stat` 命令切换对应的视口统计显示，重复调用可能将显示关闭；它们不是无副作用的只读测量。成功结果中的 `Handled=true` 只表示命令已由当前引擎实例处理，不表示统计显示一定处于开启状态；部分命令不会产生文本输出。

执行前先看目标统计是否已经显示。调用后直接看视口中的统计项；如果只是没有收到文本，先确认画面状态再决定是否重发命令。
