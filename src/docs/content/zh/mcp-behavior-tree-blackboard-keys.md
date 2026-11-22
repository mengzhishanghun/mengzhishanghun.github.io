---
title: 创建黑板并管理黑板键
type: doc
slug: mcp-behavior-tree-blackboard-keys
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-behavior-tree
docPage:
  work: mcp-behavior-tree
  group: editing
  slug: blackboard-keys
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/mcp-behavior-tree/docs/blackboard-keys/
lang: zh
translationKey: doc:mcp-behavior-tree:blackboard-keys
---

## 创建并关联黑板

用 `CreateBlackboard` 创建黑板。创建行为树时可传入黑板路径，已有树可用 `SetBehaviorTreeBlackboard` 设置关联。

## 黑板键规则

支持的键类型为 `Bool`、`Int`、`Float`、`Vector`、`Rotator`、`Name`、`String`、`Object`、`Class` 和 `Enum`。

- `Object` 与 `Class` 键可指定 `BaseClass`。
- `Enum` 键必须提供 `Enum`；无关类型若传入 `BaseClass` 或 `Enum` 会被拒绝。
- `KeyName` 不得为空或 `None`。
- 键选择器按 Unreal 原生过滤语义校验，包括 Object/Class 基类约束和 Enum 身份；同名但类型不兼容的键仍然无效。
- `RemoveBlackboardKey` 会扫描项目中的行为树；存在引用或无法完成扫描时默认拒绝删除，只有显式设置 `bForce=true` 才接受风险。

| 领域 | 工具 |
|---|---|
| 黑板 | `AddBlackboardKey`、`RemoveBlackboardKey` |

确认修改后对黑板调用 `SaveAsset`，参见[行为树的验证与保存说明](/zh/works/mcp-behavior-tree/docs/edit-tree/)。
