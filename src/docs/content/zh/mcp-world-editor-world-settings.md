---
title: 修改 World Settings
type: doc
slug: mcp-world-editor-world-settings
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
docPage:
  work: mcp-world-editor
  group: levels
  slug: world-settings
  order: 5
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/world-settings/
lang: zh
translationKey: doc:mcp-world-editor:world-settings
---

## 查看并修改属性

`GetWorldSettings` 返回当前实例上所有此刻可编辑属性的精确名称与 UE 文本值，不再只显示偏离默认值的属性，也不会把只读的 BlueprintVisible 字段当作可写入口。`SetWorldSettings` 要求大小写完全匹配，拒绝编辑标志或 `CanEditChange` 禁止的属性，并以成对的 `PreEditChange`/`PostEditChangeProperty` 通知完成事务。导入失败时会先恢复旧值；若恢复也失败，错误会报告事务回滚结果，回滚失败表示编辑器状态可能已变化。
