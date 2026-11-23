---
title: SimpleTCPClient
description: Manage multi-channel TCP client connections, asynchronous processing, and reconnection.
type: work
slug: simple-tcp-client
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
order: 4
status: Official documentation
featured: false
draft: false
sitePublish: false
tags:
  - TCP
  - Simple series
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19165484
links:
  - label: Original article on CNBlogs
    href: https://www.cnblogs.com/mengzhishanghun/p/19165484
sourceDate: 2025-10-25
lang: en
translationKey: simple-tcp-client
sourceHash: 6b8e79a24b00ec9be860819d657c1417902a1c57b6e46f6a3a8bd51f5167ffca
translationStatus: translated
generatedBodyHash: cd606e4222ca5ec8e60bf0b986608125e3ca15991034b96d04b1255136ecc057
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/zh-cn/listings/6d6d46bf-eaed-4b66-8382-9d69eb56981e
    - kind: docs
      href: /en/works/simple-tcp-client/docs/enable-plugin/
websiteCoverUrl: /media/covers/works/simple-tcp-client-20261101.webp
coverAlt: SimpleTCPClient cover
docIds:
  - simple-tcp-client-enable-plugin
  - simple-tcp-client-connect
  - simple-tcp-client-messages
  - simple-tcp-client-native-client
---

## Overview

SimpleTCPClient wraps TCP client connections in Unreal Engine, providing multi-channel management, asynchronous processing, configurable automatic reconnection intervals, and Blueprint connection state interfaces.

It helps centralize establishing and maintaining connections to external services.

## Background and goals

A UE application may connect to several external programs or services at once. A single Socket example explains TCP transfer but does not cover distinguishing multiple connection states or handling disconnections.

The plugin manages each connection by channel. Check the status of each channel in Blueprint and configure retry behavior for your project.

## Core capabilities

### Independent channel management

Several TCP client channels maintain their connections independently, preventing different service states from being mixed in one entry point. Projects distinguish peers by channel and establish their own data handling rules.

Each channel has its own name, remote address, and receive limit. A `GameInstanceSubsystem` manages the connections, so changing levels does not interrupt them.

### Asynchronous processing and reconnection

Connection work is asynchronous, with configurable automatic reconnection intervals after disconnection. Reconnection restores the transport channel. Resending messages, restoring login, and synchronizing business state remain decisions for the service protocol and caller.

Enable **Auto Connect** in Project Settings or start the channel manually in Blueprint. Use `UpdateTCPClientConfig` to add or update a channel. Existing message delegates still work after the socket reconnects.

### State delegates and Blueprint calls

Connection state is exposed through delegates so Blueprints can respond to changes. Projects can integrate connection and disconnection feedback into interfaces or business workflows, while both ends still need explicit agreements for encoding, framing, and parsing.

## Use cases

It suits applications where UE initiates TCP connections, maintains several communication targets, or retries at a chosen interval after a service disconnects. Projects can configure channels separately and process each service's business data according to connection state.

## Workflow

1. Add a channel in **Project Settings → SimpleTCPClient Settings**. For a local test, name it `DefaultClient` and point it at `127.0.0.1:8888`.
2. If automatic connection is off, start the channel with `StartConnection`. Check its state with `IsConnected`.
3. Register a callback with `BindMessageHandle` to receive data and pass a byte array to `SendMessage` to send it. Call `StopConnection` to close the socket when you no longer need the channel.

![](/media-occurrence/work%3Asimple-tcp-client%3Amedia%3A1)

[See messaging examples](/en/works/simple-tcp-client/docs/messages/)

## Scope and limitations

Only IPv4 is supported; domain names, IPv6, and encrypted connections are not supported. TCP transports a byte stream. Connection management does not automatically define business message boundaries, serialization, or state recovery after reconnection. Verify disconnection, retry, and data processing against the actual server protocol and check each channel's configuration.

To enable the plugin and make your first connection, see the [user guide](/en/works/simple-tcp-client/docs/enable-plugin/).

## Support and feedback

[Contact and collaboration](https://mzsh.me/contact/)

## Choosing a network protocol

UDP is often used for frequent sensor, simulator, and LAN data. TCP provides an ordered byte stream between clients and servers. WebSocket suits existing web services, browser control panels, and real-time messages across languages. Choose based on tolerance for packet loss, latency, message format, and deployment conditions; a protocol name alone does not establish reliability or cost.

- [SimpleUDP tutorial](/en/works/simple-udp/docs/channels/): send and receive channels and address filtering.
- [SimpleTCPServer tutorial](/en/works/simple-tcp-server/docs/listen/): enabling the plugin and configuring the listener.
- [SimpleWebSocket tutorial](/en/works/simple-websocket/docs/connect-and-send/): managing connections and exchanging messages in Blueprint.
- [SimpleByteConversion tutorial](/en/works/simple-byte-conversion/docs/primitive-bytes/): conversion between application types and byte arrays.

The original technical record also mentions the `Send Http Request` Blueprint node and third-party libraries for MQTT or gRPC where needed. Availability of a particular HTTP node depends on the modules or plugins enabled in the project; check your project. Those protocol implementations are outside this guide.
