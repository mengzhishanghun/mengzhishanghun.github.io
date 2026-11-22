---
title: 创建和保存材质实例
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
  group: workflows
  slug: materials
  order: 5
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/materials/
lang: zh
translationKey: doc:mcp-world-editor:materials
---

## 材质实例创建

`CreateMaterialInstance` 只接受项目 `/Game/` 内容根目录下可写的 long package name，例如 `/Game/Materials/MI_Wall`。工具会拒绝 Developers 与自动生成的 ExternalActors/ExternalObjects 目录、非法包名，以及内存或磁盘上已经存在的目标。父级可以是任何可加载的 `MaterialInterface`，包括材质实例。

## Material Instance 资产持久化

`CreateMaterialInstance` 只允许在项目 `/Game/...` 根下、且不属于 Developers 或生成的 ExternalActors/ExternalObjects 目录的合法新包路径。工具会同时拒绝内存或磁盘上已存在的包，创建后通过官方 `EditorAssetSubsystem` 保存，并核验实际对象路径、磁盘包可发现且 package 不再为 dirty；只有全部成立才返回 `Saved=true`。保存或类型/路径校验失败时，只会在返回对象精确匹配本次目标时强制清理；只有目标对象、内存包和磁盘包均不再存在才报告清理成功。异常对象不匹配目标时拒绝盲删，并明确提示可能残留部分状态。资产创建本身不属于普通 Undo 事务；但失败清理使用 UE Force Delete，可能清空编辑器已有的 Undo 历史。

如有问题或反馈，请发送邮件至 [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com)。我看到后会处理。
