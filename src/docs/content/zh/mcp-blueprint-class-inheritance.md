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
  group: features
  slug: class-inheritance
  order: 12
documentKind: product-manual
websiteRoute: /zh/works/mcp-blueprint/docs/class-inheritance/
lang: zh
translationKey: doc:mcp-blueprint:class-inheritance
---

## 预检并更改继承关系

先用 `GetBlueprintOverview` 确认当前父类。要换成其他父类，用 `ReparentBlueprint` 传入 `NewParentClassPath`（原生完整路径、唯一已加载短名或 Blueprint 生成类）。先使用 `bDryRun=true` 查看风险；新父类不是旧父类的子类、旧父类缺失或接口冲突时，必须明确 `bAllowPotentialDataLoss=true`。应用后，工具会刷新图；若操作失败会尝试用 Undo 回滚。保存前可重新查看蓝图概览，核对当前父类。

类继承与组件附着是两个编辑对象。要移动同一蓝图中的组件，请使用 `ReparentComponent`；需要保留类继承改动时，调用 `SaveAsset`。
