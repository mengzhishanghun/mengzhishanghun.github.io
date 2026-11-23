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
  group: features
  slug: data-tables
  order: 5
documentKind: product-manual
websiteRoute: /zh/works/mcp-dev-tools/docs/data-tables/
lang: zh
translationKey: doc:mcp-dev-tools:data-tables
---

## 读取与写入

| 类型 | 工具 | 用途与主要参数 |
|---|---|---|
| DataTable | `GetDataTable`、`CreateDataTable`、`PatchDataTableRows` | 按页读取完整行；创建时指定已有的 `RowStructPath`；修改时提供当前 `RowStructPath`、`Changes` 和完整旧行 `ExpectedValues`，支持 Add、Update、Remove。不会生成或转换行结构。 |

例如，要更新现有行里的一列，先读到目标行，把整条旧行放进 `ExpectedValues`，再在 `Changes` 中说明要做 Update。即使只改一列，旧值也要保留整行。如果目标行不在当前页，先查看 `bHasMore`，再用 `NextOffset` 继续。列表和分页读取默认每页 20 项，最多 100 项。

创建或修改前先预览，确认后单独保存；见[预览和保存规则](/zh/works/mcp-dev-tools/docs/connect/)。
