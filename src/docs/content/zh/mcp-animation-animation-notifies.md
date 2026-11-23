---
title: 查找并编辑动画 Notify
type: doc
slug: mcp-animation-animation-notifies
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-animation
docPage:
  work: mcp-animation
  group: features
  slug: animation-notifies
  order: 4
documentKind: product-manual
websiteRoute: /zh/works/mcp-animation/docs/animation-notifies/
lang: zh
translationKey: doc:mcp-animation:animation-notifies
---

## 类查找与通知编辑

| 工具 | 用途 |
|---|---|
| `ListNotifyClasses` | 发现原生及 Blueprint AnimNotify/AnimNotifyState 类。 |

| 工具 | 用途 |
|---|---|
| `AddNotify` / `RemoveNotify` | 在 AnimSequence 或 Montage 上添加、移除 Notify。 |

添加前，用 `ListNotifyClasses` 找到要使用的通知类，再确认目标是 AnimSequence 还是 Montage。删除时，先在资产详情里找到要移除的现有通知。改完后重新查看同一资产的 Notify 列表。

写入前后请遵循[打开与保存动画资产](/zh/works/mcp-animation/docs/find-assets/)一节的路径、事务和保存规则。
