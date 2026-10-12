---
title: SimpleUDP User Guide
description: Complete product user guide for SimpleUDP
type: doc
slug: simple-udp-guide
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
draft: false
sitePublish: true
tags:
  - UDP
workIds:
  - simple-udp
documentKind: product-manual
websiteRoute: /docs/zh/guides/ue-tools/simple-udp-guide/
lang: en
translationKey: simple-udp-guide
sourceHash: 66a7f58861be0adf5ae3e13be4eaaa20507bf9b089c181c8add7a8a798478b80
translationStatus: translated
generatedBodyHash: 69b0569caa5b9dc4b6c8f43f9be0c3a9e99d3ed6fbb4d99d2ab5f1f82c38fbf1
---

# 📘 SimpleUDP Plugin Tutorial (Blueprint Edition)

**SimpleUDP** is a lightweight UDP communication plugin for Unreal Engine.  
It supports **runtime dynamic configuration of send/receive channels**, and all functionality is exposed to Blueprint for easy integration.

## Compatibility

- Unreal Engine 5.2–5.8
- Version 1.1.0 (Version 2)

---

## 🔧 Plugin Initialization

The plugin takes effect immediately after enabling.  
It registers internally as a `GameInstanceSubsystem` — no manual startup or shutdown code required.

---

## ⚙️ Static Channel Configuration (Optional)

You can pre-configure channels via **Project Settings → SimpleUDP Settings**.

Note: While runtime channel modification is supported, it's recommended to configure channels here whenever possible for better manageability.

### 🔹 Receive Channels

| Field             | Example             | Description                              |
|------------------|---------------------|------------------------------------------|
| Channel Name      | `DefaultRecv`       | Channel name used in Blueprint           |
| Bind Address      | `0.0.0.0:9000`      | Local IP and port to listen on           |
| Max Receive Bytes | `1024`              | Max packet size per receive              |
| Filter Mode       | None / Whitelist / Blacklist | IP filtering mode               |
| Whitelist / Blacklist | `["192.168.1.0/24"]` | Supports CIDR format              |

> **Important:** `Max Receive Bytes` defaults to `1024` bytes. If a single UDP datagram in your protocol may exceed 1024 bytes, increase this value in the receive channel configuration before receiving; otherwise, the datagram may not be received completely.

### 🔹 Send Channels

| Field             | Example                         | Description                              |
|------------------|----------------------------------|------------------------------------------|
| Channel Name      | `DefaultSend`                   | Channel name                             |
| Target Addresses  | `["255.255.255.255:9000"]`       | List of destination IP:Port              |
| Fixed Port 🔧     | `0` (default)                    | Local bind port for sending socket (0 = auto) |
| Max Send Bytes    | `1024`                           | Max size per packet                      |

> **Important:** `Max Send Bytes` defaults to `1024` bytes. If a single UDP datagram in your protocol may exceed 1024 bytes, increase this value in the send channel configuration before sending; otherwise, only data up to the configured limit will be sent.

---

## 🧠 Blueprint Node Interface

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

### ⚙️ Runtime Configuration

| Node                         | Description                                          |
|------------------------------|------------------------------------------------------|
| `UpdateReceiveChannelConfig` | Create/update a receive channel (rebinding if needed) |
| `UpdateSendChannelConfig`    | Create/update a send channel, supports `FixedPort` ✅  |
| `GetReceiveChannelConfig`    | Get one receive channel config                      |
| `GetSendChannelConfig`       | Get one send channel config                         |
| `GetAllReceiveChannelConfig` | Get all receive channel configs                     |
| `GetAllSendChannelConfig`    | Get all send channel configs                        |

### 🛠️ Utility Nodes

| Node             | Description                                |
|------------------|--------------------------------------------|
| `ParseEndpoint`  | Parse `"127.0.0.1:9000"` to IP and port     |
| `IsIPInCIDR`     | Check if an IP is in a CIDR block          |

---

## 🔁 Socket Lifecycle

| Type     | Created When                              | Destroyed When                             |
|----------|--------------------------------------------|--------------------------------------------|
| Receiver | First call to `BindUDPMessageHandler`      | All handlers removed → auto close socket   |
| Sender   | First call to `SendUDPMessage` or config   | Plugin shutdown or channel deleted         |

---

## 🧪 Blueprint Examples (Images)

### All Blueprint Functions  
![](/media-occurrence/doc%3Asimple-udp-guide%3Amedia%3A1)

### Bind & Unbind Example  
![](/media-occurrence/doc%3Asimple-udp-guide%3Amedia%3A2)

Socket is created automatically after the first bind, and destroyed when no more handlers remain.

### Unbind All (Force Close Socket)  
![](/media-occurrence/doc%3Asimple-udp-guide%3Amedia%3A3)

Use this node to unbind everything from a channel and close the socket manually.

### Dynamically Update Receive Channel 
![](/media-occurrence/doc%3Asimple-udp-guide%3Amedia%3A4)

Socket is auto-rebuilt if needed. Function order doesn't matter.  

The two booleans control whether to override existing channels or add new ones.

### Dynamically Update Send Channel  
![](/media-occurrence/doc%3Asimple-udp-guide%3Amedia%3A5)

Send sockets only rebuild if `FixedPort` is different.  

The two booleans behave the same as receive config.

### Send String Message  
![](/media-occurrence/doc%3Asimple-udp-guide%3Amedia%3A6)

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

## Version History


Open **Edit → Project Settings**, select the SimpleUDP settings page, and set **Language** to **English** or **Chinese**. English is the default. Available user-facing UI, tooltips, notifications, and functional logs update immediately without restarting the editor. Public API names and module startup/shutdown logs remain in English.

## Support

For usage questions or collaboration, please visit the contact page.

- **Contact:** [Contact and collaboration](https://mzsh.me/contact/)
