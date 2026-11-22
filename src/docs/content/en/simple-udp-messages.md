---
title: Send and Receive UDP Data
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
sourceHash: 65d5878e8a14d129e3bf5f2e75554cc996278056f3f1b6f21ad0a60275da9ad6
translationStatus: translated
generatedBodyHash: 8b4ec133fd67dc8e0ec571c38b544f43c3c9e0fe676b4cfbe7241545905c578d
docPage:
  work: simple-udp
  group: workflows
  slug: messages
  order: 2
---

### 📥 Receiving

| Node                         | Description                             |
|------------------------------|-----------------------------------------|
| `BindUDPMessageHandler`      | Bind a message receive callback         |
| `UnBindUDPMessageHandler`    | Unbind a specific handler               |
| `UnBindAllUDPMessageHandler` | Unbind all handlers and close socket    |

### 📤 Sending

| Node              | Description                             |
|-------------------|-----------------------------------------|
| `SendUDPMessage`  | Send a byte array through the channel (socket auto-created) |

### Bind & Unbind Example  
![](/media-occurrence/doc%3Asimple-udp%3Amessages%3Amedia%3A1)

Socket is created automatically after the first bind, and destroyed when no more handlers remain.

### Send String Message  
![](/media-occurrence/doc%3Asimple-udp%3Amessages%3Amedia%3A2)

---

## ✅ Tips & Notes

- Only IPv4 is supported (no IPv6 or domain resolution)
- Valid port range: `0~65535`, where `0` means auto-assign
- Do not bind the same port in different channels unless the socket is released
- IP filters support CIDR format (e.g. `192.168.1.0/24`)

---

## 🔧 Recommended Companion

Use with **SimpleByteConversion** plugin to easily serialize/deserialize between data ↔ `TArray<uint8>`.

---
