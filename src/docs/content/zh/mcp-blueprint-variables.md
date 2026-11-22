---
title: 管理成员变量与局部变量
type: doc
slug: mcp-blueprint-variables
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
  slug: variables
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-blueprint/docs/variables/
lang: zh
translationKey: doc:mcp-blueprint:variables
---

## 读取、添加和删除变量

| 工具 | 用途 | 注意事项 |
| --- | --- | --- |
| `AddVariable` | 为蓝图添加成员变量。 | 需要蓝图路径、变量名和 `TypeName`。 |
| `RemoveVariable` | 删除成员变量。 | 有引用或无法安全恢复时会被阻止。 |
| `AddLocalVariable` | 在函数图中添加局部变量。 | 需要函数名、变量名和类型。 |
| `RemoveLocalVariable` | 删除函数局部变量。 | 有引用或无法安全恢复时会被阻止。 |

局部变量操作需要函数图和变量声明标识。

## 修改成员变量的声明与默认值

先用 `GetBlueprintOverview` 找到本蓝图声明的目标变量。只传入需要变化的字段：`TypeName`、`DefaultValue`、`NewName`、`bInstanceEditable`、`Category` 或 `Tooltip`。`DefaultValue` 使用 UE 文本格式；空 `Category` 恢复 UE 默认分类，空 `Tooltip` 删除提示。变量被引用时不能改类型；带 RepNotify 的变量不能通过此工具非交互改名。需要保留改动时再使用 `SaveAsset`。

声明默认值属于当前蓝图声明的成员变量。节点输入字面量用 `SetPinDefaults`；关卡中已有实例的覆盖值不由 `ModifyVariable` 修改。
