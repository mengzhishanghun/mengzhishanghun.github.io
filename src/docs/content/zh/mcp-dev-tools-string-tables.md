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
  group: features
  slug: string-tables
  order: 8
documentKind: product-manual
websiteRoute: /zh/works/mcp-dev-tools/docs/string-tables/
lang: zh
translationKey: doc:mcp-dev-tools:string-tables
---

## 读取与写入

| 类型 | 工具 | 用途与主要参数 |
|---|---|---|
| StringTable | `GetStringTable`、`CreateStringTable`、`PatchStringTable` | 按页读取键、源文本与元数据；创建时指定固定的 `Namespace`；修改时提供 `Namespace`、`TableId`、`Changes` 与完整旧条目 `ExpectedValues`，支持 Add、Update、Remove。 |

例如，只改一个键的源文本时，先按键找到条目。旧值用读回的完整条目，不能只填旧文本；同时沿用表当前的 `Namespace` 和 `TableId`。列表和分页读取默认每页 20 项，最多 100 项。有下一页时，按 `bHasMore` 和 `NextOffset` 继续查找。

创建或修改前先预览，确认后单独保存；见[预览和保存规则](/zh/works/mcp-dev-tools/docs/connect/)。
