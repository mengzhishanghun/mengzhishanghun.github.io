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
sourceHash: 459f0033b26aab7284e76e032dfd25e40f43724aaaca4e52aebd3bb086df87dc
translationStatus: translated
generatedBodyHash: 7f9350fd8f22dd2a9065670befd7641ba2e530acf1539bb17489e0a913d263dc
docPage:
  work: simple-tcp-server
  group: workflows
  slug: messages
  order: 2
---

### 📥 Receiving

| Node Function             | Description                                |
|---------------------------|--------------------------------------------|
| `BindMessageHandle`       | Bind message receive delegate              |
| `UnbindMessageHandle`     | Unbind a specific delegate                 |
| `UnbindAllMessageHandle`  | Unbind all delegates                       |

### 📤 Sending

| Node Function        | Description                                      |
|----------------------|--------------------------------------------------|
| `SendMessage`        | Send byte array to a specific SessionChannel     |
| `BroadcastMessage`   | Send byte array to all connections on a channel  |

## ✅ Notes & Tips

- Only IPv4 is supported — domain name, IPv6, and encryption are not supported  
- All sockets are internally managed, no manual cleanup required  
- Plugin persists across level transitions, bound to GameInstance lifecycle  
- Each connected client is assigned a unique `SessionChannel` in format `"IP:Port"`

---

## 🔧 Recommended Companion Plugins

- 🔌 **SimpleTCPClient Plugin**  
  Lightweight plugin designed for client-side usage, ideal for connecting to a SimpleTCPServer instance.

- 🧩 **SimpleByteConversion Plugin**
  Enables conversion between native Unreal types (e.g., FString, float, int) and `TArray<uint8>`, ideal for building structured protocols.

---
