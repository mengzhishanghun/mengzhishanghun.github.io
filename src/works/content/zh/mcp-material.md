---
title: MCPMaterial
description: MCPMaterial 是开发中的 UE 编辑器 MCP 插件，围绕材质图与材质实例提供工具接口。当前功能与兼容性仍在验证。
type: work
slug: mcp-material
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
order: 21
status: 开发中
workInfo:
  stage: developing
  channels:
    - kind: docs
      href: /zh/works/mcp-material/docs/connect/
  compatibility:
    - platforms: []
      requirements:
        - UE 5.2–5.8（开发中，兼容性待确认）
featured: false
draft: false
sitePublish: true
tags:
  - 材质图与材质实例
  - MCP 系列
docIds:
  - mcp-material-connect
  - mcp-material-material-assets
  - mcp-material-material-preview
  - mcp-material-edit-graph
  - mcp-material-instance-parameters
  - mcp-material-material-compilation
coverAlt: MCPMaterial封面
websiteCoverUrl: /media/covers/works/mcp-material-20261101.webp
lang: zh
translationKey: mcp-material
---

## 作品简介

MCPMaterial 是开发中的 UE 编辑器 MCP 插件，让外部 AI 工具通过 MCP 查找和创建材质资产、编辑材质图、调整材质实例参数。工具范围和编译反馈仍可能随开发调整。

## 开发方向

### 编辑材质图与节点

先读取节点、连线和可编辑属性，再按节点 GUID 原位修改参数默认值或纹理引用。也能批量添加节点、调整连线和整理布局。需要专用结构管理的 Composite、Function Input/Output 和 Named Reroute 等节点不在通用增删范围内。[查看材质图文档](/zh/works/mcp-material/docs/edit-graph/)

### 调整材质实例参数

读取实例的解析值及本地覆盖。结构化接口按类型、名称、Association 和 Index 定位参数，再更新或清除指定的全局、层或混合参数覆盖。纹理资源必须符合父材质当前编译资源要求的类型；高级参数另有引擎版本要求。[查看实例参数文档](/zh/works/mcp-material/docs/instance-parameters/)

## 使用流程

例如，要调整材质表达式的默认值，先按[连接说明](/zh/works/mcp-material/docs/connect/)接入编辑器，找到目标资产并读出节点 GUID。先处理资产编辑器里尚未保存的改动，再关闭目标资产的编辑器，再用 `ApplyMaterialPatch` 更新节点。编辑后调用 `CompileMaterial`，检查状态和错误；检查结果后，显式调用 `SaveAsset`。需要看画面时可按文档[截取材质预览](/zh/works/mcp-material/docs/material-preview/)。如果工具返回 `StateUnknown`，暂停写入并检查资产；请求超时后也要先核对编辑器里的实际状态，再决定是否重试。[材质资产的关闭与保存](/zh/works/mcp-material/docs/material-assets/) · [编译诊断](/zh/works/mcp-material/docs/material-compilation/)

## 开发状态

项目处于开发阶段。UE 5.2–5.8 相关版本仍在开发，兼容性待确认，各版本的测试尚未全部完成。[查看 MCPMaterial 教程](/zh/works/mcp-material/docs/edit-graph/)

## 支持

反馈请发送至 [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com)。
