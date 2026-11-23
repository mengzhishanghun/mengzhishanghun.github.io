---
title: 创建、打开与保存材质资产
type: doc
slug: mcp-material-material-assets
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
  slug: material-assets
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-material/docs/material-assets/
lang: zh
translationKey: doc:mcp-material:material-assets
---

## 发现和创建资产

用 `ListMaterials` 查找材质与材质实例。插件可创建材质和材质实例；新建资产起初只存在于编辑器内存中。

## 处理编辑器中的更改并保存

如果目标已在资产编辑器中打开，先保存或处理编辑器中的更改，再调用 `CloseAsset`。

写入、编译和保存工具会拒绝操作仍在资产编辑器中打开的目标。这可避免 Material Editor 的 transient preview 与 backing asset 形成双状态，并防止编辑器稍后 Apply 时覆盖 MCP 已完成的修改。

创建的资产先处于内存 Dirty 状态，必须显式调用 `SaveAsset` 才会写入磁盘；底层保存失败会返回 MCP 错误终态，而不是成功响应中的警告。

写入工具会把改动记入事务，并将包标记为 Dirty。保存前可用 `CompileMaterial` 检查编译结果。若想在编辑器里查看结果，可先保存，再用 `OpenAsset` 打开；如果先打开查看，保存前要再次关闭目标编辑器。
