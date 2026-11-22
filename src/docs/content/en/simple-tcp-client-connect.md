---
title: Configure and Manage TCP Client Connections
type: doc
slug: simple-tcp-client-connect
draft: false
sitePublish: true
tags:
  - TCP
workIds:
  - simple-tcp-client
documentKind: product-manual
websiteRoute: /en/works/simple-tcp-client/docs/connect/
lang: en
translationKey: doc:simple-tcp-client:connect
sourceHash: 512633e441d4977ccba5c386b2f9606479dd36cc6bf3eda69bb6c8db6cf56432
translationStatus: translated
generatedBodyHash: f6fefb87e4dc261c70b3505babbcb339a64b1bd65fc6f4eb0dd687c8b4596bc5
docPage:
  work: simple-tcp-client
  group: setup
  slug: connect
  order: 1
---

**SimpleTCPClient** is a lightweight TCP client plugin designed for Unreal Engine.  
It supports **runtime dynamic configuration of client channels**, and all functionality is exposed to Blueprint for easy integration.

## Choosing a protocol and finding the right tutorial

UDP is often used for frequent sensor, simulator, and LAN data. TCP provides an ordered byte stream between clients and servers. WebSocket suits existing web services, browser control panels, and real-time messages across languages. Choose based on tolerance for packet loss, latency, message format, and deployment conditions; a protocol name alone does not establish reliability or cost.

- [SimpleUDP tutorial](/en/works/simple-udp/docs/channels/): UDP send/receive channels, address filtering, and native socket examples.
- [TCP client and network communication guide](/en/works/simple-tcp-client/docs/connect/): outgoing TCP connections, reconnection, and shared architecture.
- [SimpleTCPServer tutorial](/en/works/simple-tcp-server/docs/listen/): listening, accepting clients, and managing sessions.
- [SimpleWebSocket tutorial](/en/works/simple-websocket/docs/connect-and-send/): named connections, message delegates, and WebSockets module examples.
- [SimpleByteConversion tutorial](/en/works/simple-byte-conversion/docs/primitive-bytes/): conversion between application types and byte arrays.

The original technical record also mentions the `Send Http Request` Blueprint node and third-party libraries for MQTT or gRPC where needed. Availability of a particular HTTP node depends on the modules or plugins enabled in the project; check your project. Those protocol implementations are outside this guide.

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
![](/media-occurrence/doc%3Asimple-tcp-client%3Aconnect%3Amedia%3A1)

### Manual Start/Stop Connection  
![](/media-occurrence/doc%3Asimple-tcp-client%3Aconnect%3Amedia%3A2)  
Note: If the channel is set to auto-connect and has a reconnect interval configured, manual startup is not required.

### Dynamically Update Client Channel Config  
![](/media-occurrence/doc%3Asimple-tcp-client%3Aconnect%3Amedia%3A3)  
Note: The message delegate remains valid across socket reconnections. The update order does not matter — once config is updated, callbacks will still be triggered.

## Version History


Open **Edit → Project Settings**, select the SimpleTCPClient settings page, and set **Language** to **English** or **Chinese**. English is the default. Available user-facing UI, tooltips, notifications, and functional logs update immediately without restarting the editor. Public API names and module startup/shutdown logs remain in English.

## Support

For usage questions or collaboration, please visit the contact page.

- **Contact:** [Contact and collaboration](https://mzsh.me/contact/)
