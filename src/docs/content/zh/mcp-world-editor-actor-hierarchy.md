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
  group: features
  slug: actor-hierarchy
  order: 10
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/actor-hierarchy/
lang: zh
translationKey: doc:mcp-world-editor:actor-hierarchy
---

## Actor 编组

`GroupActors` 会在执行变更前解析并校验完整 Actor 列表、拒绝重复目标与跨关卡编组，并把名单交给 Unreal Engine 的 Actor 数组编组 API。编组时不会清空或替换编辑器 Selection，仍存在的 Actor 会保持选中。若已选中的 GroupActor 因取消编组而被销毁，它也会从 Selection 中消失。

想把同一关卡里的多个 Actor 编成一组时，用 `GroupActors` 一次传入完整名单。操作后对照编组结果和原有选择；如果目标是让一个 Actor 附加到另一个 Actor 上，请用下面的附加操作。

## Actor 附加事务

`AttachActor` 与 `DetachActor` 会把 Actor 及实际参与父子关系变更的场景组件一并纳入编辑器事务，因此 Undo/Redo 能恢复组件层级、socket 与变换。若引擎拒绝操作或操作后的父级状态不符合请求，工具会尝试显式恢复原父组件、socket 与变换后返回错误；错误中的 `Original attachment restored` 表明恢复是否已通过验证，值为 `false` 时必须将编辑器状态视为可能已变化并先行检查。

报错且未确认恢复时，先检查实际的父组件、socket 和变换，再决定是否继续编辑。
