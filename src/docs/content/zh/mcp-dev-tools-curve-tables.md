---
title: 创建 CurveTable 并编辑行
type: doc
slug: mcp-dev-tools-curve-tables
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
  slug: curve-tables
  order: 7
documentKind: product-manual
websiteRoute: /zh/works/mcp-dev-tools/docs/curve-tables/
lang: zh
translationKey: doc:mcp-dev-tools:curve-tables
---

## 读取与写入

| 类型 | 工具 | 用途与主要参数 |
|---|---|---|
| CurveTable | `GetCurveTable`、`CreateCurveTable`、`PatchCurveTableRows` | 按页读取 Simple 或 Rich 行；创建时指定 `Mode`；用 `Mode`、`Changes` 和完整旧行 `ExpectedValues` 执行 Add、Replace、Remove。不转换 Simple/Rich 模式。 |

替换已有行时，先从读回的表中确认模式和目标行，再在请求中沿用该模式，提交完整旧行和替换内容。列表和分页读取默认每页 20 项，最多 100 项。没在当前页找到目标行时，先看 `bHasMore`，再用 `NextOffset` 继续。

创建或修改前先预览，确认后单独保存；见[预览和保存规则](/zh/works/mcp-dev-tools/docs/connect/)。
