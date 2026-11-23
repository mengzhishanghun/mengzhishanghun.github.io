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
sourceHash: 1d49746e2e97850615f2df717e23aa6ed5e6aa2dc55bc4cad262245e3527ab7b
translationStatus: translated
generatedBodyHash: 7b47cff600a4431c5f86819d6ed78882a891383beea22edbf2b7957a2ee820f2
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
