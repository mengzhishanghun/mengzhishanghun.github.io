---
title: 加载区域并管理分层内容
type: doc
slug: mcp-world-editor-streamed-world
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
docPage:
  work: mcp-world-editor
  group: workflows
  slug: streamed-world
  order: 3
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/streamed-world/
lang: zh
translationKey: doc:mcp-world-editor:streamed-world
---

### World Partition Data Layer 与 Level Instance

在 World Partition 关卡中，先用 `GetWorldPartitionInfo` 查找 Data Layer，再用 `CreateDataLayer` 创建、`SetDataLayer` 添加或移除 Actor。UE 5.2 创建时需要已有的 `DataLayerAssetPath`；后续版本创建私有层。使用 `ActorNames` 批量调用 `SetDataLayer` 时默认预览，执行须传入新近的 `ExpectedHash`。`ManageDataLayer` 使用精确 `DataLayerName` 与 `Action=Query|Rename|SetParent|SetVisible|SetLoaded|SetInitialRuntimeState|Delete`。`SetParent` 用 `ParentName`（空字符串清除父层）；显示和加载状态用 `bValue`；初始运行状态可选 `Unloaded`、`Loaded`、`Activated`。删除先预览，再以返回的 `StateHash` 作为 `ExpectedHash`、设置 `bDryRun=false` 执行。资产支持的层不可独立重命名。

`ManageLevelInstance` 的 `Action=Query` 可列出实例。`Create` 需要 `ActorNames` 与新的 `/Game/...` `LevelPackagePath`；先预览，再用 `ExpectedHash` 执行。创建时先保存新目标关卡，但源关卡仍为 dirty：结果的 `SourceSaved=false` 与 `PendingSavePackages` 指明待保存包。移除源 Actor 前会检查已知已加载硬引用；未加载引用与软引用不扫描。阅读 `SoftReferenceRisk`，在预览与正式执行中设置 `bAcknowledgeUnscannedSoftReferences=true`，使用包含该确认的预览哈希，并另行保存报告的源包。创建失败可能留下目标地图或部分源变更，重试前先检查返回状态。

对精确 `InstanceActor` 使用 `EnterEdit`；返回的 `OperationId` 代表编辑会话，`MoveActors`、`Commit`、`Discard` 均须传入。`MoveActors` 先预览 Actor 批次，以新的 `ExpectedHash` 执行。`Break` 将实例展开为 Actor。`PackBlueprint` 在精确的 `/Game/...` `BlueprintPath` 创建或更新 Packed Level Actor Blueprint；`bPendingSave=true` 表示仍需保存 Blueprint。这些操作不代表源关卡或全部结果资产已保存。

Packed Blueprint 创建不弹出资产对话框，也不自动保存。在 UE 5.3 及更新版本中，引擎打包阶段会重置编辑器的全局 Undo 历史；如需撤销已有编辑，请在打包前完成。`PendingSavePackages` 列出包含已加载实例在内的潜在待保存包。创建失败可能保留新建的内存资产；错误信息会说明失败阶段和需要检查的包。

## World Partition 区域加载

`LoadRegion` 通过 Unreal Engine 公开的 World Partition 加载器 API 创建并加载持久的编辑器区域。`BoundsMin` 与 `BoundsMax` 都必须包含有限的数值字段 `X`、`Y`、`Z`，且每个轴的最小值必须严格小于对应最大值。无效边界会在创建加载器之前被拒绝。

## World Partition 区域生命周期

`LoadRegion` 只接受有限且逐轴递增的边界；单轴最长 1,000,000 Unreal 单位、总体积最多 1e17 立方单位，同时最多保留 16 个由 MCP 创建的活动区域。成功结果返回不可推测的 `RegionHandle`，调用 `UnloadRegion` 可卸载并释放对应的官方 Editor Loader Adapter。句柄不会按 bounds 猜测或复用；切换/清理 World 以及卸载插件模块时，插件会自动释放仍由它管理的区域，此后旧句柄会失效。
