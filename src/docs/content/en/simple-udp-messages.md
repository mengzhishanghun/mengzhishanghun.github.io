---
title: Send and Receive UDP Datagrams
type: doc
slug: simple-udp-messages
draft: false
sitePublish: true
tags:
  - UDP
workIds:
  - simple-udp
documentKind: product-manual
websiteRoute: /en/works/simple-udp/docs/messages/
lang: en
translationKey: doc:simple-udp:messages
sourceHash: fecb01eae143d72f6b8ee37925fb7023c513d8f24b97d58fdc5ee3539458f5cb
translationStatus: translated
generatedBodyHash: e7e7f208628cb698f49d92aa9bf095804d3aedff6fb27cabe0e0d12b97aaf161
docPage:
  work: simple-udp
  group: features
  slug: messages
  order: 2
---

## Receive datagrams

First check the receive channel’s name, bind address, and filter rules in Project Settings. Use the same channel name when binding and unbinding a handler. Once the handler is bound, send a test datagram from a permitted sender and check that the callback receives the expected bytes.

| Node                         | Description                             |
|------------------------------|-----------------------------------------|
| `BindUDPMessageHandler`      | Bind a message receive callback         |
| `UnBindUDPMessageHandler`    | Unbind a specific handler               |
| `UnBindAllUDPMessageHandler` | Unbind all handlers and close socket    |

### Example: bind and unbind a handler

![](/media-occurrence/doc%3Asimple-udp%3Amessages%3Amedia%3A1)

### Unbind all receive handlers

![](/media-occurrence/doc%3Asimple-udp%3Amessages%3Amedia%3A2)

Use this node to unbind every handler and close the socket when the channel no longer needs to receive datagrams.

## Send datagrams

| Node              | Description                             |
|-------------------|-----------------------------------------|
| `SendUDPMessage`  | Send a byte array through the channel (socket auto-created) |

### Example: send a string

![](/media-occurrence/doc%3Asimple-udp%3Amessages%3Amedia%3A3)

## Receive and send socket lifecycles

| Type     | Created When                              | Destroyed When                             |
|----------|--------------------------------------------|--------------------------------------------|
| Receiver | First call to `BindUDPMessageHandler`      | All handlers removed → auto close socket   |
| Sender   | First call to `SendUDPMessage` or config   | Plugin shutdown or channel deleted         |

## Convert byte arrays

Use with **SimpleByteConversion** plugin to easily serialize/deserialize between data ↔ `TArray<uint8>`.
