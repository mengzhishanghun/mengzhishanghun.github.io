---
title: Capture a Sequence Preview
type: doc
slug: mcp-level-sequence-sequence-preview
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-level-sequence
documentKind: product-manual
websiteRoute: /en/works/mcp-level-sequence/docs/sequence-preview/
lang: en
translationKey: doc:mcp-level-sequence:sequence-preview
sourceHash: bbe6b14ccea5befec417fcb17ff5ecaa37f1d86b1e64d0aa1c272b3070d0969c
translationStatus: translated
generatedBodyHash: f38ef1fd109d597c1adef2bc77b41f79164f17cfdd4c5e7b6461694675ac7bb7
docPage:
  work: mcp-level-sequence
  group: features
  slug: sequence-preview
  order: 2
---

## Capture the active viewport

| Group | Tools | Purpose |
|---|---|---|
| Preview | `CaptureSequencerView` | Capture the active level editor viewport as PNG |

Show the shot you want in the active level viewport, then call `CaptureSequencerView` for a loaded or readable sequence. The PNG shows what was in that viewport at the time of capture. The limit is 16 Mi pixels and 8 MiB of compressed PNG data.
