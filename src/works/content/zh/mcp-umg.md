---
title: MCPUMG
description: MCPUMG 是开发中的 UE 编辑器 MCP 插件，围绕Widget 树、属性与动画提供工具接口。当前功能与兼容性仍在验证。
type: work
slug: mcp-umg
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
order: 23
status: 开发中
workInfo:
  stage: developing
  channels:
    - kind: docs
      href: /zh/works/mcp-umg/docs/connect/
  compatibility:
    - platforms: []
      requirements:
        - UE 5.2–5.8（开发中，兼容性待确认）
featured: false
draft: false
sitePublish: true
tags:
  - Widget 树、属性与动画
  - MCP 系列
docIds:
  - mcp-umg-connect
  - mcp-umg-layout
  - mcp-umg-image-to-umg
  - mcp-umg-layout-inspection
  - mcp-umg-batch-migration
  - mcp-umg-components-styles
  - mcp-umg-component-extraction
  - mcp-umg-widget-styles
  - mcp-umg-widget-themes
  - mcp-umg-import-ui-fonts
  - mcp-umg-events-navigation-animation
  - mcp-umg-navigation
  - mcp-umg-animation
  - mcp-umg-commonui
  - mcp-umg-mvvm
  - mcp-umg-preview-runtime
  - mcp-umg-runtime-diagnostics
  - mcp-umg-widget-performance
coverAlt: MCPUMG封面
websiteCoverUrl: /media/covers/works/mcp-umg-20261101.webp
lang: zh
translationKey: mcp-umg
---

## 作品简介

MCPUMG 是开发中的 UE 编辑器 MCP 插件。外部 AI 工具可通过 MCP 读取和编辑 Widget Blueprint，包括 Widget 树、属性、插槽、动画与事件，也可以预览界面、检查运行中的控件。工具范围与诊断能力仍可能调整。

## 开发方向

### 搭建界面与复用控件

从 Widget 树定位控件，编辑层级、属性和 Slot 布局。重复的子树可以提取为独立组件；已有组件实例可通过 Named Slot 换入不同内容。样式、主题和字体有各自的工具，样式修改要以具体控件支持的属性为准。[Widget 树](/zh/works/mcp-umg/docs/layout/) · [组件提取](/zh/works/mcp-umg/docs/component-extraction/) · [Named Slot](/zh/works/mcp-umg/docs/components-styles/) · [样式](/zh/works/mcp-umg/docs/widget-styles/) · [主题](/zh/works/mcp-umg/docs/widget-themes/) · [字体](/zh/works/mcp-umg/docs/import-ui-fonts/)

### 设置交互、导航与动画

为控件配置事件，调整焦点导航规则或编辑动画区段与关键帧。CommonUI 和 MVVM 各自有可用性检查；配置前先确认目标编辑器具备对应框架和工具。[事件](/zh/works/mcp-umg/docs/events-navigation-animation/) · [焦点导航](/zh/works/mcp-umg/docs/navigation/) · [动画](/zh/works/mcp-umg/docs/animation/) · [CommonUI](/zh/works/mcp-umg/docs/commonui/) · [MVVM](/zh/works/mcp-umg/docs/mvvm/)

### 预览和诊断

按状态和尺寸预览界面，或检查 PIE 里的实例、裁切与命中。设计态数据和 dry-run 只能核对结构与属性，不能确认 Slate 的实际排版；命中诊断读取缓存，不会发送点击。设计态复杂度检查、运行时测量与 Trace 各有适用范围。[预览](/zh/works/mcp-umg/docs/preview-runtime/) · [布局与命中](/zh/works/mcp-umg/docs/layout-inspection/) · [运行时实例](/zh/works/mcp-umg/docs/runtime-diagnostics/) · [性能](/zh/works/mcp-umg/docs/widget-performance/)

## 使用流程

例如，要从一张参考图搭建页面，先按[连接说明](/zh/works/mcp-umg/docs/connect/)核对目标项目与工具版本。由 AI 客户端解读图片并产出 Widget Spec；插件不直接调用图片模型。先预检规格，再构建并检查实际预览；如果要确认裁切或交互是否符合预期，请在运行实例上检查。核对需要保留的改动后，显式调用 `SaveWidgetBlueprint`。[从参考图生成 UMG 界面](/zh/works/mcp-umg/docs/image-to-umg/)

如果需要[批量修改控件属性](/zh/works/mcp-umg/docs/batch-migration/)，先读取每个目标的指纹，再预检要改的属性。应用时按 Widget Blueprint 分别记录撤销事务；发生失败时检查逐包结果，工具不会跨资产自动回滚，也不会自动编译或保存。

## 开发状态

项目处于开发阶段。UE 5.2–5.8 相关版本仍在开发，兼容性待确认，各版本的测试尚未全部完成。[查看 MCPUMG 教程](/zh/works/mcp-umg/docs/connect/)
