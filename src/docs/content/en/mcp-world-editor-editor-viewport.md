---
title: Configure and Capture the Viewport
type: doc
slug: mcp-world-editor-editor-viewport
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
documentKind: product-manual
websiteRoute: /en/works/mcp-world-editor/docs/editor-viewport/
lang: en
translationKey: doc:mcp-world-editor:editor-viewport
sourceHash: 8dded0d6d243e909454b01c294eb81f66de2bc5ce8b5df0b80dd6ee3cd953665
translationStatus: translated
generatedBodyHash: ec27b8bb6de55d9ba43395a97821b2faeae3fb19bc7b415fa416cfbc3a77eeee
docPage:
  work: mcp-world-editor
  group: editor
  slug: editor-viewport
  order: 1
---

## Level editor viewport and render modes

Viewport type and render-mode tools use only a known level-editor viewport instead of down-casting an asset-preview viewport; when both ViewMode and ShowFlag are supplied, both are validated before either change is applied.

## Screenshot output

`CaptureViewport` normalizes viewport alpha to fully opaque before PNG encoding, so saved files and embedded screenshots display correctly in standard image viewers and Fab workflows.

`MaxCapturePixels` defaults to 8294400. The Base64-encoded screenshot also counts against `MaxResponseBodyBytes`.
