---
title: 读取和编辑关键帧
type: doc
slug: mcp-level-sequence-sequence-keyframes
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-level-sequence
docPage:
  work: mcp-level-sequence
  group: features
  slug: sequence-keyframes
  order: 5
documentKind: product-manual
websiteRoute: /zh/works/mcp-level-sequence/docs/sequence-keyframes/
lang: zh
translationKey: doc:mcp-level-sequence:sequence-keyframes
---

## 支持的 Channel 与分页

| 分组 | 工具 | 用途 |
|---|---|---|
| Key | `GetKeyframes`、`SetKeyframes`、`RemoveKeyframes` | 分页读取、写入和删除关键帧 |

关键帧工具支持三类 Channel：Transform 使用 Double，Float/Fade 使用 Float，Bool 属性轨使用 Bool。`GetSequenceDetail` 返回 Track 与 Section 结构，但不枚举 Channel；调用关键帧工具时应使用对应 Track 类型约定的 `ChannelName`。

先定位轨道和区段，再按轨道类型选择通道。修改或删除前先读取该通道的关键帧，确认帧位置和数值类型；改完后可查看同一通道。

- `GetKeyframes`：默认 200，单页最多 1000，并提供 `NextOffset`。

分页响应会返回总数、当前 Offset、是否还有更多数据和可用的 `NextOffset`。客户端应继续分页，不要假设一次返回完整资产。

修改与保存工具只接受有效的 `/Game/...` Level Sequence 路径；只读发现、读取、打开、截图和关闭可访问其他已加载或可读取的序列位置。所有编辑工具会检查 PIE、保存和 GC 忙碌状态，拒绝只读 MovieScene，并通过编辑器事务支持 Undo。

关键帧位置按序列的 `TickResolution` 解释，见[时间单位与帧率](/zh/works/mcp-level-sequence/docs/sequence-timing/)。
