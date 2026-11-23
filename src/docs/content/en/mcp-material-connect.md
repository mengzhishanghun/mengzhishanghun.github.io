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
sourceHash: 48eb77276ecb9d6b5ca24f06d883420029cc6ba76e0b725859ba2401af108682
translationStatus: translated
generatedBodyHash: 450edd514f3993a447248c18df7094e8cfa5e5025523722b3ddebb480d494c56
docPage:
  work: mcp-material
  group: getting-started
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

If the GameThread has picked up the operation, it may keep running after the client reports a timeout. Read the target asset back to see whether the request took effect before deciding whether to retry.

## Feedback

Send feedback to [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com).
