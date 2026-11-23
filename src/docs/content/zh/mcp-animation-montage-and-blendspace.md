---
title: 创建 Montage 并编辑区段
type: doc
slug: mcp-animation-montage-and-blendspace
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
  slug: montage-and-blendspace
  order: 3
documentKind: product-manual
websiteRoute: /zh/works/mcp-animation/docs/montage-and-blendspace/
lang: zh
translationKey: doc:mcp-animation:montage-and-blendspace
---

## 查找、创建与编辑 Montage

| 工具 | 用途 |
|---|---|
| `ListMontages` / `GetMontageDetail` | 发现 Montage，并读取 Section、Slot、片段、Notify 与混合设置。 |

| 工具 | 用途 |
|---|---|
| `CreateMontage` | 从 AnimSequence 创建 Montage。 |
| `AddMontageSection` / `SetMontageSection` / `RemoveMontageSection` | 管理 Montage Section。 |

已有 Montage 时，先从列表取得资产路径，用详情定位要修改的 Section。新建时，先找出要用的 AnimSequence，再调用 `CreateMontage`。添加、调整或移除 Section 后，重新查看详情，确认修改的是预期区段。

写入前后请遵循[打开与保存动画资产](/zh/works/mcp-animation/docs/find-assets/)一节的路径、事务和保存规则。
