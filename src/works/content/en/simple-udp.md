---
title: SimpleUDP
description: Expose UDP sending, receiving, channel configuration, and address filtering through Blueprint interfaces.
type: work
slug: simple-udp
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
order: 3
status: Official documentation
featured: false
draft: false
sitePublish: false
tags:
  - UDP
  - Simple series
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19165484
links:
  - label: Original article on CNBlogs
    href: https://www.cnblogs.com/mengzhishanghun/p/19165484
sourceDate: 2025-10-25
lang: en
translationKey: simple-udp
sourceHash: 05690028e0466f00e46d77a81d0e1fb2dcb289e7c5f97cc600bda3cf3239a3d6
translationStatus: translated
generatedBodyHash: 0af7cdd6e2f9d3e63cc00245c1b3a00223cc609c3215d2f6d5e2123fec542b56
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/zh-cn/listings/9e0d0c8c-ac79-4699-925c-abdfe9ac51eb
    - kind: docs
      href: /en/works/simple-udp/docs/enable-plugin/
  compatibility:
    - platforms:
        - Windows (Win64)
        - macOS
        - Linux
      requirements:
        - UE 5.2–5.8
websiteCoverUrl: /media/covers/works/simple-udp-20261101.webp
coverAlt: SimpleUDP cover
docIds:
  - simple-udp-enable-plugin
  - simple-udp-channels
  - simple-udp-messages
  - simple-udp-native-sockets
---

## Overview

SimpleUDP lets Unreal Engine projects manage several UDP send and receive channels in Blueprint. Receive data asynchronously, filter it by source address, and update channel settings at runtime.

It targets projects that maintain UDP channels for different purposes and restrict source addresses at the receiver.

## Background and goals

UDP can serve LAN messages, external device data, and other time-sensitive transmission scenarios. In practice, projects need to distinguish channels, configure addresses, and filter senders.

SimpleUDP wraps those communication management requirements in Blueprint interfaces.

## Core capabilities

### Multi-channel sending and receiving

Several UDP channels can be configured and managed separately, with data sent and received per channel. Reception is asynchronous, keeping data waits out of the caller's main Blueprint flow. Projects name and organize channels to match devices or business purposes.

A receive channel sets the local bind address, receive size limit, and source filters. A send channel sets the destination list and send size limit, and can bind its socket to a specific local port.

### Address filtering and broadcast

Receivers can filter sources through IP allowlists, blocklists, and CIDR ranges, with broadcast address support. Filtering limits network sources accepted for processing; it does not replace message identity validation or content checks.

### Runtime configuration and Blueprint interfaces

Channel parameters can change at runtime, and Blueprints call the wrapped communication operations. Projects can integrate data into their own workflows, while both ends must still agree on byte formats, field meanings, and exception handling.

At runtime, use `UpdateReceiveChannelConfig` or `UpdateSendChannelConfig` to update the corresponding channel. Release the original socket before assigning its local port to another channel.

## Use cases

It suits UE projects exchanging UDP data with LAN devices or external programs, requiring several independent ports or address-based filtering. Broadcast discovery and reception from multiple sources can also use channel and filter configuration to organize communication entry points.

## Workflow

1. Enable the plugin and add channels in **Project Settings → SimpleUDP Settings**. For example, a LAN receive channel can bind to `0.0.0.0:9000` and allow only `192.168.1.0/24`.
2. Subscribe with `BindUDPMessageHandler`. The first binding creates the receive socket. Removing the last handler closes it.
3. Pass a byte array to `SendUDPMessage` on a send channel. The peers agree on how to encode and parse the bytes.

![](/media-occurrence/work%3Asimple-udp%3Amedia%3A1)

[Configure send and receive channels](/en/works/simple-udp/docs/channels/) · [See messaging examples](/en/works/simple-udp/docs/messages/)

## Scope and limitations

Only IPv4 is supported; IPv6 and domain name resolution are not supported. UDP does not guarantee reliable delivery or arrival in send order. Projects implement message parsing, packet-loss handling, and business state maintenance. Verify channels, destination addresses, and filters against the actual network and protocol.

To enable the plugin, see the [user guide](/en/works/simple-udp/docs/enable-plugin/).

## Support and feedback

[Contact and collaboration](https://mzsh.me/contact/)
