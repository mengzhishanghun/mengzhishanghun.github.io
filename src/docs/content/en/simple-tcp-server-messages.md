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
sourceHash: a95caf5ee79b0813b8b1b28e85099186bb0e096894e45e09d1273585311fc41b
translationStatus: translated
generatedBodyHash: 0890bfb02084e8ca6341f1255900dc9312f0cef993aebf377b2fc738dea9913f
docPage:
  work: simple-tcp-server
  group: network
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

| Node Function        | Description                                      |
|----------------------|--------------------------------------------------|
| `SendMessage`        | Send byte array to a specific SessionChannel     |
| `BroadcastMessage`   | Send byte array to all connections on a channel  |

## Client plugin and byte conversion

- **SimpleTCPClient Plugin**  
  Lightweight plugin designed for client-side usage, ideal for connecting to a SimpleTCPServer instance.

- **SimpleByteConversion Plugin**
  Enables conversion between native Unreal types (e.g., FString, float, int) and `TArray<uint8>`, ideal for building structured protocols.
