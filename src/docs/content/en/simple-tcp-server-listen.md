---
title: Configure Listening and Session Lifecycle
type: doc
slug: simple-tcp-server-listen
draft: false
sitePublish: true
tags:
  - TCP
workIds:
  - simple-tcp-server
documentKind: product-manual
websiteRoute: /en/works/simple-tcp-server/docs/listen/
lang: en
translationKey: doc:simple-tcp-server:listen
sourceHash: 51d2da8634a0452ae7cdf70d7c57f0b27cfefc30c28769a01835fcf83cfd63b6
translationStatus: translated
generatedBodyHash: 3c882e5a238352ce38c6f6ddaf3f0b909781811e75f5e626b1304e473dffbdcb
docPage:
  work: simple-tcp-server
  group: workflows
  slug: listen
  order: 1
---

**SimpleTCPServer** is a lightweight TCP server plugin designed for Unreal Engine.  
It supports **multi-channel listening**, **dynamic configuration updates**, and offers a fully Blueprint-exposed API for managing client connections at runtime.

## Compatibility

- Unreal Engine 5.2–5.8
- Version 1.1.0 (Version 2)

---

## 🔧 Plugin Initialization

Once enabled, the plugin activates automatically.  
It registers as a `GameInstanceSubsystem`, and its lifecycle persists across level transitions.

---

## ⚙️ Static Channel Configuration (Optional)

You can define server listening channels via **Project Settings → SimpleTCPServer Settings**.  
Using this method is recommended for centralized management and ease of debugging.

### 🔹 Channel Config Fields

| Field Name            | Example           | Description                                     |
|-----------------------|-------------------|-------------------------------------------------|
| Channel Name          | `MainServer`      | The name used in Blueprints to refer to channel|
| Bind Address (IP:Port)| `0.0.0.0:8888`     | Address to bind the listening socket           |
| Max Connections       | `32`              | Max number of concurrent client connections    |
| Max Receive Bytes     | `1024`            | Max buffer size for each message               |

---

## 🧠 Blueprint Node Interface

### 🔌 Connection Status Callback

| Node Function              | Description                                      |
|----------------------------|--------------------------------------------------|
| `BindConnectHandle`        | Bind delegate for client connect/disconnect     |
| `UnbindConnectHandle`      | Unbind a specific connection delegate           |
| `UnbindAllConnectHandle`   | Unbind all connection delegates                 |

### ⚙️ Channel & Connection Management

| Node Function             | Description                                               |
|---------------------------|-----------------------------------------------------------|
| `StartServer`             | Start listening on a server channel                       |
| `StopServer`              | Stop listening and disconnect all clients on the channel  |
| `IsServerRunning`         | Check if a server channel is running                      |
| `GetAllSessions`          | Get all current SessionChannels on a listening channel    |
| `IsSessionConnected`      | Check if a session is still connected                     |
| `UpdateTCPServerConfig`   | Update channel config (hot reload supported)              |
| `GetTCPServerConfig`      | Get current config of a channel                           |

---

## 🔁 Socket Lifecycle

| Type            | Created When                      | Destroyed When                                  |
|------------------|-----------------------------------|--------------------------------------------------|
| Listening Socket | When calling `StartServer`        | When calling `StopServer`                        |
| Session Socket   | When a client is accepted         | When client disconnects or socket is destroyed   |

---

## 🧪 Blueprint Example (Images)

### All Node Overview  
![](/media-occurrence/doc%3Asimple-tcp-server%3Alisten%3Amedia%3A1)

---

## Version History


Open **Edit → Project Settings**, select the SimpleTCPServer settings page, and set **Language** to **English** or **Chinese**. English is the default. Available user-facing UI, tooltips, notifications, and functional logs update immediately without restarting the editor. Public API names and module startup/shutdown logs remain in English.

## Support

For usage questions or collaboration, please visit the contact page.

- **Contact:** [Contact and collaboration](https://mzsh.me/contact/)
