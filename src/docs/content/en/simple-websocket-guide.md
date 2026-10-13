---
title: SimpleWebSocket User Guide
description: Complete product user guide for SimpleWebSocket
type: doc
slug: simple-websocket-guide
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
draft: false
sitePublish: true
tags:
  - WebSocket
workIds:
  - simple-websocket
documentKind: product-manual
websiteRoute: /docs/zh/guides/ue-tools/simple-websocket-guide/
lang: en
translationKey: simple-websocket-guide
sourceHash: 3a5c53a81fada4d59a47b1727aa8b71781f9901c1f37c97ca6c105c1d37c450f
translationStatus: translated
generatedBodyHash: 47adf97ebed01d1c99e8df5c4af6b6b758b621a61fa6506e8672abbb0da4816f
---

# 📘 SimpleWebSocket User Guide

This guide walks you through how to configure and use the SimpleWebSocket plugin to communicate via WebSocket in your Unreal Engine project.

## Compatibility

- Unreal Engine 5.2–5.8
- Version 1.1.0 (Version 2)

---

## 🛠️ Plugin Settings

After enabling the plugin, go to the project settings panel under `Simple WebSocket Settings`.

### Steps:

1. Open Unreal Engine Editor  
2. Go to `Edit > Project Settings`  
3. Scroll down and find `Simple WebSocket Settings`  
4. Add a new WebSocket connection entry (e.g., named `Test`)  
5. Enter the WebSocket address (recommended format: `ws://127.0.0.1:xxxx`, **do not use localhost**)  
6. Enable **Auto Connect** (optional; if enabled, the connection will be established automatically at runtime)

📷 Example screenshot:

![](/media-occurrence/doc%3Asimple-websocket-guide%3Amedia%3A1)

---

## 🎮 Blueprint Usage Example

You can use GameInstance-level Blueprint functions to connect, send, receive, and close WebSocket connections. All functions are static and can be called from any Blueprint.

### Available Nodes:

- `Connect Web Socket`: Connect to a WebSocket by name  
- `Send WebSocket Message`: Send a text message  
- `Bind Web Socket Message`: Bind a Blueprint event to receive messages (supports multiple callbacks)  
- `Close Web Socket`: Close a specific connection  
- `Close All Web Socket`: Close all connections  
- `Check Web Socket Connect`: Check if a connection is established  
- `Get Web Socket Config`: Retrieve config for a named connection  
- `Unbind Web Socket Message`: Unbind a message event  

📷 Example Blueprint graph:

![](/media-occurrence/doc%3Asimple-websocket-guide%3Amedia%3A2)

---

## ✅ Notes

- The plugin only supports the `ws://` protocol. Secure `wss://` is **not** supported.
- Fully tested in **packaged builds** — works as expected in production.
- Avoid using `localhost` in WebSocket URLs. Always use `127.0.0.1` instead to prevent connection issues.
- Each connection name can have multiple bound callbacks, allowing modular event handling.

---

## Version History


Open **Edit → Project Settings**, select the SimpleWebSocket settings page, and set **Language** to **English** or **Chinese**. English is the default. Available user-facing UI, tooltips, notifications, and functional logs update immediately without restarting the editor. Public API names and module startup/shutdown logs remain in English.

## Support

For usage questions or collaboration, please visit the contact page.

- **Contact:** [Contact and collaboration](https://mzsh.me/contact/)
