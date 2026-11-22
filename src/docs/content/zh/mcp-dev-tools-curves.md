---
title: 创建 Curve 并替换通道
type: doc
slug: mcp-dev-tools-curves
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-dev-tools
docPage:
  work: mcp-dev-tools
  group: data
  slug: curves
  order: 3
documentKind: product-manual
websiteRoute: /zh/works/mcp-dev-tools/docs/curves/
lang: zh
translationKey: doc:mcp-dev-tools:curves
---

## 读取与写入

| 类型 | 工具 | 用途与主要参数 |
|---|---|---|
| Curve | `GetCurve`、`CreateCurve`、`SetCurve` | 读取或创建 Float、Vector、LinearColor 曲线；用 `Channels` 和对应完整旧通道 `ExpectedValues` 替换指定通道。未指定的通道保持原值。 |

创建或修改前先预览，确认后单独保存；见[预览和保存规则](/zh/works/mcp-dev-tools/docs/connect/)。
