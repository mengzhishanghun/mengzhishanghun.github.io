---
title: 创建、打开与保存 Niagara System
type: doc
slug: mcp-niagara-niagara-system-assets
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
  slug: niagara-system-assets
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/mcp-niagara/docs/niagara-system-assets/
lang: zh
translationKey: doc:mcp-niagara:niagara-system-assets
---

## 创建或复制模板

`CreateNiagaraSystem` 仅接受可写挂载点内、不带 `.ObjectName` 后缀的合法长包名，并在创建前检查磁盘包、内存包和 Asset Registry 冲突，绝不覆盖同名资产。提供 `TemplatePath` 时会真实复制模板；未提供时才使用 Niagara Factory 创建空 System。创建结果会返回规范对象路径、包名和 dirty 状态，需调用 `SaveAsset` 落盘。

## 打开与保存

`SaveAsset` 使用非致命的包名到文件名转换，拒绝只读目标；只有 `SavePackage` 成功、文件存在且包不再 dirty 时才返回成功。`OpenAsset` 会检查 Editor 与 AssetEditorSubsystem 生命周期。
