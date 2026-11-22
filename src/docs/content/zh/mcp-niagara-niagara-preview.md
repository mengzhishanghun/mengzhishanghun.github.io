---
title: 导出 Niagara 缓存缩略图
type: doc
slug: mcp-niagara-niagara-preview
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-niagara
docPage:
  work: mcp-niagara
  group: systems
  slug: niagara-preview
  order: 3
documentKind: product-manual
websiteRoute: /zh/works/mcp-niagara/docs/niagara-preview/
lang: zh
translationKey: doc:mcp-niagara:niagara-preview
---

## 缩略图来源与输出限制

`CapturePreview` 只读取内存或已保存包中的缓存缩略图，不实时渲染或改写 thumbnail cache；输出固定为一张 PNG，并限制尺寸 1024×1024、原始数据 16 MiB、压缩数据 8 MiB。
