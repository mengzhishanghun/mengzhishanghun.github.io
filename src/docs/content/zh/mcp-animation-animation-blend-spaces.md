---
title: 创建 BlendSpace 并编辑采样点
type: doc
slug: mcp-animation-animation-blend-spaces
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
  slug: animation-blend-spaces
  order: 5
documentKind: product-manual
websiteRoute: /zh/works/mcp-animation/docs/animation-blend-spaces/
lang: zh
translationKey: doc:mcp-animation:animation-blend-spaces
---

## 查找、创建与修改 BlendSpace

| 工具 | 用途 |
|---|---|
| `ListBlendSpaces` / `GetBlendSpaceDetail` | 发现 BlendSpace，并读取轴与采样点。 |

| 工具 | 用途 |
|---|---|
| `CreateBlendSpace` | 在轴范围有效时创建 BlendSpace。 |
| `SetBlendSpaceSamples` | 事务化替换最多 256 个已验证的采样点；失败时回滚。 |

编辑现有资产时，先读取轴范围和原有采样点。`SetBlendSpaceSamples` 会替换整组采样点；即使只改一个点，也要把其余应保留的点一起传入。改完可用详情工具核对轴和采样点。

写入前后请遵循[打开与保存动画资产](/zh/works/mcp-animation/docs/find-assets/)一节的路径、事务和保存规则。
