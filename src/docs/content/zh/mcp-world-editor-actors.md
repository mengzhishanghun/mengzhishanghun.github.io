---
title: 摆放、组织和附加 Actor
type: doc
slug: mcp-world-editor-actors
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
  slug: actors
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/actors/
lang: zh
translationKey: doc:mcp-world-editor:actors
---

### 植被与实例化网格

先用 `ListFoliageTypes` 查找已加载的植被类型及精确路径。`AddFoliageInstances` 通过静态网格 `MeshPath` 和世界坐标 `Transforms` 添加实例；旧的 `Locations` 只指定位置，旋转和缩放为默认值。编辑已加载植被时，用 `FoliageInstances` 的 `Operation=Query`、精确 `IFAPath` 和 `FoliageTypePath` 查询，通过 `Offset`、`Limit`（最多 100）分页。`Update`、`Remove` 或 `Move` 指定 `Indices` 前，先按默认 `bDryRun=true` 预览，再用相同请求、`bDryRun=false`、`ExpectedCurrentSnapshotHash` 和 `ExpectedPlanHash` 执行。`Update` 的变换数必须与索引数一致。`Move` 还需要另一个已加载的 `TargetIFAPath` 和 `ExpectedTargetSnapshotHash`；World Partition 中源与目标植被分区都须已加载，位置也须属于所选分区。索引仅对对应快照有效。

`ScatterFoliage` 在 WorldStatic 地面上预览确定性的散布候选。提供已有植被类型的精确 IFA/类型路径、XY 矩形（`MinX`、`MinY`、`MaxX`、`MaxY`）、允许的 Z 范围、`Seed`、`MaxSlopeDegrees`、`MinSpacing`，以及 `Count`（最多 100）或 `Density`；`MaxSamples` 限制采样次数。查看预览后，带两个返回的哈希执行。非植被 ISM/HISM 组件使用 `InstancedMeshes`：通过精确 `ComponentPath` 分页 `Query`，或用世界坐标 `Transforms` 和快照索引预览并执行 `Add`、`Update`、`Remove`。植被组件应使用 `FoliageInstances`。

`ConvertInstancedMeshes` 可将简单 `StaticMeshActor` 转为分组的 ISM/HISM 实例（`Direction=ActorsToInstances`、精确 `ActorPaths`，可选 `bUseHISM`），或将非植被组件中的指定实例转回 Actor（`Direction=InstancesToActors`、精确 `ComponentPath` 和 `Indices`）。先预览，再用 `ExpectedCurrentSnapshotHash` 与 `ExpectedPlanHash` 执行。默认保留源。设置 `bDeleteSource=true` 时会检查可识别的已加载 Actor 引用、组件引用者及关卡脚本引用；发现外部硬引用即拒绝删除，即使已设置 `bAllowLossyConversion=true`。预览和结果会报告 `ReferenceCoverageComplete=false`、`ReferenceCoverage` 和 `UninspectableReferenceSources`：`GCObjectReferencer` 背后的原生 `FGCObject` 所有者无法完整检查，未加载分区及项目范围软引用也未扫描。原生硬引用不会迁移，删除源可能破坏其语义。删除 Actor 还须设置 `bAllowLossyConversion=true` 并使用新预览的双哈希。计划哈希包含引用策略及观测到的覆盖情况，但不能证明不透明原生引用集合未改变。转换先创建并核验目标，再删除源；无法保留 Actor 身份及所有 Actor 专有或实例自定义数据。

### Actor 摆放与样条

`PlaceActors` 用 `Mode=Ground`、`Surface`、`Grid`、`Bounds` 或 `Vertex` 与 `ActorNames`（最多 100 个精确路径或唯一名称）移动现有 Actor。Ground、Surface 向下射线探测，并将变换后包围盒底部落在命中面；`bAlignNormal` 可让 Surface 的局部 +Z 对齐法线。Grid 用 `GridSize` 对世界坐标枢轴取整。Bounds 以 `ReferenceActor` 为参照，按 `Axis`、`Side`、`Gap` 依次放置。Vertex 在 `SearchRadius` 和 `MaxVertices` 范围内，寻找 `ReferenceActor` 的指定静态网格 `ReferenceComponent`、`LOD` 上最近的顶点。`Mode=Array` 则复制 `SourceActor` `Count` 次（1–100），用 `Spacing`、各轴扰动和 `Seed` 控制世界变换。保存前查看返回的最终变换。

普通样条组件先用 `GetSplineData` 的 `ActorName`、精确 `ComponentName` 和可选 `CoordinateSpace=Local|World` 查询。把返回的 `SnapshotHash` 传给 `ApplySplinePatch`，通过有序 `Operations` 执行 `Add`、`Remove`、`SetLocation`、`SetTangents`、`SetRotation`、`SetScale`、`SetType` 或 `SetClosedLoop`。先预览，正式执行需 `bDryRun=false` 与预览的 `PlanHash`；插入和删除会改变同一批后续操作的索引。`SetSplineMesh` 用局部坐标的 `Start`、`StartTangent`、`End`、`EndTangent` 编辑一个样条网格组件，也可指定截面缩放、滚转、前向轴和静态网格。Landscape 样条使用下文的专用工具。

`ApplySplinePatch` 支持 Blueprint SCS 样条组件，构造脚本重跑后会重新核验当前组件。已经由构造脚本改写，或配置为将点交给构造脚本处理的样条会在写入前拒绝。重建或读回失败时，Undo 事务中可能保留变更；重试前先检查返回状态。

## Actor 编组

`GroupActors` 会在执行变更前解析并校验完整 Actor 列表、拒绝重复目标与跨关卡编组，并直接调用 Unreal Engine 接受 Actor 数组的编组 API。工具不会为了执行操作而清空或替换编辑器 Selection，因此会保留仍然存活的 Actor 的既有选择；若一个已选中的 GroupActor 被明确取消编组并销毁，该已移除对象会自然从 Selection 中消失。

## Actor 附加事务

`AttachActor` 与 `DetachActor` 会把 Actor 及实际参与父子关系变更的场景组件一并纳入编辑器事务，因此 Undo/Redo 能恢复组件层级、socket 与变换。若引擎拒绝操作或操作后的父级状态不符合请求，工具会尝试显式恢复原父组件、socket 与变换后返回错误；错误中的 `Original attachment restored` 表明恢复是否已通过验证，值为 `false` 时必须将编辑器状态视为可能已变化并先行检查。

## 组件创建安全

`AddComponent` 接受精确的完整组件类路径，或在当前已加载类中唯一匹配的短类名；短名存在多个候选时会返回排序后的完整路径并拒绝创建。工具会拒绝非 `ActorComponent`、抽象、弃用、已被新版本替代以及 `ClassWithin` 与目标 Actor 不兼容的类。实例组件按 Unreal Editor 的创建顺序加入序列化数组、通知创建并注册；附加、设为根组件或注册失败时会清理新组件并取消事务。
