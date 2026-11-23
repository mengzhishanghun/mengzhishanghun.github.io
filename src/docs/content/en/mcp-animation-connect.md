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
sourceHash: 9796e595bf99f7c84e03cff30d39bdb40c10e61b365388eaa60b80439d973d2e
translationStatus: translated
generatedBodyHash: 6a847de6164bfcbed30296a34a0738db5361d0c4caa9840ac0ef93d8ed0af735
docPage:
  work: mcp-animation
  group: getting-started
  slug: connect
  order: 1
---

MCPAnimation is a self-contained Unreal Editor plugin that exposes Animation Blueprint, state machine, Skeleton, AnimSequence, Montage, AnimNotify, and BlendSpace discovery, inspection, and editing through HTTP MCP. It does not depend on other user-created plugins. UE 5.2–5.8 are development targets; compatibility is still being checked, so try the plugin in your target version first.

## Connection

Enable the plugin in Unreal Editor and enter the endpoint shown in the editor in your client’s HTTP MCP settings. It defaults to `http://127.0.0.1:8760/mcp`; if that port is in use, the server tries later ports. Use `initialize` to start the session, `tools/list` to see what is available, and `tools/call` to run a tool. Use `ping` to check the connection.

## Input validation and scope

Inputs use strict JSON Schema. Unknown properties are rejected, and array items are validated recursively.

This is an Editor-only plugin; it does not provide runtime or network-game replication features.

The tools do not compile C++, build Unreal projects, or package plugins.

## Differences from the official UE 5.8 toolset

UE 5.8’s official `AnimationAssistantToolset` focuses on Level Sequence, Control Rig, Sequencer channels, and Sequencer curves. MCPAnimation works with animation assets and does not provide those Sequencer or Control Rig operations.

## Feedback

Send feedback to [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com).
