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
sourceHash: 44c622c21f9ef4cc737dfb41b994235d6f4f584ef48cc2e709c23cd0bc38c381
translationStatus: translated
generatedBodyHash: 00b1641dc0262577bdcc9694d165224fc50108b170d0b5f68b7b9671f2b46a53
docPage:
  work: mcp-world-editor
  group: features
  slug: viewport-statistics
  order: 21
---

## Run allowlisted console commands

`ExecuteConsoleCommand` accepts only the seven approved `stat` commands. It calls `GEngine->Exec` and returns an error if the engine does not handle the command. Unreal `stat` commands toggle their viewport statistic display, so repeating one may turn the display off; they are not side-effect-free measurements. `Handled=true` in a successful result only means that the current engine instance accepted the command, not that the display is necessarily enabled. Some commands produce no text output.

Check whether the statistic is already visible before you run the command. After the call, look at the viewport. If you received no text output, check the display before sending the command again.
