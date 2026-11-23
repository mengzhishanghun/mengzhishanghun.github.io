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
  group: features
  slug: niagara-preview
  order: 3
documentKind: product-manual
websiteRoute: /zh/works/mcp-niagara/docs/niagara-preview/
lang: zh
translationKey: doc:mcp-niagara:niagara-preview
---

## 缩略图来源与输出限制

`CapturePreview` 只读取内存或已保存包中的缓存缩略图，不会现场渲染，也不会改写缩略图缓存。输出为一张 PNG，尺寸不超过 1024×1024，原始数据不超过 16 MiB，压缩数据不超过 8 MiB。要核对刚改的效果，请打开目标 System 查看；缓存图不能确认编辑结果已反映到画面上。
