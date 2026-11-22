---
title: 编辑 Montage、Notify 与 BlendSpace
type: doc
slug: mcp-animation-montage-and-blendspace
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-animation
docPage:
  work: mcp-animation
  group: workflows
  slug: montage-and-blendspace
  order: 3
documentKind: product-manual
websiteRoute: /zh/works/mcp-animation/docs/montage-and-blendspace/
lang: zh
translationKey: doc:mcp-animation:montage-and-blendspace
---

### Montage、Notify 与 BlendSpace 编辑

| 工具 | 用途 |
|---|---|
| `CreateMontage` | 从 AnimSequence 创建 Montage。 |
| `AddMontageSection` / `SetMontageSection` / `RemoveMontageSection` | 管理 Montage Section。 |
| `AddNotify` / `RemoveNotify` | 在 AnimSequence 或 Montage 上添加、移除 Notify。 |
| `CreateBlendSpace` | 在轴范围有效时创建 BlendSpace。 |
| `SetBlendSpaceSamples` | 事务化替换最多 256 个已验证的采样点；失败时回滚。 |
