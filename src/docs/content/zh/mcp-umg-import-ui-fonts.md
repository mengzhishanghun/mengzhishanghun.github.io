---
title: 导入 UI 字体
type: doc
slug: mcp-umg-import-ui-fonts
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-umg
docPage:
  work: mcp-umg
  group: styling-themes
  slug: import-ui-fonts
  order: 3
documentKind: product-manual
websiteRoute: /zh/works/mcp-umg/docs/import-ui-fonts/
lang: zh
translationKey: doc:mcp-umg:import-ui-fonts
---

## 导入 FontFace 和 UFont

`ImportUIFont` 将一个本地 `.ttf`/`.otf` 导入为新的 `/Game` FontFace，并创建同名后缀 `_Font` 的 UFont；UFont 默认 typeface 持久引用该 FontFace，返回 `FontFacePath` 与可直接用于 `Text.font` 的 `FontPath`。`SourceFile`、`AssetPath` 为必填项，64 MiB 为源文件上限；两个目标包只要已存在、已加载为非空包或磁盘已存在即拒绝，避免覆盖或夹带保存。`bSave` 必须为布尔值，默认为 `false`；为真时精确保存这两个包。默认导入后可用 `SaveUIAsset` 分别按 FontFace/UFont 路径保存单包。工具使用 UE 5.2 至 5.8 实际提供的 `UFontFileImportFactory`（其基类 `FactoryCreateFile` 最终调用 FontFace 的原生二进制工厂）。
