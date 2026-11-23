---
title: 创建与修改用户定义 Struct
type: doc
slug: mcp-blueprint-user-defined-structs
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-blueprint
docPage:
  work: mcp-blueprint
  group: features
  slug: user-defined-structs
  order: 8
documentKind: product-manual
websiteRoute: /zh/works/mcp-blueprint/docs/user-defined-structs/
lang: zh
translationKey: doc:mcp-blueprint:user-defined-structs
---

## 创建、读取和调整字段

| 工具 | 用途 | 注意事项 |
| --- | --- | --- |
| `CreateUserDefinedStruct` | 在 `/Game` 下创建用户定义 Struct。 | 创建后不会自动保存。 |
| `GetUserDefinedStruct` | 查看 Struct 的字段定义。 | 大型 Struct 可分页读取。 |
| `ModifyUserDefinedStruct` | 添加、调整或删除 Struct 字段。 | 先使用 `bDryRun`；可能造成数据丢失时必须显式批准。 |

编辑现有 Struct 时，先读出字段定义，用字段标识选中目标，再用 `bDryRun` 查看会影响哪些引用。可能丢失数据的改动需要单独批准。确认后再应用；创建或修改后，需要保留的改动请另行保存。
