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
sourceHash: 720505d493a2bb5c6d62298cb9c2d8827c247168e8376e8b28bca607ef3c84d5
translationStatus: translated
generatedBodyHash: 6e3744edd6a6bf77dce44d04e94772ac1afa22b492661d44f90eba0e3822d8d3
docPage:
  work: simple-websocket
  group: features
  slug: connect-and-send
  order: 1
---

The GameInstance manages these static functions. Use the configured connection name when calling them from a Blueprint.

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

Connect using the configuration name, or skip that step if the connection opened automatically. Check its state, bind a receive event, and send a test message. When you finish, use the same name to close only that connection.

![](/media-occurrence/doc%3Asimple-websocket%3Aconnect-and-send%3Amedia%3A1)
