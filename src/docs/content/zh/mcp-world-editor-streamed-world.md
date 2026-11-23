---
title: 管理 World Partition Data Layer
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
  group: features
  slug: streamed-world
  order: 13
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/streamed-world/
lang: zh
translationKey: doc:mcp-world-editor:streamed-world
---

## 创建 Data Layer 并分配 Actor

在 World Partition 关卡中，先用 `GetWorldPartitionInfo` 查找 Data Layer，再用 `CreateDataLayer` 创建、`SetDataLayer` 添加或移除 Actor。UE 5.2 创建时需要已有的 `DataLayerAssetPath`；后续版本创建私有层。使用 `ActorNames` 批量调用 `SetDataLayer` 时默认预览，执行须传入新近的 `ExpectedHash`。`ManageDataLayer` 使用精确 `DataLayerName` 与 `Action=Query|Rename|SetParent|SetVisible|SetLoaded|SetInitialRuntimeState|Delete`。`SetParent` 用 `ParentName`（空字符串清除父层）；显示和加载状态用 `bValue`；初始运行状态可选 `Unloaded`、`Loaded`、`Activated`。删除先预览，再以返回的 `StateHash` 作为 `ExpectedHash`、设置 `bDryRun=false` 执行。资产支持的层不可独立重命名。

操作前先查清目标层；只有目标层不存在且确实需要新层时才创建。批量分配后，重新查询目标层并核对 Actor 是否如预期加入或移出。调试编辑器中的可见性或加载状态时，请选择对应动作；初始运行状态是另一个设置。
