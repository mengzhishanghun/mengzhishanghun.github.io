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
  group: editing
  slug: animation-blend-spaces
  order: 4
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

写入前后请遵循[打开与保存动画资产](/zh/works/mcp-animation/docs/find-assets/)一节的路径、事务和保存规则。
