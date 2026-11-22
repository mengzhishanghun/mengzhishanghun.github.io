---
title: Send and Receive TCP Client Messages
type: doc
slug: simple-tcp-client-messages
draft: false
sitePublish: true
tags:
  - TCP
workIds:
  - simple-tcp-client
documentKind: product-manual
websiteRoute: /en/works/simple-tcp-client/docs/messages/
lang: en
translationKey: doc:simple-tcp-client:messages
sourceHash: c29f5440658ce6e9e90b72a1c67606b17375f3bf315b3f92b09bb91852467351
translationStatus: translated
generatedBodyHash: 18cb5d70b94390d712821262f21ded487e527a62b8985dbdb5180376d4b82d36
docPage:
  work: simple-tcp-client
  group: network
  slug: messages
  order: 2
---

## Receive messages

| Node Function              | Description                             |
|---------------------------|-----------------------------------------|
| `BindMessageHandle`       | Bind a message receive delegate         |
| `UnbindMessageHandle`     | Unbind a specific delegate              |
| `UnbindAllMessageHandle`  | Unbind all delegates and close socket   |

### Bind and unbind a message handler

![](/media-occurrence/doc%3Asimple-tcp-client%3Amessages%3Amedia%3A1)

## Send messages

| Node Function   | Description                                   |
|-----------------|-----------------------------------------------|
| `SendMessage`   | Send a byte array through a specific channel  |

### Send a string or structured data

![](/media-occurrence/doc%3Asimple-tcp-client%3Amessages%3Amedia%3A2)

## Convert between byte arrays and application data

Use with **SimpleByteConversion** to easily convert common Unreal types (FString, float, int, etc.) to/from `TArray<uint8>` and build structured protocols.

[SimpleByteConversion tutorial](/en/works/simple-byte-conversion/docs/primitive-bytes/)
