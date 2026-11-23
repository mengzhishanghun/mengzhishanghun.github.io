---
title: 截取序列预览
type: doc
slug: mcp-level-sequence-sequence-preview
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-level-sequence
docPage:
  work: mcp-level-sequence
  group: features
  slug: sequence-preview
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/mcp-level-sequence/docs/sequence-preview/
lang: zh
translationKey: doc:mcp-level-sequence:sequence-preview
---

## 截取活动视口

| 分组 | 工具 | 用途 |
|---|---|---|
| 预览 | `CaptureSequencerView` | 截取活动关卡编辑器视口并返回 PNG |

先让活动关卡视口显示想要的画面，再对已加载或可读取的目标序列调用 `CaptureSequencerView`。返回的 PNG 对应当时的视口画面。截图最多 16 Mi 像素，压缩后的 PNG 最多 8 MiB。
