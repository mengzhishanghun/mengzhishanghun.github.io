---
title: SimpleTCPServer
description: Provide multi-client TCP server sessions and connection event interfaces.
type: work
slug: simple-tcp-server
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
order: 5
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
translationKey: simple-tcp-server
sourceHash: 20ee9efc644400fe8db123d482b754e43d40a769c3fdc4e6987d5532d4692306
translationStatus: translated
generatedBodyHash: e6680192b53159142fad9c176e7a6a310d7954bd72385f414853ba1dbe580534
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/zh-cn/listings/cc276a4a-389b-43e3-8a04-a6d628534108
    - kind: docs
      href: /en/works/simple-tcp-server/docs/listen/
websiteCoverUrl: /media/covers/works/simple-tcp-server-20261101.webp
coverAlt: SimpleTCPServer cover
docIds:
  - simple-tcp-server-listen
  - simple-tcp-server-sessions
  - simple-tcp-server-messages
  - simple-tcp-server-native-server
---

## Overview

SimpleTCPServer provides multi-client TCP server session management for Unreal Engine.

It exposes client connection and disconnection events, sessions distinguished by IP:Port, and runtime channel configuration to Blueprints, allowing UE to accept external TCP clients.

## Background and goals

Servers often need to track each client separately. SimpleTCPServer provides session identifiers and connection events so the application can update its records when clients join or leave.

## Core capabilities

### Multi-client sessions

The server identifies connected clients by IP:Port so connections can be handled separately. Callers can associate business data with session identifiers. These identify network endpoints; persistent user identities still require a business protocol.

When the server accepts a client, the plugin assigns it a `SessionChannel`. Use `GetAllSessions` to list the active sessions for a listening channel, or `IsSessionConnected` to check a specific session.

### Connection events

Notifications are available when clients connect and disconnect. Blueprints can maintain interface or business state from these events, such as displaying current connections and clearing records for offline clients.

### Channel configuration and Blueprint interfaces

The tool supplies runtime channel configuration and Blueprint calls to integrate server communication into UE projects. Message formats, client permissions, and sending policies must be designed around the project protocol.

Set the bind address, maximum concurrent connections, and receive buffer size on each listening channel. Update the channel at runtime with `UpdateTCPServerConfig`. Use `SendMessage` to reply to one client or `BroadcastMessage` to send the same byte array to every client on the channel.

## Use cases

It suits UE programs acting as TCP servers for several external programs or devices, with later processing distinguished by connection. It focuses on server connections and sessions rather than replacing higher-level business systems.

## Workflow

1. Add a named channel such as `MainServer` in **Project Settings → SimpleTCPServer Settings**. Set the listen address and connection limit, then start listening with `StartServer`.
2. Use `BindConnectHandle` to track when clients connect or disconnect and `BindMessageHandle` to receive data. If several devices are connected, for example, use the session ID to reply to the one that made the request.
3. Call `StopServer` to stop listening. The plugin closes the listening socket and disconnects the clients on that channel.

![](/media-occurrence/work%3Asimple-tcp-server%3Amedia%3A1)

[See session management](/en/works/simple-tcp-server/docs/sessions/) · [See messaging](/en/works/simple-tcp-server/docs/messages/)

## Scope and limitations

Only IPv4 is supported; domain names, IPv6, and encrypted connections are not supported. Validate connection counts, session lifecycles, timeouts, and data handling in the target environment. TCP streams have no inherent business message boundaries, so projects define encoding and message splitting rules. IP:Port should not serve directly as security authentication.

To enable the plugin and configure listening, see the [user guide](/en/works/simple-tcp-server/docs/listen/).

## Support and feedback

[Contact and collaboration](https://mzsh.me/contact/)
