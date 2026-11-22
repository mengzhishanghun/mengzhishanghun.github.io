---
title: 创建 DataTable 并编辑行
type: doc
slug: mcp-dev-tools-data-tables
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
  slug: data-tables
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/mcp-dev-tools/docs/data-tables/
lang: zh
translationKey: doc:mcp-dev-tools:data-tables
---

## 读取与写入

| 类型 | 工具 | 用途与主要参数 |
|---|---|---|
| DataTable | `GetDataTable`、`CreateDataTable`、`PatchDataTableRows` | 按页读取完整行；创建时指定已有的 `RowStructPath`；修改时提供当前 `RowStructPath`、`Changes` 和完整旧行 `ExpectedValues`，支持 Add、Update、Remove。不会生成或转换行结构。 |

常规列表和分页读取默认返回 20 项，每页最多 100 项；根据 `bHasMore` 和 `NextOffset` 继续读取。

创建或修改前先预览，确认后单独保存；见[预览和保存规则](/zh/works/mcp-dev-tools/docs/connect/)。
