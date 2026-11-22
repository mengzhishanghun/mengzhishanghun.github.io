---
title: 创建并编辑 PrimaryAssetLabel
type: doc
slug: mcp-dev-tools-primary-asset-labels
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-dev-tools
docPage:
  work: mcp-dev-tools
  group: assets
  slug: primary-asset-labels
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/mcp-dev-tools/docs/primary-asset-labels/
lang: zh
translationKey: doc:mcp-dev-tools:primary-asset-labels
---

## 读取与写入

| 类型 | 工具 | 用途与主要参数 |
|---|---|---|
| PrimaryAssetLabel | `GetPrimaryAssetLabel`、`CreatePrimaryAssetLabel`、`SetPrimaryAssetLabel` | 读取原生标签、创建新标签，或用 `Properties` 与 `ExpectedValues` 修改可编辑字段；派生 bundle 数据只读。 |

Cook 结果、实际 Chunk 产出和非空 ExplicitBlueprints 的行为尚未确认。

创建或修改前先预览，确认后单独保存；见[预览和保存规则](/zh/works/mcp-dev-tools/docs/connect/)。
