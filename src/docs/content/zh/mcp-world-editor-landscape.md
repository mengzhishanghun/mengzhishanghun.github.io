---
title: 读取与修改 Landscape 高度
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
  group: landscape
  slug: landscape
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/landscape/
lang: zh
translationKey: doc:mcp-world-editor:landscape
---

## 采样范围与写入预检

`GetLandscapeHeightData` 与 `SetLandscapeHeightData` 直接通过 JSON 交换按行排列的 `uint16` 高度采样，不探测或读取调用方指定的文件。区域使用包含端点的 Landscape 顶点坐标，单次最多 65,536 个采样。目标必须是主 `ALandscape` Actor，且整个区域必须已加载并归该 Actor 所有。UE 5.8 及更高版本要求精确指向标准编辑层的 `EditLayerGuid`，并拒绝程序化层与样条层；写工具还会拒绝锁定层，读工具则允许检查锁定层。UE 5.2-5.7 会拒绝包含 Edit Layers 的 Landscape，因为这些版本需要另行定义分层编辑合同。

`SetLandscapeHeightData` 默认使用 `bDryRun=true`。预检只返回 `CurrentDataHash` 与 `ProposedDataHash`，不改变编辑器状态。正式应用必须传入 `bDryRun=false`、刚刚预检得到的 `ExpectedCurrentDataHash`，以及匹配的 `ExpectedProposedDataHash`；当前状态或拟写入采样已变化时会在事务开始前拒绝。写入后工具会读回核验；核验失败时先恢复并验证原始采样，再取消事务，若恢复也无法确认则明确报告编辑器状态可能已变化。原子边界是单次区域调用，不是跨多次调用的整幅地形导入；两个工具均不会保存关卡或资产。
