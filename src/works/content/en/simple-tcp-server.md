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
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19165484
links:
  - label: Original article on CNBlogs
    href: https://www.cnblogs.com/mengzhishanghun/p/19165484
sourceDate: 2025-10-25
lang: en
translationKey: simple-tcp-server
sourceHash: 05edb85ab868d2753a00372ba57f041d28acb51a1e1deb6d4b93f0a4acb8b3e5
translationStatus: translated
generatedBodyHash: ef70f6d8542464145c5dc6df18aeb71aea6bc7986dde629b69b483eb0fba1770
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/zh-cn/listings/cc276a4a-389b-43e3-8a04-a6d628534108
    - kind: docs
      href: /docs/zh/guides/ue-tools/simple-tcp-server-guide/
  compatibility:
    - platforms:
        - Windows (Win64)
        - macOS
        - Linux
        - Android
        - iOS
      requirements:
        - UE 5.2–5.8
---
## Overview

SimpleTCPServer provides multi-client TCP server session management for Unreal Engine.

It exposes client connection and disconnection events, sessions distinguished by IP:Port, and runtime channel configuration to Blueprints, allowing UE to accept external TCP clients.

## Background and goals

Server applications must continually distinguish clients and update state when clients leave. SimpleTCPServer wraps this work around sessions and connection events, giving business logic clear client identifiers and event entry points.

## Core capabilities

### Multi-client sessions

The server identifies connected clients by IP:Port so connections can be handled separately. Callers can associate business data with session identifiers. These identify network endpoints; persistent user identities still require a business protocol.

### Connection events

Notifications are available when clients connect and disconnect. Blueprints can maintain interface or business state from these events, such as displaying current connections and clearing records for offline clients.

### Channel configuration and Blueprint interfaces

The tool supplies runtime channel configuration and Blueprint calls to integrate server communication into UE projects. Message formats, client permissions, and sending policies must be designed around the project protocol.

## Use cases

It suits UE programs acting as TCP servers for several external programs or devices, with later processing distinguished by connection. It focuses on server connections and sessions rather than replacing higher-level business systems.

## Scope and limitations

Only IPv4 is supported; domain names, IPv6, and encrypted connections are not supported. Validate connection counts, session lifecycles, timeouts, and data handling in the target environment. TCP streams have no inherent business message boundaries, so projects define encoding and message splitting rules. IP:Port should not serve directly as security authentication.

For operation steps and parameter details, see the [user guide](/en/docs/guides/ue-tools/simple-tcp-server-guide/).
