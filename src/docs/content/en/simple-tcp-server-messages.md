---
title: Send and Receive TCP Server Messages
type: doc
slug: simple-tcp-server-messages
draft: false
sitePublish: true
tags:
  - TCP
workIds:
  - simple-tcp-server
documentKind: product-manual
websiteRoute: /en/works/simple-tcp-server/docs/messages/
lang: en
translationKey: doc:simple-tcp-server:messages
sourceHash: a16e66f25ff471eb98449d5c13db982896348bdb18bc6f65b138a945aaae2f5f
translationStatus: translated
generatedBodyHash: ad76ebf7f7eca1cf590cf6c3f4bb6afb2b09ea1996284ad4504a59392cb72442
docPage:
  work: simple-tcp-server
  group: features
  slug: messages
  order: 2
---

## Receive client messages

| Node Function             | Description                                |
|---------------------------|--------------------------------------------|
| `BindMessageHandle`       | Bind message receive delegate              |
| `UnbindMessageHandle`     | Unbind a specific delegate                 |
| `UnbindAllMessageHandle`  | Unbind all delegates                       |

## Send to one session or broadcast to a channel

For a reply to one client, check its session identifier in the current session list. Use broadcast when every client on the channel should receive the payload. Both ends need to agree on encoding and framing.

| Node Function        | Description                                      |
|----------------------|--------------------------------------------------|
| `SendMessage`        | Send byte array to a specific SessionChannel     |
| `BroadcastMessage`   | Send byte array to all connections on a channel  |

## Client plugin and byte conversion

- **SimpleTCPClient Plugin**  
  A lightweight client plugin that can connect to a SimpleTCPServer instance.

- **SimpleByteConversion Plugin**
  Enables conversion between native Unreal types (e.g., FString, float, int) and `TArray<uint8>`, ideal for building structured protocols.
