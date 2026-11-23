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
  group: features
  slug: world-settings
  order: 5
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/world-settings/
lang: zh
translationKey: doc:mcp-world-editor:world-settings
---

## 查看并修改属性

`GetWorldSettings` 返回当前实例上所有此刻可编辑属性的精确名称与 UE 文本值，其中包括仍为默认值的属性；只读的 BlueprintVisible 字段不在可写范围内。`SetWorldSettings` 要求大小写完全匹配，拒绝编辑标志或 `CanEditChange` 禁止的属性，并以成对的 `PreEditChange`/`PostEditChangeProperty` 通知完成事务。导入失败时会先恢复旧值；若恢复也失败，错误会报告事务回滚结果，回滚失败表示编辑器状态可能已变化。

先用读取结果确认名字和当前文本值，再提交要改的属性。写入后重新查询同一属性；如果回滚失败，也从读回的实际值判断要不要继续，别直接重发修改。
