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
sourceHash: dde9bce372ca118254f06da479d90abfe946020eaa43b73af03e99aae125dcd6
translationStatus: translated
generatedBodyHash: bf7663db94c9780bf8091e56e57805730ca5f184febda140cb1fd5fd213b91c2
docPage:
  work: simple-tcp-client
  group: setup
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

After enabling the plugin, open **Project Settings → SimpleTCPClient Settings** and follow the [connection setup](/en/works/simple-tcp-client/docs/connect/) to create a channel.
