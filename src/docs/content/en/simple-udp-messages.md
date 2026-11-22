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
sourceHash: 2bcc8fb732da72d5f4800d0a0c152ce22d448f2231b12975ee4a319bd74a3fc4
translationStatus: translated
generatedBodyHash: 20a381fe21fedb1c078aebf9b8492ee574917ef6f2fba33f061399065b3218ea
docPage:
  work: simple-udp
  group: network
  slug: messages
  order: 2
---

## Receive datagrams

| Node                         | Description                             |
|------------------------------|-----------------------------------------|
| `BindUDPMessageHandler`      | Bind a message receive callback         |
| `UnBindUDPMessageHandler`    | Unbind a specific handler               |
| `UnBindAllUDPMessageHandler` | Unbind all handlers and close socket    |

### Example: bind and unbind a handler

![](/media-occurrence/doc%3Asimple-udp%3Amessages%3Amedia%3A1)

### Unbind all receive handlers

![](/media-occurrence/doc%3Asimple-udp%3Amessages%3Amedia%3A2)

Use this node to unbind everything from a channel and close the socket manually.

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
