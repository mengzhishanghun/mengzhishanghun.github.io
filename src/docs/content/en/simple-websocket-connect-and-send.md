---
title: Manage WebSocket Connections and Messages in Blueprint
type: doc
slug: simple-websocket-connect-and-send
draft: false
sitePublish: true
tags:
  - WebSocket
workIds:
  - simple-websocket
documentKind: product-manual
websiteRoute: /en/works/simple-websocket/docs/connect-and-send/
lang: en
translationKey: doc:simple-websocket:connect-and-send
sourceHash: 703fdc8656972b1a625115eeb759dc4a54831c7cda6ff18d34ecb1dff2a44652
translationStatus: translated
generatedBodyHash: 4c9535f96ad8c01ecd0b1446782899ada76d213e1db9706c9aba35dab5fbc0f6
docPage:
  work: simple-websocket
  group: network
  slug: connect-and-send
  order: 1
---

These static functions are scoped to the GameInstance. Call them from any Blueprint using the configured connection name.

## Connect, inspect, and close

- `Connect Web Socket`: Connect to a WebSocket by name  
- `Close Web Socket`: Close a specific connection  
- `Close All Web Socket`: Close all connections  
- `Check Web Socket Connect`: Check if a connection is established  
- `Get Web Socket Config`: Retrieve config for a named connection  

## Send text and bind callbacks

- `Send WebSocket Message`: Send a text message  
- `Bind Web Socket Message`: Bind a Blueprint event to receive messages (supports multiple callbacks)  
- `Unbind Web Socket Message`: Unbind a message event  

## Blueprint example

![](/media-occurrence/doc%3Asimple-websocket%3Aconnect-and-send%3Amedia%3A1)
