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
  group: features
  slug: import-ui-fonts
  order: 9
documentKind: product-manual
websiteRoute: /zh/works/mcp-umg/docs/import-ui-fonts/
lang: zh
translationKey: doc:mcp-umg:import-ui-fonts
---

## 导入 FontFace 和 UFont

先准备本地字体文件和未使用的 `/Game` 目标路径。导入成功后，用返回的字体资产路径给文字控件设置字体；如果打算稍后打开项目继续使用，记得保存两个导入资产。

`ImportUIFont` 将一个本地 `.ttf`/`.otf` 导入为新的 `/Game` FontFace，并创建同名后缀 `_Font` 的 UFont；UFont 的默认 typeface 保留对这个 FontFace 的引用。工具会返回 `FontFacePath` 和 `FontPath`，为文字设置 `Text.font` 时使用后者。`SourceFile`、`AssetPath` 为必填项，64 MiB 为源文件上限；两个目标包只要已存在、已加载为非空包或磁盘已存在即拒绝，避免覆盖或夹带保存。`bSave` 必须为布尔值，默认为 `false`；为真时精确保存这两个包。默认导入后可用 `SaveUIAsset` 分别按 FontFace/UFont 路径保存单包。工具使用 UE 5.2 至 5.8 实际提供的 `UFontFileImportFactory`（其基类 `FactoryCreateFile` 最终调用 FontFace 的原生二进制工厂）。
