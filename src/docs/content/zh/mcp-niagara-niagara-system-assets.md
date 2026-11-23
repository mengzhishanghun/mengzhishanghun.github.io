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
  group: features
  slug: niagara-system-assets
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/mcp-niagara/docs/niagara-system-assets/
lang: zh
translationKey: doc:mcp-niagara:niagara-system-assets
---

## 创建或复制模板

`CreateNiagaraSystem` 仅接受可写挂载点内、不带 `.ObjectName` 后缀的合法长包名，并在创建前检查磁盘包、内存包和 Asset Registry 冲突，绝不覆盖同名资产。要基于现有特效做变体，先查到模板，再提供 `TemplatePath`，将模板复制到新的包路径。省略该参数时，Niagara Factory 会创建空 System。创建后记下返回的规范对象路径和包名，核对 dirty 状态，需要保留该资产时调用 `SaveAsset`。

## 打开与保存

`SaveAsset` 使用非致命的包名到文件名转换，拒绝只读目标；只有 `SavePackage` 成功、文件存在且包不再 dirty 时才返回成功。保存后，可用 `OpenAsset` 在编辑器中打开 System，检查目标资产是否正确。该调用要求 Unreal Editor 及其资产编辑器子系统可用。
