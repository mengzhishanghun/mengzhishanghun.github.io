---
title: Connect to MCP Animation
type: doc
slug: mcp-animation-connect
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-animation
documentKind: product-manual
websiteRoute: /en/works/mcp-animation/docs/connect/
lang: en
translationKey: doc:mcp-animation:connect
sourceHash: 0f08ea5abf952f8fdb3f517d65db517aef0142472fb043fcbe0599a270dbb7d4
translationStatus: translated
generatedBodyHash: adbcd89a69ec51d2b6bfc33a876de8c461f1401f9cbc6a7f15c35fac00b97d32
docPage:
  work: mcp-animation
  group: setup
  slug: connect
  order: 1
---

MCPAnimation is a self-contained Unreal Editor plugin that exposes Animation Blueprint, state machine, Skeleton, AnimSequence, Montage, AnimNotify, and BlendSpace discovery, inspection, and editing through HTTP MCP. It supports Unreal Engine 5.2 and later and has no dependency on other user-created plugins.

## Connection

The default endpoint is `http://127.0.0.1:8760/mcp`. If that port is occupied, the server tries subsequent ports; use the actual endpoint shown in the editor. The server implements `initialize`, `tools/list`, `tools/call`, and `ping`.

## Input validation and scope

Inputs use strict JSON Schema. Unknown properties are rejected, and array items are validated recursively.

This is an Editor-only plugin; it does not provide runtime or network-game replication features.

The tools do not compile C++, build Unreal projects, or package plugins.

## Differences from the official UE 5.8 toolset

UE 5.8’s official `AnimationAssistantToolset` focuses on Level Sequence, Control Rig, Sequencer channels, and Sequencer curves. MCPAnimation works with animation assets and does not provide those Sequencer or Control Rig operations.

## Feedback

Send feedback to [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com).
