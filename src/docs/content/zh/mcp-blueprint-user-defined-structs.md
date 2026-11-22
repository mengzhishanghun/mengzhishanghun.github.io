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
  group: members-types
  slug: user-defined-structs
  order: 5
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

修改时用字段标识定位目标，先用 `bDryRun` 检查引用影响。可能丢失数据的操作需要单独明确批准。
