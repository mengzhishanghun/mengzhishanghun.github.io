---
title: SimpleTCPClient User Guide
description: Complete product user guide for SimpleTCPClient
type: doc
slug: simple-tcp-client-guide
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
draft: false
sitePublish: true
tags:
  - TCP
workIds:
  - simple-tcp-client
documentKind: product-manual
websiteRoute: /docs/zh/guides/ue-tools/simple-tcp-client-guide/
lang: en
translationKey: simple-tcp-client-guide
sourceHash: 582f37bb4b4ac17efc59c8dc25d03b91a810b294fe2bdcd6ead15423fda660c1
translationStatus: translated
generatedBodyHash: 3e129a7c198d3dfe60e5f7a651562cd73b664bb4fe5b0fd329d5ff83430b06ce
---

# 📘 SimpleTCPClient Plugin Tutorial (Blueprint Edition)

**SimpleTCPClient** is a lightweight TCP client plugin designed for Unreal Engine.  
It supports **runtime dynamic configuration of client channels**, and all functionality is exposed to Blueprint for easy integration.

## Compatibility

- Unreal Engine 5.2–5.8
- Version 1.1.0 (Version 2)

---

## 🔧 Plugin Initialization

The plugin is automatically activated after being enabled.  
It registers internally as a `GameInstanceSubsystem`, requiring no manual startup or shutdown code.

---

## ⚙️ Static Channel Configuration (Optional)

You can predefine client channels via **Project Settings → SimpleTCPClient Settings**.  
It is recommended to configure channels here for easier management.

### 🔹 Client Channel Config Fields

| Field                 | Example             | Description                                |
|----------------------|---------------------|--------------------------------------------|
| Channel Name          | `DefaultClient`     | Name used in Blueprint to reference channel|
| Remote Address (IP:Port) | `127.0.0.1:8888` | The target address to connect              |
| Auto Connect          | `True`              | Whether to auto-connect on startup         |
| Auto Reconnect Interval | `1.0` (seconds)   | Interval between reconnection attempts     |
| Max Receive Bytes     | `1024`              | Max size per receive                       |

---

## 🧠 Blueprint Node Interface

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

### ⚙️ Runtime Channel Management

| Node Function              | Description                                         |
|---------------------------|-----------------------------------------------------|
| `StartConnection`         | Manually start a connection (for non-auto channels) |
| `StopConnection`          | Stop and destroy the socket                         |
| `IsConnected`             | Check whether a channel is currently connected      |
| `UpdateTCPClientConfig`   | Create or update channel config (auto reconnects)   |
| `GetTCPClientConfig`      | Get the current configuration of a channel          |

---

## 🔁 Socket Lifecycle

| Type         | Created When                           | Destroyed When                          |
|--------------|-----------------------------------------|------------------------------------------|
| Client Socket| When calling `StartConnection` or auto  | When calling `StopConnection` or shutdown|

---

## 🧪 Blueprint Examples (Images)

### All Blueprint Nodes  
![](/media-occurrence/doc%3Asimple-tcp-client-guide%3Amedia%3A1)

### Manual Start/Stop Connection  
![](/media-occurrence/doc%3Asimple-tcp-client-guide%3Amedia%3A2)  
Note: If the channel is set to auto-connect and has a reconnect interval configured, manual startup is not required.

### Bind & Unbind Message Handler  
![](/media-occurrence/doc%3Asimple-tcp-client-guide%3Amedia%3A3)

### Dynamically Update Client Channel Config  
![](/media-occurrence/doc%3Asimple-tcp-client-guide%3Amedia%3A4)  
Note: The message delegate remains valid across socket reconnections. The update order does not matter — once config is updated, callbacks will still be triggered.

### Send Message (String or Structured Data)  
![](/media-occurrence/doc%3Asimple-tcp-client-guide%3Amedia%3A5)

---

## ✅ Tips & Notes

- Only IPv4 is supported — no domain name, IPv6, or encryption
- All sockets are fully managed internally, no manual cleanup needed
- The plugin lives within the `GameInstance` lifecycle, and is not affected by level transitions

---

## 🔧 Recommended Companion Plugin

Use with **SimpleByteConversion** to easily convert common Unreal types (FString, float, int, etc.) to/from `TArray<uint8>` and build structured protocols.

---

## Version History


Open **Edit → Project Settings**, select the SimpleTCPClient settings page, and set **Language** to **English** or **Chinese**. English is the default. Available user-facing UI, tooltips, notifications, and functional logs update immediately without restarting the editor. Public API names and module startup/shutdown logs remain in English.

## Support

For usage questions or collaboration, please visit the contact page.

- **Contact:** [Contact and collaboration](https://mzsh.me/contact/)
