---
title: 创建与修改用户定义 Enum
type: doc
slug: mcp-blueprint-user-defined-enums
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
  slug: user-defined-enums
  order: 9
documentKind: product-manual
websiteRoute: /zh/works/mcp-blueprint/docs/user-defined-enums/
lang: zh
translationKey: doc:mcp-blueprint:user-defined-enums
---

## 创建、读取和调整条目

| 工具 | 用途 | 注意事项 |
| --- | --- | --- |
| `CreateUserDefinedEnum` | 在 `/Game` 下创建用户定义 Enum。 | 创建后不会自动保存。 |
| `GetUserDefinedEnum` | 查看 Enum 的条目、数值和显示名。 | 大型 Enum 可分页读取。 |
| `ModifyUserDefinedEnum` | 添加、调整或删除 Enum 条目。 | 先使用 `bDryRun`；改变序列化含义时必须显式批准。 |

先读取条目、数值和显示名。修改时按条目标识选中目标，再用 `bDryRun` 查看引用影响。可能改变已有序列化值含义的操作需要单独批准。创建或修改后，需要保留的改动请另行保存。
