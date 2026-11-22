---
title: 编辑地形、绘制层和样条
type: doc
slug: mcp-world-editor-landscape
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
  slug: landscape
  order: 4
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/landscape/
lang: zh
translationKey: doc:mcp-world-editor:landscape
---

### Landscape 绘制层与专用样条

`GetLandscapeLayerInfo` 列出主 Landscape 的绘制层绑定。`CreateLandscapeLayerInfo` 用 `PackagePath`、`LayerName` 和 `bWeightBlended` 预览新的 `/Game/...` 资产，再以 `bDryRun=false`、`ExpectedPlanHash` 创建；资产还需单独保存。`BindLandscapeLayerInfo` 在已加载的非分区主 Landscape 上预览将已有 `LayerInfoPath` 绑定到 `LayerName`，或以 `bUnbind=true` 解绑。用新的 `ExpectedPlanHash` 执行；存在已绘制分配时拒绝解绑，且不会删除资产。

`GetLandscapeWeightData` 从精确绑定的 `LayerInfoPath` 读取端点包含在内的顶点区域（最多 65,536 个按行排列的 `uint8` 权重）；启用 Edit Layers 时指定 `EditLayerGuid`。`SetLandscapeWeightData` 接受精确 `WeightData`，或笔刷字段（`BrushCenterX/Y`、`BrushRadius`、`BrushTargetWeight`、`BrushStrength`）。它要求已加载、非分区的主 Landscape，且每个受影响组件已有目标分配。先预览有界区域，再用 `ExpectedCurrentDataHash` 和 `ExpectedProposedDataHash` 执行；权重混合层可能归一化其他绘制层的权重。`GetLandscapeEditLayers` 列出 Edit Layer GUID；`EditLandscapeLayer` 可预览创建、删除、重排、重命名、可见性、锁定、Alpha 或混合模式变更，执行须使用新的当前哈希和计划哈希。删除须 `bAllowDataLoss=true`；UE 5.8 不提供所需的公开编辑层混合模式 setter。

Landscape 专用样条先用 `GetLandscapeSplineTopology` 查看拓扑，再用 `PatchLandscapeSplineTopology` 执行 `AddPoint`、`UpdatePoint`、`DeletePoint`、`AddSegment`、`UpdateSegment` 或 `DeleteSegment`，按操作传入精确点/线段路径及局部坐标或切线。先预览，再以 `ExpectedTopologyHash` 与 `ExpectedPlanHash` 应用。该有界拓扑编辑要求已加载、非分区且没有保留样条 Edit Layer 的 Landscape。`ApplyLandscapeSplines` 可另外预览将样条作用于精确 `EditLayerGuid`，用 `ExpectedPlanHash` 应用；存在保留样条层时必须指定它的 GUID。目标层须可用且未锁定。这些操作不会保存关卡或资产。

### Landscape 高度数据安全合同

`GetLandscapeHeightData` 与 `SetLandscapeHeightData` 直接通过 JSON 交换按行排列的 `uint16` 高度采样，不探测或读取调用方指定的文件。区域使用包含端点的 Landscape 顶点坐标，单次最多 65,536 个采样。目标必须是主 `ALandscape` Actor，且整个区域必须已加载并归该 Actor 所有。UE 5.8 及更高版本要求精确指向标准编辑层的 `EditLayerGuid`，并拒绝程序化层与样条层；写工具还会拒绝锁定层，读工具则允许检查锁定层。UE 5.2-5.7 会拒绝包含 Edit Layers 的 Landscape，因为这些版本需要另行定义分层编辑合同。

`SetLandscapeHeightData` 默认使用 `bDryRun=true`。预检只返回 `CurrentDataHash` 与 `ProposedDataHash`，不改变编辑器状态。正式应用必须传入 `bDryRun=false`、刚刚预检得到的 `ExpectedCurrentDataHash`，以及匹配的 `ExpectedProposedDataHash`；当前状态或拟写入采样已变化时会在事务开始前拒绝。写入后工具会读回核验；核验失败时先恢复并验证原始采样，再取消事务，若恢复也无法确认则明确报告编辑器状态可能已变化。原子边界是单次区域调用，不是跨多次调用的整幅地形导入；两个工具均不会保存关卡或资产。

`RemoveStreamingLevel` 操作本身不可撤销。它会请求 Unreal Engine 保留既有 Undo 缓冲，但引擎仍可能因过期引用而重置该缓冲，因此不能保证 Undo 历史一定保留。工具只移除属于目标关卡的 Actor、Component、Object 与 BSP Selection；它会快照并核验目标关卡之外已选 Actor、Component 与 Object 的恢复，其他关卡中的 BSP Selection 则保持原状而不会被全局清除。若移除失败，工具还会尝试恢复目标关卡内的选择，并报告恢复是否通过核验。

`MoveActorsToLevel` 会尝试恢复并核验调用前的 Actor、Component、Object 与 BSP Selection；无法确认完整恢复时会返回错误。Selection Lock 启用或 Actor 身份无法唯一映射时，工具会在移动前拒绝请求。若批次结果不一致，工具不会自动执行 Undo，因为无法证明栈顶事务属于本次调用；继续操作前必须同时检查 Actor 所在关卡与 Selection 状态。
