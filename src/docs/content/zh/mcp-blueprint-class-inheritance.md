---
title: 更改蓝图父类
type: doc
slug: mcp-blueprint-class-inheritance
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-blueprint
docPage:
  work: mcp-blueprint
  group: class-structure
  slug: class-inheritance
  order: 3
documentKind: product-manual
websiteRoute: /zh/works/mcp-blueprint/docs/class-inheritance/
lang: zh
translationKey: doc:mcp-blueprint:class-inheritance
---

## 预检并更改继承关系

用 `ReparentBlueprint` 更改类继承。传入 `NewParentClassPath`（原生完整路径、唯一已加载短名或 Blueprint 生成类）。先使用 `bDryRun=true` 查看风险；新父类不是旧父类的子类、旧父类缺失或接口冲突时，必须明确 `bAllowPotentialDataLoss=true`。它会刷新图；若操作失败会尝试 Undo 回滚。

类继承与组件附着是两个编辑对象。要移动同一蓝图中的组件，请使用 `ReparentComponent`；需要保留类继承改动时，调用 `SaveAsset`。
