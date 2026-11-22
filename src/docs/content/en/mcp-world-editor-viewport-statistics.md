---
title: Toggle Viewport Statistics
type: doc
slug: mcp-world-editor-viewport-statistics
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
documentKind: product-manual
websiteRoute: /en/works/mcp-world-editor/docs/viewport-statistics/
lang: en
translationKey: doc:mcp-world-editor:viewport-statistics
sourceHash: f468ae4c3938aafd15a02d4577f9d40776d157a543733ffa53542cfb9516e24d
translationStatus: translated
generatedBodyHash: f6e986c5cd14ae8c1648f6411f9a5c7caf83f52f98191ea711373a5b90f7094b
docPage:
  work: mcp-world-editor
  group: editor
  slug: viewport-statistics
  order: 3
---

## Run allowlisted console commands

`ExecuteConsoleCommand` accepts only the seven allowlisted `stat` commands, routes them through `GEngine->Exec`, and checks whether the engine actually handled the request; an unhandled command returns an error. Unreal `stat` commands toggle their viewport statistic display, so repeating one may turn the display off; they are not side-effect-free measurements. `Handled=true` in a successful result only means that the current engine instance accepted the command, not that the display is necessarily enabled. Some commands produce no text output.
