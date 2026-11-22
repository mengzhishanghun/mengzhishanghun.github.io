---
title: Connect to MCP Material
type: doc
slug: mcp-material-connect
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-material
documentKind: product-manual
websiteRoute: /en/works/mcp-material/docs/connect/
lang: en
translationKey: doc:mcp-material:connect
sourceHash: b40e33767b96c978ff10a80f0c8aeca30f0a16312745d5ba1edd0c02787a5148
translationStatus: translated
generatedBodyHash: 9b0f53cf76aef99f147a948ba211d8a165d1804a22c76313c17131daba2846e6
docPage:
  work: mcp-material
  group: setup
  slug: connect
  order: 1
---

## Endpoint and supported versions

MCPMaterial exposes Unreal Editor material and material-instance workflows to AI clients through MCP tools. The plugin supports Unreal Engine 5.2 and later. Its default endpoint is `http://127.0.0.1:8763/mcp`; when the port is occupied, the server tries a limited sequence of higher ports.

## HTTP limits and failures

HTTP request bodies default to a 1 MiB limit and JSON-RPC response bodies to 8 MiB; both are configurable in the MCP Material project settings.

The server recursively enforces every tool input schema, rejecting unknown fields, missing required fields, invalid types, and out-of-range values even for raw `tools/call` requests.

Oversized tool results preserve the real success/error terminal state while omitting excessive content; do not blindly retry a successful write tool solely because its result was omitted.

JSON-RPC treats only messages without an `id` member as notifications; an explicit `id:null` still receives a response with a null id.

A timeout cannot forcibly stop an editor operation after the GameThread has claimed it. After a timeout error, inspect editor state before retrying.

## Feedback

Send feedback to [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com).
