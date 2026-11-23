---
title: 截取材质预览
type: doc
slug: mcp-material-material-preview
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-material
docPage:
  work: mcp-material
  group: features
  slug: material-preview
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/mcp-material/docs/material-preview/
lang: zh
translationKey: doc:mcp-material:material-preview
---

## 预览尺寸与输出

先用材质列表定位目标材质或材质实例，再调用 `CapturePreview` 获取预览。选择尺寸时，两边都不得超过 1024 像素；压缩后的 PNG 也不得超过 4 MiB。预览用于看画面，若要判断能否保存这次修改，仍要查看编译结果。
