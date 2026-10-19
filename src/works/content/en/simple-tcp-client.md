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
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19165484
links:
  - label: Original article on CNBlogs
    href: https://www.cnblogs.com/mengzhishanghun/p/19165484
sourceDate: 2025-10-25
lang: en
translationKey: simple-tcp-client
sourceHash: 77b288cc14b0d3d8a82ec9a846bbdbd96e3c4ae1f791e4756c988d95ad76cc92
translationStatus: translated
generatedBodyHash: c9b62ff831e30c54bdd234710e6cdb550058a1e502c124847180ea1f7b825420
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/zh-cn/listings/6d6d46bf-eaed-4b66-8382-9d69eb56981e
    - kind: docs
      href: /docs/zh/guides/ue-tools/simple-tcp-client-guide/
  compatibility:
    - platforms:
        - Windows (Win64)
        - macOS
        - Linux
      requirements:
        - UE 5.2–5.8
---
## Overview

SimpleTCPClient wraps TCP client connections in Unreal Engine, providing multi-channel management, asynchronous processing, configurable automatic reconnection intervals, and Blueprint connection state interfaces.

It helps centralize establishing and maintaining connections to external services.

## Background and goals

A UE application may connect to several external programs or services at once. A single Socket example explains TCP transfer but does not cover distinguishing multiple connection states or handling disconnections.

This work manages client connections by channel so callers can observe state in Blueprints and configure retry behavior for their projects.

## Core capabilities

### Independent channel management

Several TCP client channels maintain their connections independently, preventing different service states from being mixed in one entry point. Projects distinguish peers by channel and establish their own data handling rules.

### Asynchronous processing and reconnection

Connection work is asynchronous, with configurable automatic reconnection intervals after disconnection. Reconnection restores the transport channel. Resending messages, restoring login, and synchronizing business state remain decisions for the service protocol and caller.

### State delegates and Blueprint calls

Connection state is exposed through delegates so Blueprints can respond to changes. Projects can integrate connection and disconnection feedback into interfaces or business workflows, while both ends still need explicit agreements for encoding, framing, and parsing.

## Use cases

It suits applications where UE initiates TCP connections, maintains several communication targets, or retries at a chosen interval after a service disconnects. Projects can configure channels separately and process each service's business data according to connection state.

## Scope and limitations

Only IPv4 is supported; domain names, IPv6, and encrypted connections are not supported. TCP transports a byte stream. Connection management does not automatically define business message boundaries, serialization, or state recovery after reconnection. Verify disconnection, retry, and data processing against the actual server protocol and check each channel's configuration.

For operation steps and parameter details, see the [user guide](/en/docs/guides/ue-tools/simple-tcp-client-guide/).
