---
title: Enable SimpleTCPClient
type: doc
slug: simple-tcp-client-enable-plugin
draft: false
sitePublish: true
tags:
  - TCP
workIds:
  - simple-tcp-client
documentKind: product-manual
websiteRoute: /en/works/simple-tcp-client/docs/enable-plugin/
lang: en
translationKey: doc:simple-tcp-client:enable-plugin
sourceHash: 97dd525f9d298e1ff6ac9aec65f1f10d881dceab9cc3d675e495babc47c15eca
translationStatus: translated
generatedBodyHash: 729676dc385049e4585e00d57f4aa023c66ad031dab49aa41fae0e4b941278b4
docPage:
  work: simple-tcp-client
  group: getting-started
  slug: enable-plugin
  order: 1
---

## Compatibility

- Unreal Engine 5.2–5.8
- Version 1.1.0 (Version 2)

## Interface language

Open **Edit → Project Settings**, select the SimpleTCPClient settings page, and set **Language** to **English** or **Chinese**. English is the default. Available user-facing UI, tooltips, notifications, and functional logs update immediately without restarting the editor. Public API names and module startup/shutdown logs remain in English.

## Enable the plugin

Once you enable the plugin, its `GameInstanceSubsystem` starts automatically and manages connections. You do not need startup or shutdown code. The plugin lives for the lifetime of the `GameInstance`, so changing levels does not affect it.

## First connection

Start the target TCP service listening first. Once the channel is configured, let it connect automatically or start it from Blueprint. Check the channel’s connection state before testing message exchange.

Open **Project Settings → SimpleTCPClient Settings** and follow the [connection setup](/en/works/simple-tcp-client/docs/connect/) to create a channel.

![SimpleTCPClient channel configuration](/media-occurrence/doc%3Asimple-tcp-client%3Aenable-plugin%3Amedia%3A1)

Enter the channel name and server address in TCP Client Settings, then configure automatic connection and reconnection as needed.
