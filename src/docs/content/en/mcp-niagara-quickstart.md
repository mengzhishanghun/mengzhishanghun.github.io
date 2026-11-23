---
title: Prepare and query Niagara for the first time
type: doc
slug: mcp-niagara-quickstart
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-niagara
docPage:
  work: mcp-niagara
  group: getting-started
  slug: quickstart
  order: 1
documentKind: product-manual
websiteRoute: /en/works/mcp-niagara/docs/quickstart/
lang: en
translationKey: doc:mcp-niagara:quickstart
sourceHash: 83d8b854f784658f732c2260e190428decbf7fa93b00f8ba8301cf6ba5f7e557
translationStatus: translated
generatedBodyHash: 430c7c349da5ccc69cbad84395f8c4d4d13bfbb9eba2d87741573e15b22bcc16
---

## Prepare the session

This page starts with MCPNiagara installed and loaded in an Unreal Editor session. Obtain the MCP service address configured for the target editor and add that service in your AI client, following the client's official configuration instructions.

The plugin is in development, and compatibility with UE 5.2–5.8 remains unconfirmed. Start with a copy of the project and check that the client is connected to the intended project.

## Run the first query

You can give the AI this request:

> Connect to the target editor using the MCP address I provide. First list the project's Niagara Systems, then read the system I specify. Do not modify, create, or save assets yet.

Use `ListNiagaraSystems` to find Systems and `GetSystemDetail` to read system details. Continue paged queries using the returned `HasMore` and `NextOffset`. Use the full asset path returned by the query in later requests instead of selecting an asset by display name alone.

See [find and inspect Niagara assets](/en/works/mcp-niagara/docs/inspect/) for pagination parameters and module selection.

## Move from queries to editing

After confirming the target, choose the relevant [System asset operation](/en/works/mcp-niagara/docs/niagara-system-assets/), [emitter edit](/en/works/mcp-niagara/docs/edit-emitter/), or [user parameter edit](/en/works/mcp-niagara/docs/parameters-preview/). Check created or modified assets and save them explicitly as described by the relevant feature.

Cached thumbnails do not render in real time and cannot show whether a recent edit is visible. Check the actual Niagara effect in the target editor to confirm the visual result.
