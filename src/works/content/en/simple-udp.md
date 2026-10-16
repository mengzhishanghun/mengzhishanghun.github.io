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
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19165484
links:
  - label: Original article on CNBlogs
    href: https://www.cnblogs.com/mengzhishanghun/p/19165484
sourceDate: 2025-10-25
lang: en
translationKey: simple-udp
sourceHash: 658d15db4480422450f907fb5e15bcdf19524687b13fb635b3af21fb7281f27c
translationStatus: translated
generatedBodyHash: 6e947f0d40850957a39590d658a152604186d214a3106c4b06cc86f37e9d744a
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/zh-cn/listings/9e0d0c8c-ac79-4699-925c-abdfe9ac51eb
    - kind: docs
      href: /docs/zh/guides/ue-tools/simple-udp-guide/
  compatibility:
    - platforms:
        - Windows (Win64)
        - macOS
        - Linux
      requirements:
        - UE 5.2–5.8
---
## Overview

SimpleUDP provides Blueprint-callable UDP communication for Unreal Engine projects, combining multi-channel sending and receiving, asynchronous reception, address filtering, and runtime configuration in one plugin.

It targets projects that maintain UDP channels for different purposes and restrict source addresses at the receiver.

## Background and goals

UDP can serve LAN messages, external device data, and other time-sensitive transmission scenarios. In practice, projects need to distinguish channels, configure addresses, and filter senders.

SimpleUDP wraps those communication management requirements in Blueprint interfaces.

## Core capabilities

### Multi-channel sending and receiving

Several UDP channels can be configured and managed separately, with data sent and received per channel. Reception is asynchronous, keeping data waits out of the caller's main Blueprint flow. Projects name and organize channels to match devices or business purposes.

### Address filtering and broadcast

Receivers can filter sources through IP allowlists, blocklists, and CIDR ranges, with broadcast address support. Filtering limits network sources accepted for processing; it does not replace message identity validation or content checks.

### Runtime configuration and Blueprint interfaces

Channel parameters can change at runtime, and Blueprints call the wrapped communication operations. Projects can integrate data into their own workflows, while both ends must still agree on byte formats, field meanings, and exception handling.

## Use cases

It suits UE projects exchanging UDP data with LAN devices or external programs, requiring several independent ports or address-based filtering. Broadcast discovery and reception from multiple sources can also use channel and filter configuration to organize communication entry points.

## Scope and limitations

UDP does not guarantee reliable delivery or arrival in send order. Projects implement message parsing, packet-loss handling, and business state maintenance. Verify channels, destination addresses, and filters against the actual network and protocol.
