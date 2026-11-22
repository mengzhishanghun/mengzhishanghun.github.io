---
title: 创建和编辑 Level Instance
type: doc
slug: mcp-world-editor-level-instances
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
docPage:
  work: mcp-world-editor
  group: world-partition
  slug: level-instances
  order: 4
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/level-instances/
lang: zh
translationKey: doc:mcp-world-editor:level-instances
---

## 创建与会话编辑

`ManageLevelInstance` 的 `Action=Query` 可列出实例。`Create` 需要 `ActorNames` 与新的 `/Game/...` `LevelPackagePath`；先预览，再用 `ExpectedHash` 执行。创建时先保存新目标关卡，但源关卡仍为 dirty：结果的 `SourceSaved=false` 与 `PendingSavePackages` 指明待保存包。移除源 Actor 前会检查已知已加载硬引用；未加载引用与软引用不扫描。阅读 `SoftReferenceRisk`，在预览与正式执行中设置 `bAcknowledgeUnscannedSoftReferences=true`，使用包含该确认的预览哈希，并另行保存报告的源包。创建失败可能留下目标地图或部分源变更，重试前先检查返回状态。

对精确 `InstanceActor` 使用 `EnterEdit`；返回的 `OperationId` 代表编辑会话，`MoveActors`、`Commit`、`Discard` 均须传入。`MoveActors` 先预览 Actor 批次，以新的 `ExpectedHash` 执行。`Break` 将实例展开为 Actor。`PackBlueprint` 在精确的 `/Game/...` `BlueprintPath` 创建或更新 Packed Level Actor Blueprint；`bPendingSave=true` 表示仍需保存 Blueprint。这些操作不代表源关卡或全部结果资产已保存。

## Packed Blueprint 的保存与撤销

Packed Blueprint 创建不弹出资产对话框，也不自动保存。在 UE 5.3 及更新版本中，引擎打包阶段会重置编辑器的全局 Undo 历史；如需撤销已有编辑，请在打包前完成。`PendingSavePackages` 列出包含已加载实例在内的潜在待保存包。创建失败可能保留新建的内存资产；错误信息会说明失败阶段和需要检查的包。
