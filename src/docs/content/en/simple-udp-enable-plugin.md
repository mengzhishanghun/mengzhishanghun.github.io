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
sourceHash: d6cf00629683fffb89332848166f4c146668b2f15180c9adf757ee8bc2f46ea7
translationStatus: translated
generatedBodyHash: 5cae0bba8d235a571ed34c93db193d0df4bae4b5b0a8c1da015ab296579c765b
docPage:
  work: simple-udp
  group: setup
  slug: enable-plugin
  order: 1
---

## Compatibility

- Unreal Engine 5.2–5.8
- Version 1.1.0 (Version 2)

## Interface language

Open **Edit → Project Settings**, select the SimpleUDP settings page, and set **Language** to **English** or **Chinese**. English is the default. Available user-facing UI, tooltips, notifications, and functional logs update immediately without restarting the editor. Public API names and module startup/shutdown logs remain in English.

## Enable the plugin

After you enable the plugin, its `GameInstanceSubsystem` runs automatically. You do not need to write startup or shutdown code.

[Configure send and receive channels in Project Settings](/en/works/simple-udp/docs/channels/)
