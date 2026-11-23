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
sourceHash: 748a22309bac372907c9ccee3f7e4f7218fd8efe963ac9c3128d9f1bf63cf904
translationStatus: translated
generatedBodyHash: 25d251f403ffe0a9a3aa19b632dd6256157f3dc3dca86fd5f351c2f4fbcd0320
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

![SimpleUDP receive and send channel settings](/media-occurrence/doc%3Asimple-udp%3Aenable-plugin%3Amedia%3A1)

Configure receive and send channels separately in Simple UDP Settings. Check the channel documentation when filling in listening and destination addresses.
