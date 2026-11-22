---
title: 创建并保存材质实例
type: doc
slug: mcp-world-editor-materials
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
docPage:
  work: mcp-world-editor
  group: materials
  slug: materials
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/materials/
lang: zh
translationKey: doc:mcp-world-editor:materials
---

## 父材质与目标路径

`CreateMaterialInstance` 只接受项目 `/Game/` 内容根目录下可写的 long package name，例如 `/Game/Materials/MI_Wall`。工具会拒绝 Developers 与自动生成的 ExternalActors/ExternalObjects 目录、非法包名，以及内存或磁盘上已经存在的目标。父级可以是任何可加载的 `MaterialInterface`，包括材质实例。

## 保存结果与失败清理

工具创建实例后通过官方 `EditorAssetSubsystem` 保存，并核验实际对象路径、磁盘包可发现且 package 不再为 dirty；只有全部成立才返回 `Saved=true`。保存或类型/路径校验失败时，只会在返回对象精确匹配本次目标时强制清理；只有目标对象、内存包和磁盘包均不再存在才报告清理成功。异常对象不匹配目标时拒绝盲删，并明确提示可能残留部分状态。创建资产无法通过普通 Undo 撤销。失败清理使用 UE Force Delete，可能清空已有的 Undo 历史。
