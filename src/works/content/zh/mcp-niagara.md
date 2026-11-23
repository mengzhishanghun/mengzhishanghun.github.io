---
title: MCPNiagara
description: MCPNiagara 是开发中的 UE 编辑器 MCP 插件，围绕Niagara 系统、发射器与模块提供工具接口。当前功能与兼容性仍在验证。
type: work
slug: mcp-niagara
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
order: 22
status: 开发中
workInfo:
  stage: developing
  channels:
    - kind: docs
      href: /zh/works/mcp-niagara/docs/inspect/
  compatibility:
    - platforms: []
      requirements:
        - UE 5.2–5.8（开发中，兼容性待确认）
featured: false
draft: false
sitePublish: true
tags:
  - Niagara 系统、发射器与模块
  - MCP 系列
docIds:
  - mcp-niagara-inspect
  - mcp-niagara-niagara-system-assets
  - mcp-niagara-niagara-preview
  - mcp-niagara-edit-emitter
  - mcp-niagara-niagara-renderers
  - mcp-niagara-parameters-preview
coverAlt: MCPNiagara封面
websiteCoverUrl: /media/covers/works/mcp-niagara-20261101.webp
lang: zh
translationKey: mcp-niagara
---

## 作品简介

MCPNiagara 是开发中的 UE 编辑器 MCP 插件，让外部 AI 工具检查 Niagara System、发射器和模块栈，并编辑其中受支持的对象。工具范围和反馈仍可能随开发调整。

## 开发方向

### 查看系统、发射器与模块栈

分页查找 System、Emitter 和可见的模块库资产，读取系统的发射器、渲染器和用户参数。检查 Spawn、Update 或 Event 阶段的模块时，重名项用索引区分，存在多个 Event 阶段时需明确指定 `UsageId`。模块详情会区分值的来源，例如图覆盖、动态绑定和 Rapid Iteration 值；没有覆盖时，工具不会猜测具体默认值。[查看资产与模块文档](/zh/works/mcp-niagara/docs/inspect/)

### 调整发射器、渲染器与用户参数

可以复制发射器到系统、调整支持的属性，也能更换或配置渲染器。批量修改属性时，工具先校验每个属性名和新值，再应用改动。用户参数可新增、修改和移除支持的值类型；对象与 Data Interface 不走值参数写入，删除参数也不会自动更新图引用。[发射器](/zh/works/mcp-niagara/docs/edit-emitter/) · [渲染器](/zh/works/mcp-niagara/docs/niagara-renderers/) · [用户参数](/zh/works/mcp-niagara/docs/parameters-preview/)

## 使用流程

例如，要基于现有特效做一个变体，先[查找并检查模板](/zh/works/mcp-niagara/docs/inspect/)，用 `CreateNiagaraSystem` 复制到新的可写包路径。同名资产不会被覆盖。检查返回的规范路径，再为副本配置渲染器或用户参数。复核结果后调用 `SaveAsset`，并在编辑器中重新打开检查。[系统创建与保存](/zh/works/mcp-niagara/docs/niagara-system-assets/) · [导出缓存缩略图](/zh/works/mcp-niagara/docs/niagara-preview/)

缓存缩略图只来自内存或已保存包；它不会实时渲染，不能用来确认刚做的编辑已经反映到画面上。UE 5.2 移除发射器后，如果工具提示继承流程所用的缓存未清理，应按提示刷新或重开系统，再继续合并操作。

## 开发状态

项目处于开发阶段。UE 5.2–5.8 的兼容性待确认；目标引擎中的资产编辑、保存、重新打开和打包尚未全部验证，请先在项目副本上确认。[查看 MCPNiagara 教程](/zh/works/mcp-niagara/docs/inspect/)

## 支持

反馈请发送至 [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com)。
