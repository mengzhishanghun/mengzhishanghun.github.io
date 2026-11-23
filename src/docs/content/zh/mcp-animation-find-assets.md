---
title: 查找、检查与保存动画资产
type: doc
slug: mcp-animation-find-assets
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-animation
docPage:
  work: mcp-animation
  group: features
  slug: find-assets
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-animation/docs/find-assets/
lang: zh
translationKey: doc:mcp-animation:find-assets
---

## Skeleton 与 AnimSequence

| 工具 | 用途 |
|---|---|
| `ListSkeletons` / `GetSkeletonDetail` | 发现 Skeleton，并读取骨骼、虚拟骨骼、兼容骨骼、Blend Profile 与 Slot Group。 |
| `ListAnimSequences` / `GetAnimSequenceDetail` | 发现 AnimSequence，并读取时长、采样率、Notify、float curve 和压缩状态。 |

先用列表工具找到目标资产，再把返回的路径交给对应的详情工具。`GetAnimSequenceDetail` 可查看 float curve 摘要、骨骼和曲线压缩设置、压缩有效性与近似大小。曲线和压缩设置只读；需要修改时，请在 Unreal Editor 中处理。

详情接口提供结构化摘要，不导出所有曲线键值或逐骨骼动画轨道。

## 列表与详情上限

- 列表工具使用 `Offset` 和 `MaxResults`，每页最多 256 项，并返回 `TotalCount`、`Returned`、`HasMore` 和可用时的 `NextOffset`。若还有结果，用返回的下一页偏移继续读取。
- 详情工具对骨骼、状态、Notify、曲线等集合设置 256 项上限，并返回真实总数与 `*Truncated` 标记。详情集合不支持翻页。超过上限时，请在 Unreal Editor 中查看完整数据。

## 打开与保存动画资产

| 工具 | 用途 |
|---|---|
| `SaveAsset` | 显式保存已修改资产。 |
| `OpenAsset` | 在 Unreal Editor 中打开资产。 |

- 先调用对应的 `List*` 工具取得规范资产路径。资产写操作仅允许有效的 `/Game` 项目内容路径。
- 写操作在编辑器游戏线程执行，并在适用时使用 Undo 事务；成功后把资产标记为 Dirty。
- 修改不会隐式保存到磁盘。确认结果后调用 `SaveAsset`；如需撤销，可使用 Unreal Editor 的 Undo。
- 编辑器处于 PIE、保存或垃圾回收等忙碌状态时，写工具会拒绝执行并返回原因。
