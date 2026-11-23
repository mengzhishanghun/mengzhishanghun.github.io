---
title: 设置视口并截取画面
type: doc
slug: mcp-world-editor-editor-viewport
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
docPage:
  work: mcp-world-editor
  group: features
  slug: editor-viewport
  order: 19
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/editor-viewport/
lang: zh
translationKey: doc:mcp-world-editor:editor-viewport
---

## 关卡编辑器视口与渲染模式

视口类型与渲染模式工具只作用于插件识别的关卡编辑器视口。资产编辑器的预览视口不在范围内。同时提供 ViewMode 与 ShowFlag 时，工具会先校验两项；校验失败时，两项都不会应用。

先切到要截图的关卡编辑器视口，再设置渲染模式和显示项。调用截图前，在这个视口确认画面已符合预期。

## 截图输出

`CaptureViewport` 在 PNG 编码前会将视口 Alpha 统一为完全不透明，确保保存文件和内嵌截图可在标准图片查看器及 Fab 工作流中正确显示。

`MaxCapturePixels` 默认是 8294400；内嵌截图的 Base64 也计入 `MaxResponseBodyBytes`。

截图失败时，先看是画面像素数触及上限，还是内嵌数据超过响应预算；两者各有独立的限制。
