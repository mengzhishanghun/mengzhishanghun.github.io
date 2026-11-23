---
title: 移除流式关卡与移动 Actor
type: doc
slug: mcp-world-editor-streaming-levels
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
  slug: streaming-levels
  order: 12
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/streaming-levels/
lang: zh
translationKey: doc:mcp-world-editor:streaming-levels
---

## 移除流式关卡

`RemoveStreamingLevel` 操作本身不可撤销。它会请求 Unreal Engine 保留既有 Undo 缓冲，但引擎仍可能因过期引用而重置该缓冲，因此不能保证 Undo 历史一定保留。工具只移除属于目标关卡的 Actor、Component、Object 与 BSP Selection；它会快照并核验目标关卡之外已选 Actor、Component 与 Object 的恢复，其他关卡中的 BSP Selection 则保持原状而不会被全局清除。若移除失败，工具还会尝试恢复目标关卡内的选择，并报告恢复是否通过核验。

如果只是想把 Actor 放进另一个关卡，用下面的移动操作。确实要移除流式关卡时，先核对目标关卡，并在执行前处理仍想撤销的编辑。

## 移动 Actor 到关卡

`MoveActorsToLevel` 会尝试恢复并核验调用前的 Actor、Component、Object 与 BSP Selection；无法确认完整恢复时会返回错误。Selection Lock 启用或 Actor 身份无法唯一映射时，工具会在移动前拒绝请求。若批次结果不一致，工具不会自动执行 Undo，因为无法证明栈顶事务属于本次调用；继续操作前必须同时检查 Actor 所在关卡与 Selection 状态。

移动前先确认目标关卡和本批 Actor 路径；移动后重新查询 Actor，确认所在关卡和新的路径，再进行后续编辑。
