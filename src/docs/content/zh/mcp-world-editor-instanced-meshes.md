---
title: 转换实例化网格
type: doc
slug: mcp-world-editor-instanced-meshes
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
  slug: instanced-meshes
  order: 3
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/instanced-meshes/
lang: zh
translationKey: doc:mcp-world-editor:instanced-meshes
---

## 转换方向与对象校验

`ConvertInstancedMeshes` 可将简单 `StaticMeshActor` 转为分组的 ISM/HISM 实例（`Direction=ActorsToInstances`、精确 `ActorPaths`，可选 `bUseHISM`），或将非植被组件中的指定实例转回 Actor（`Direction=InstancesToActors`、精确 `ComponentPath` 和 `Indices`）。先预览，再用 `ExpectedCurrentSnapshotHash` 与 `ExpectedPlanHash` 执行。默认保留源。设置 `bDeleteSource=true` 时会检查可识别的已加载 Actor 引用、组件引用者及关卡脚本引用；发现外部硬引用即拒绝删除，即使已设置 `bAllowLossyConversion=true`。预览和结果会报告 `ReferenceCoverageComplete=false`、`ReferenceCoverage` 和 `UninspectableReferenceSources`：`GCObjectReferencer` 背后的原生 `FGCObject` 所有者无法完整检查，未加载分区及项目范围软引用也未扫描。原生硬引用不会迁移，删除源可能破坏其语义。删除 Actor 还须设置 `bAllowLossyConversion=true` 并使用新预览的双哈希。计划哈希包含引用策略及观测到的覆盖情况，但不能证明不透明原生引用集合未改变。转换先创建并核验目标，再删除源；无法保留 Actor 身份及所有 Actor 专有或实例自定义数据。
