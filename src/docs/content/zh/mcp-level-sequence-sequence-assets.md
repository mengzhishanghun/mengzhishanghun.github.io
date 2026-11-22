---
title: 查找、创建与保存 Level Sequence
type: doc
slug: mcp-level-sequence-sequence-assets
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-level-sequence
docPage:
  work: mcp-level-sequence
  group: assets
  slug: sequence-assets
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-level-sequence/docs/sequence-assets/
lang: zh
translationKey: doc:mcp-level-sequence:sequence-assets
---

## 查找与分页

| 分组 | 工具 | 用途 |
|---|---|---|
| 序列 | `ListSequences`、`GetSequenceDetail`、`CreateSequence` | 发现、分页读取和创建序列 |

- `ListSequences`：默认 100，单页最多 500。
- `GetSequenceDetail`：用 `Offset` 与 `MaxItems` 对 Binding/Track/Section 的稳定组合遍历分页。

分页响应会返回总数、当前 Offset、是否还有更多数据和可用的 `NextOffset`。客户端应继续分页，不要假设一次返回完整资产。

## 打开、保存与关闭

| 分组 | 工具 | 用途 |
|---|---|---|
| 生命周期 | `OpenAsset`、`SaveAsset`、`CloseAsset` | 打开、保存指定资产并核验关闭结果 |

修改与保存工具只接受有效的 `/Game/...` Level Sequence 路径；只读发现、读取、打开、截图和关闭可访问其他已加载或可读取的序列位置。所有编辑工具会检查 PIE、保存和 GC 忙碌状态，拒绝只读 MovieScene，并通过编辑器事务支持 Undo。

编辑成功只会将包标记为 dirty，不会隐式保存。调用 `SaveAsset` 只保存指定 Level Sequence 的 package。`CloseAsset` 发出关闭请求后会再次查询该资产及其子对象的编辑器实例；若编辑器拒绝关闭，工具会返回失败而不是误报成功。
