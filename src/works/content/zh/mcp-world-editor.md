---
title: MCPWorldEditor
description: MCPWorldEditor 是开发中的 UE 编辑器 MCP 插件，围绕Actor、关卡、地形与视口提供工具接口。当前功能与兼容性仍在验证。
type: work
slug: mcp-world-editor
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
order: 24
status: 开发中
workInfo:
  stage: developing
  channels:
    - kind: docs
      href: /zh/works/mcp-world-editor/docs/connect/
  compatibility:
    - platforms: []
      requirements:
        - UE 5.2–5.8（开发中，兼容性待确认）
featured: false
draft: false
sitePublish: true
tags:
  - Actor、关卡、地形与视口
  - MCP 系列
docIds:
  - mcp-world-editor-connect
  - mcp-world-editor-maps
  - mcp-world-editor-save-level-packages
  - mcp-world-editor-navigation
  - mcp-world-editor-lighting-build
  - mcp-world-editor-world-settings
  - mcp-world-editor-actors
  - mcp-world-editor-foliage
  - mcp-world-editor-instanced-meshes
  - mcp-world-editor-actor-splines
  - mcp-world-editor-actor-hierarchy
  - mcp-world-editor-actor-components
  - mcp-world-editor-streaming-levels
  - mcp-world-editor-streamed-world
  - mcp-world-editor-world-partition-regions
  - mcp-world-editor-level-instances
  - mcp-world-editor-landscape
  - mcp-world-editor-landscape-paint-layers
  - mcp-world-editor-landscape-splines
  - mcp-world-editor-editor-viewport
  - mcp-world-editor-editor-pie
  - mcp-world-editor-viewport-statistics
  - mcp-world-editor-materials
coverAlt: MCPWorldEditor封面
websiteCoverUrl: /media/covers/works/mcp-world-editor-20261101.webp
lang: zh
translationKey: mcp-world-editor
---

## 作品简介

MCPWorldEditor 是开发中的 UE 编辑器 MCP 插件。外部 AI 工具可通过 MCP 查询和编辑当前世界中的 Actor、关卡与地形，也能查看关卡编辑器视口和 PIE 状态。操作范围和诊断反馈仍在验证。

## 开发方向

### Actor、组件与植被

按路径或可唯一确定的身份定位 Actor，再摆放、编组、调整附加关系或添加组件。可以编辑普通 Actor 样条，转换受支持的实例化网格，或在已加载的植被分区查询并编辑实例。植被索引只对查询时的快照有效。[Actor 摆放](/zh/works/mcp-world-editor/docs/actors/) · [编组与附加](/zh/works/mcp-world-editor/docs/actor-hierarchy/) · [组件](/zh/works/mcp-world-editor/docs/actor-components/) · [Actor 样条](/zh/works/mcp-world-editor/docs/actor-splines/) · [实例化网格](/zh/works/mcp-world-editor/docs/instanced-meshes/) · [植被](/zh/works/mcp-world-editor/docs/foliage/)

### 关卡组织与地图检查

可以检查地图、调整 World Settings，处理流式关卡中的 Actor、World Partition 的 Data Layer 和加载区域，或编辑 Level Instance。导航和灯光构建有各自的预检；查询现有导航路径不会触发构建。[地图检查](/zh/works/mcp-world-editor/docs/maps/) · [世界设置](/zh/works/mcp-world-editor/docs/world-settings/) · [流式关卡](/zh/works/mcp-world-editor/docs/streaming-levels/) · [Data Layer](/zh/works/mcp-world-editor/docs/streamed-world/) · [分区区域](/zh/works/mcp-world-editor/docs/world-partition-regions/) · [Level Instance](/zh/works/mcp-world-editor/docs/level-instances/) · [导航](/zh/works/mcp-world-editor/docs/navigation/) · [灯光](/zh/works/mcp-world-editor/docs/lighting-build/)

### 地形与视口

按区域读取和修改 Landscape 高度或绘制权重，按专用拓扑编辑 Landscape 样条。检查已加载范围、目标层和编辑条件后再执行；一次写入只覆盖指定区域，多次写入不能作为一个事务回滚。可通过视口截图检查画面，并查询 PIE 是空闲、排队启动还是已进入播放。[高度](/zh/works/mcp-world-editor/docs/landscape/) · [绘制层](/zh/works/mcp-world-editor/docs/landscape-paint-layers/) · [地形样条](/zh/works/mcp-world-editor/docs/landscape-splines/) · [视口截图](/zh/works/mcp-world-editor/docs/editor-viewport/) · [PIE 状态](/zh/works/mcp-world-editor/docs/editor-pie/)

## 使用流程

例如，要调整一批植被实例，先按[连接说明](/zh/works/mcp-world-editor/docs/connect/)接入目标编辑器，查询已加载的目标分区和实例。用当前快照预检改动，确认计划后才写入；如果快照已过期，重新读取和预检。检查结果，只选需要保留改动的关卡包，再按[保存关卡包文档](/zh/works/mcp-world-editor/docs/save-level-packages/)预览并应用。保存会写入磁盘，不能用编辑器 Undo 撤销；若空包保存可能删除文件，须明确允许。

## 开发状态

项目处于开发阶段。UE 5.2–5.8 相关版本仍在开发，兼容性待确认，各版本的测试尚未全部完成。[查看 MCPWorldEditor 教程](/zh/works/mcp-world-editor/docs/connect/)

## 支持

反馈请发送至 [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com)。
