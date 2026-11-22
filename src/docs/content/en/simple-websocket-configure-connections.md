---
title: Configure Named WebSocket Connections
type: doc
slug: simple-websocket-configure-connections
draft: false
sitePublish: true
tags:
  - WebSocket
workIds:
  - simple-websocket
documentKind: product-manual
websiteRoute: /en/works/simple-websocket/docs/configure-connections/
lang: en
translationKey: doc:simple-websocket:configure-connections
sourceHash: 692b5690be058b4edeb263cfe14ea1160302589885351ac9f9baa728a0080ee3
translationStatus: translated
generatedBodyHash: 95e8e4d089bac23660703e2f07d4a3e1287edf5c95d64916dfc1e71e2b3aea2e
docPage:
  work: simple-websocket
  group: setup
  slug: configure-connections
  order: 1
---

## Compatibility

- Unreal Engine 5.2–5.8
- Version 1.1.0 (Version 2)

## Interface language

Open **Edit → Project Settings**, select the SimpleWebSocket settings page, and set **Language** to **English** or **Chinese**. English is the default. Available user-facing UI, tooltips, notifications, and functional logs update immediately without restarting the editor. Public API names and module startup/shutdown logs remain in English.

## Add a named connection

1. Enable the plugin in Unreal Engine Editor.  
2. Go to `Edit > Project Settings`  
3. Scroll down and find `Simple WebSocket Settings`  
4. Add a new WebSocket connection entry (e.g., named `Test`)  
5. Enter the WebSocket address (recommended format: `ws://127.0.0.1:xxxx`)  
6. Enable **Auto Connect** (optional; if enabled, the connection will be established automatically at runtime)

![](/media-occurrence/doc%3Asimple-websocket%3Aconfigure-connections%3Amedia%3A1)

## Address and protocol limits

The plugin supports `ws://` only. It does not support `wss://`. For a server on your own machine, use `127.0.0.1` instead of `localhost`.

[Use a configured connection in Blueprint](/en/works/simple-websocket/docs/connect-and-send/)
