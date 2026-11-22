---
title: 创建 StringTable 并编辑条目
type: doc
slug: mcp-dev-tools-string-tables
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
  slug: string-tables
  order: 5
documentKind: product-manual
websiteRoute: /zh/works/mcp-dev-tools/docs/string-tables/
lang: zh
translationKey: doc:mcp-dev-tools:string-tables
---

## 读取与写入

| 类型 | 工具 | 用途与主要参数 |
|---|---|---|
| StringTable | `GetStringTable`、`CreateStringTable`、`PatchStringTable` | 按页读取键、源文本与元数据；创建时指定固定的 `Namespace`；修改时提供 `Namespace`、`TableId`、`Changes` 与完整旧条目 `ExpectedValues`，支持 Add、Update、Remove。 |

常规列表和分页读取默认返回 20 项，每页最多 100 项；根据 `bHasMore` 和 `NextOffset` 继续读取。

创建或修改前先预览，确认后单独保存；见[预览和保存规则](/zh/works/mcp-dev-tools/docs/connect/)。
