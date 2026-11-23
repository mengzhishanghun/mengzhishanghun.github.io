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
sourceHash: ca2ded0b9ae47c47cd9bf8d3ea9ada50732b2e5c8155677ea1947ad75075b3a9
translationStatus: translated
generatedBodyHash: 2cd6199e636da2ed13bd3af6cc8511d35f1633714a4e4afb0c21713e0b992d5f
docPage:
  work: mcp-world-editor
  group: features
  slug: editor-viewport
  order: 19
---

## Level editor viewport and render modes

Viewport type and render-mode tools work only with recognized level editor viewports. Asset editor previews are outside their scope. If you supply both ViewMode and ShowFlag, the tool validates both and applies neither if validation fails.

Switch to the level editor viewport you want to capture, then set the render mode and display options. Check the image in that viewport before requesting a screenshot.

## Screenshot output

`CaptureViewport` normalizes viewport alpha to fully opaque before PNG encoding, so saved files and embedded screenshots display correctly in standard image viewers and Fab workflows.

`MaxCapturePixels` defaults to 8294400. The Base64-encoded screenshot also counts against `MaxResponseBodyBytes`.

If a capture fails, check whether it hit the pixel limit or exceeded the response budget for embedded data. These are separate limits.
