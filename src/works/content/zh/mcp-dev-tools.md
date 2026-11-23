---
title: MCPDevTools
description: MCPDevTools 是开发中的 UE 编辑器 MCP 插件，围绕资产工具与只读开发诊断提供工具接口。当前功能与兼容性仍在验证。
type: work
slug: mcp-dev-tools
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
order: 19
status: 开发中
workInfo:
  stage: developing
  channels:
    - kind: docs
      href: /zh/works/mcp-dev-tools/docs/connect/
  compatibility:
    - platforms:
        - Windows (Win64)
      requirements:
        - UE 5.2–5.8（开发中，兼容性待确认）
featured: false
draft: false
sitePublish: true
tags:
  - 资产工具与只读开发诊断
  - MCP 系列
docIds:
  - mcp-dev-tools-connect
  - mcp-dev-tools-inspect-editor
  - mcp-dev-tools-asset-registry
  - mcp-dev-tools-primary-asset-labels
  - mcp-dev-tools-data-assets
  - mcp-dev-tools-data-tables
  - mcp-dev-tools-curves
  - mcp-dev-tools-curve-tables
  - mcp-dev-tools-string-tables
  - mcp-dev-tools-enhanced-input
coverAlt: MCPDevTools封面
websiteCoverUrl: /media/covers/works/mcp-dev-tools-20261101.webp
lang: zh
translationKey: mcp-dev-tools
---

## 作品简介

MCPDevTools 是开发中的 UE 编辑器 MCP 插件。外部 AI 工具可通过 HTTP MCP 查询项目资产、修改支持的数据资产，并读取当前编辑器会话、插件状态和诊断日志。工具和反馈仍可能调整。请查看目标编辑器的 `tools/list` 和工具返回结果。

## 开发方向

### 检查编辑器与资产引用

先确认客户端连的是哪个编辑器实例，再查看插件状态、监听地址或 MCPDevTools 捕获的插件日志。诊断工具只读，不会启动测试作业、改配置或保存包。资产查询还可检查 Asset Registry 记录、类型和引用关系；PrimaryAssetLabel 有独立编辑工具，派生的 bundle 数据只读。[编辑器诊断](/zh/works/mcp-dev-tools/docs/inspect-editor/) · [资产引用](/zh/works/mcp-dev-tools/docs/asset-registry/) · [PrimaryAssetLabel](/zh/works/mcp-dev-tools/docs/primary-asset-labels/)

### 编辑项目数据与输入配置

创建 DataAsset 并编辑可写属性；为 DataTable 选用现有行结构，再增删或修改行。Curve、CurveTable 和 StringTable 分别提供通道、行和条目的编辑工具。项目启用 Enhanced Input 后，还可配置 InputAction 和 InputMappingContext，参数以目标引擎的格式为准。[DataAsset](/zh/works/mcp-dev-tools/docs/data-assets/) · [DataTable](/zh/works/mcp-dev-tools/docs/data-tables/) · [Curve](/zh/works/mcp-dev-tools/docs/curves/) · [CurveTable](/zh/works/mcp-dev-tools/docs/curve-tables/) · [StringTable](/zh/works/mcp-dev-tools/docs/string-tables/) · [Enhanced Input](/zh/works/mcp-dev-tools/docs/enhanced-input/)

## 使用流程

例如，要修改现有 DataTable 的一行，先按[连接说明](/zh/works/mcp-dev-tools/docs/connect/)接入目标编辑器，读取当前行结构与完整旧行，再提交旧值和新值，让工具预检。预检通过后设置 `bDryRun=false` 执行；如果旧值已变，工具会拒绝写入。检查结果后单独调用 `SaveAsset` 保存目标资产。工具不会自动签出文件、覆盖现有创建路径或连带保存引用资产。

## 开发状态

项目处于开发阶段。UE 5.2–5.8 相关版本仍在开发，兼容性待确认，各版本的测试尚未全部完成。[查看 MCPDevTools 教程](/zh/works/mcp-dev-tools/docs/inspect-editor/)
