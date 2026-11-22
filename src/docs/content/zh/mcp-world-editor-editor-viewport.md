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
  group: editor
  slug: editor-viewport
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/editor-viewport/
lang: zh
translationKey: doc:mcp-world-editor:editor-viewport
---

## 关卡编辑器视口与渲染模式

视口类型与渲染模式工具只使用已知的关卡编辑器视口，不会把资产编辑器预览视口强制下转；同时提供 ViewMode 与 ShowFlag 时会先完成两者校验再应用，错误不会留下部分渲染模式变更。

## 截图输出

`CaptureViewport` 在 PNG 编码前会将视口 Alpha 统一为完全不透明，确保保存文件和内嵌截图可在标准图片查看器及 Fab 工作流中正确显示。

`MaxCapturePixels` 默认是 8294400；内嵌截图的 Base64 也计入 `MaxResponseBodyBytes`。
