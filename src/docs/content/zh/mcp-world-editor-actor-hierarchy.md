---
title: 管理 Actor 编组与附加关系
type: doc
slug: mcp-world-editor-actor-hierarchy
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
docPage:
  work: mcp-world-editor
  group: actors
  slug: actor-hierarchy
  order: 5
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/actor-hierarchy/
lang: zh
translationKey: doc:mcp-world-editor:actor-hierarchy
---

## Actor 编组

`GroupActors` 会在执行变更前解析并校验完整 Actor 列表、拒绝重复目标与跨关卡编组，并直接调用 Unreal Engine 接受 Actor 数组的编组 API。工具不会为了执行操作而清空或替换编辑器 Selection，因此会保留仍然存活的 Actor 的既有选择；若一个已选中的 GroupActor 被明确取消编组并销毁，该已移除对象会自然从 Selection 中消失。

## Actor 附加事务

`AttachActor` 与 `DetachActor` 会把 Actor 及实际参与父子关系变更的场景组件一并纳入编辑器事务，因此 Undo/Redo 能恢复组件层级、socket 与变换。若引擎拒绝操作或操作后的父级状态不符合请求，工具会尝试显式恢复原父组件、socket 与变换后返回错误；错误中的 `Original attachment restored` 表明恢复是否已通过验证，值为 `false` 时必须将编辑器状态视为可能已变化并先行检查。
