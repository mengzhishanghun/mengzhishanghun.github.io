---
title: SimpleWebSocket
description: Use WebSocket communication in UE through named connections and message delegates.
type: work
slug: simple-websocket
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
order: 2
status: Official documentation
featured: false
draft: false
sitePublish: false
tags:
  - WebSocket
  - Simple series
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19165484
links:
  - label: Original article on CNBlogs
    href: https://www.cnblogs.com/mengzhishanghun/p/19165484
sourceDate: 2025-10-25
lang: en
translationKey: simple-websocket
sourceHash: 27ca3a6446edbd3b2a23c59bd997b5dee3b6932cb885b5f87000e16ea8485555
translationStatus: translated
generatedBodyHash: bc32a19bf7240b9d2939837c0b75c69404358ecc599fc2d087be8062b9e36ff1
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/zh-cn/listings/70e9040b-66c0-4793-a219-93203a117545
    - kind: docs
      href: /en/works/simple-websocket/docs/configure-connections/
  compatibility:
    - platforms:
        - Windows (Win64)
        - macOS
        - Linux
        - Android
        - iOS
      requirements:
        - UE 5.2–5.8
websiteCoverUrl: /media/covers/works/simple-websocket-20261101.webp
coverAlt: SimpleWebSocket cover
docIds:
  - simple-websocket-configure-connections
  - simple-websocket-connect-and-send
  - simple-websocket-native-module
---

## Overview

SimpleWebSocket wraps WebSocket connection management in Unreal Engine. Projects distinguish peers using named connections, bind message delegates, and call interfaces from Blueprints.

It suits UE applications exchanging messages continuously with WebSocket services.

## Background and goals

When a project connects to several WebSocket services, give each connection a name, decide when to establish it, and bind a handler for incoming messages.

## Core capabilities

### Named connection management

Connections can be managed by name, associating services or purposes with explicit entries. Connections can also be established at project startup so persistent communication begins with the application workflow.

### Message delegates

Incoming messages can be passed to callers through delegates. Blueprints subscribe to events and interpret content using the business protocol. Delegates provide dispatch after arrival; they do not define message structure.

Use `Bind Web Socket Message` to attach multiple receive callbacks to the same connection. Send text with `Send WebSocket Message`, and unbind callbacks when you no longer need to handle messages on that connection.

### Blueprint interfaces

Connection and messaging capabilities are exposed through Blueprint interfaces for project logic. Network addresses, reachability, and server behavior depend on deployment. Connection names do not automatically discover servers.

## Use cases

It suits UE projects exchanging real-time messages with existing WebSocket services, distinguishing connections by purpose, and responding in Blueprints. Connections may target external control systems or messaging services, with interaction determined by the peer's protocol.

## Workflow

1. Add a named connection, such as `Test`, in **Project Settings → Simple WebSocket Settings** and fill in the service address. Turn on **Auto Connect** to connect when the app starts.
2. To connect manually, pass the name to `Connect Web Socket` and check the result with `Check Web Socket Connect`. Once connected, bind callbacks and send text. For example, you can pass incoming messages to a control panel inside UE.
3. Use `Close Web Socket` to close one connection or `Close All Web Socket` to close all of them.

![](/media-occurrence/work%3Asimple-websocket%3Amedia%3A1)

[See the Blueprint connection and messaging nodes](/en/works/simple-websocket/docs/connect-and-send/)

## Scope and limitations

Only `ws://` is supported; secure `wss://` connections are not supported. An accessible WebSocket service and agreed message format are required. Recovery after closure, authentication, and message reliability handling must be designed and verified for project needs.

To configure named connections, see the [user guide](/en/works/simple-websocket/docs/configure-connections/).

For a local service, the guide recommends using `127.0.0.1` as the host address instead of `localhost`.

## Support and feedback

[Contact and collaboration](https://mzsh.me/contact/)

## Packaged projects

SimpleWebSocket can be used in packaged UE builds.
