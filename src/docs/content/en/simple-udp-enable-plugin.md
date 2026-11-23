---
title: Enable SimpleUDP
type: doc
slug: simple-udp-enable-plugin
draft: false
sitePublish: true
tags:
  - UDP
workIds:
  - simple-udp
documentKind: product-manual
websiteRoute: /en/works/simple-udp/docs/enable-plugin/
lang: en
translationKey: doc:simple-udp:enable-plugin
sourceHash: 438ae8820752aa95efcad3238647c1496d38c5df8bf0f3e16696ddf94ac3a2ef
translationStatus: translated
generatedBodyHash: 7dce21c9d72211fa1529df9fc0f296ea8b6ee355e10f41e43f48a76bd4a22d6f
docPage:
  work: simple-udp
  group: getting-started
  slug: enable-plugin
  order: 1
---

## Compatibility

- Unreal Engine 5.2–5.8
- Version 1.1.0 (Version 2)

## Interface language

Open **Edit → Project Settings**, select the SimpleUDP settings page, and set **Language** to **English** or **Chinese**. English is the default. Available user-facing UI, tooltips, notifications, and functional logs update immediately without restarting the editor. Public API names and module startup/shutdown logs remain in English.

## Enable the plugin

Configure the channels after enabling the plugin. A receive channel needs a local listening endpoint; a send channel needs a destination. In Blueprint, use the corresponding channel name when binding a receiver or sending data.

Once enabled, the plugin runs through its `GameInstanceSubsystem`. You don’t need to write startup or shutdown code.

[Configure send and receive channels in Project Settings](/en/works/simple-udp/docs/channels/)
