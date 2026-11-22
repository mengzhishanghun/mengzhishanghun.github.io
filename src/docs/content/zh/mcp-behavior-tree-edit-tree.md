---
title: 编辑行为树并设置黑板键
type: doc
slug: mcp-behavior-tree-edit-tree
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-behavior-tree
docPage:
  work: mcp-behavior-tree
  group: workflows
  slug: edit-tree
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/mcp-behavior-tree/docs/edit-tree/
lang: zh
translationKey: doc:mcp-behavior-tree:edit-tree
---

## 黑板键规则

支持的键类型为 `Bool`、`Int`、`Float`、`Vector`、`Rotator`、`Name`、`String`、`Object`、`Class` 和 `Enum`。

- `Object` 与 `Class` 键可指定 `BaseClass`。
- `Enum` 键必须提供 `Enum`；无关类型若传入 `BaseClass` 或 `Enum` 会被拒绝。
- `KeyName` 不得为空或 `None`。
- 键选择器按 Unreal 原生过滤语义校验，包括 Object/Class 基类约束和 Enum 身份；同名但类型不兼容的键仍然无效。
- `RemoveBlackboardKey` 会扫描项目中的行为树；存在引用或无法完成扫描时默认拒绝删除，只有显式设置 `bForce=true` 才接受风险。

## 编辑行为

编辑工具使用 Unreal 事务，并将受影响的包标记为脏。节点属性采用 Unreal import-text 字符串：布尔值使用 `true`/`false`，枚举使用名称，向量使用 `(X=0.0,Y=0.0,Z=0.0)`。属性映射只接受字符串值；导入失败时会保留该属性原值。黑板选择器属性接收黑板键名，并按选择器的原生类型过滤器验证。

`SimpleParallel` 具有 `Default` 与 `Background` 输出引脚。添加或移动后台子树时使用 `ParentOutputPin="Background"`。保存前应运行验证；验证会报告结构错误、缺失类、无效键绑定、无效装饰器中止模式和未连接节点。
