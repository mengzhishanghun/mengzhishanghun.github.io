---
title: Send and Receive TCP Messages
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
sourceHash: d53cdb6bdd8728af963e082d770ff37b1645c71fb89249c2d06ef03423d068ba
translationStatus: translated
generatedBodyHash: d253843ee19cd77cad786be8d6d39971dbed5b7d656bb09c9d1ca3b9c2081d77
docPage:
  work: simple-tcp-client
  group: workflows
  slug: messages
  order: 1
---

### 📥 Receiving

| Node Function              | Description                             |
|---------------------------|-----------------------------------------|
| `BindMessageHandle`       | Bind a message receive delegate         |
| `UnbindMessageHandle`     | Unbind a specific delegate              |
| `UnbindAllMessageHandle`  | Unbind all delegates and close socket   |

### 📤 Sending

| Node Function   | Description                                   |
|-----------------|-----------------------------------------------|
| `SendMessage`   | Send a byte array through a specific channel  |

### Bind & Unbind Message Handler  
![](/media-occurrence/doc%3Asimple-tcp-client%3Amessages%3Amedia%3A1)

### Send Message (String or Structured Data)  
![](/media-occurrence/doc%3Asimple-tcp-client%3Amessages%3Amedia%3A2)

---

## ✅ Tips & Notes

- Only IPv4 is supported — no domain name, IPv6, or encryption
- All sockets are fully managed internally, no manual cleanup needed
- The plugin lives within the `GameInstance` lifecycle, and is not affected by level transitions

---

## 🔧 Recommended Companion Plugin

Use with **SimpleByteConversion** to easily convert common Unreal types (FString, float, int, etc.) to/from `TArray<uint8>` and build structured protocols.

---

## Channels, threads, reconnection, and message formats

The native socket examples cover basic sending and receiving. A project also needs to organize connections, application logic, and lifetimes:

- Use multiple channels for different ports and application functions.
- Process communication asynchronously to avoid blocking the game thread.
- Add reconnection attempts when a TCP client disconnects.
- Manage separate client sessions on a TCP server.
- Filter IP addresses with allowlists or blocklists, including CIDR where supported.
- Expose operations through Blueprint nodes where needed.
- Serialize structures to byte arrays and back; see the [SimpleByteConversion tutorial](/en/works/simple-byte-conversion/docs/primitive-bytes/).

SimpleTCPClient provides client channels, asynchronous handling, and reconnection controls. Use the corresponding guides for server sessions, UDP address filters, and named WebSocket connections. The two ends must agree whether to resend messages, log in again, or synchronize application state after the transport reconnects.

Start with the protocol, then socket creation and data transfer, followed by asynchronous handling, multiple channels, and Blueprint integration. C++ users can also use these examples to practice their own communication implementation. They do not include a complete production communication layer.

The native communication examples were published on [Cnblogs](https://www.cnblogs.com/mengzhishanghun/p/19165484) on 2025-10-25.
