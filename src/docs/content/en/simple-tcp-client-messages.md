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
sourceHash: 9f2d415c3f1d5cda165a834b37e5669b3b3cbe74fdff74aa0d1e6ef2c1b27dbf
translationStatus: translated
generatedBodyHash: c08ce36fbbc31477a13cc40c5ec54700e0e5501449ef6fede230f27d1cf5827b
docPage:
  work: simple-tcp-client
  group: features
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

Send data using the channel name you connected with. Agree on encoding and message framing at both ends. A receive callback gets a chunk of the TCP stream, which may hold part of a message or several messages.

![](/media-occurrence/doc%3Asimple-tcp-client%3Amessages%3Amedia%3A2)

## Convert between byte arrays and application data

Use **SimpleByteConversion** to convert between common Unreal types (FString, float, int, and others) and `TArray<uint8>` when reading or writing structured data.

[SimpleByteConversion tutorial](/en/works/simple-byte-conversion/docs/primitive-bytes/)
