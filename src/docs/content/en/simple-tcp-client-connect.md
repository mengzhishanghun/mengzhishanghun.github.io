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
sourceHash: 239252a15e8669d86f509def92e4ba65c20fd1369097a5de736bf88dfccbd6d4
translationStatus: translated
generatedBodyHash: 3252035f9e7b7a225066116ada42294e8ad50e7bc9163c15ef279a5fde1d6ba5
docPage:
  work: simple-tcp-client
  group: network
  slug: connect
  order: 1
---

## Predefine a channel in Project Settings

You can predefine client channels via **Project Settings → SimpleTCPClient Settings**.  
It is recommended to configure channels here for easier management.

### Channel parameters

| Field                 | Example             | Description                                |
|----------------------|---------------------|--------------------------------------------|
| Channel Name          | `DefaultClient`     | Name used in Blueprint to reference channel|
| Remote Address (IP:Port) | `127.0.0.1:8888` | The target address to connect              |
| Auto Connect          | `True`              | Whether to auto-connect on startup         |
| Auto Reconnect Interval | `1.0` (seconds)   | Interval between reconnection attempts     |
| Max Receive Bytes     | `1024`              | Max size per receive                       |

## Manage channels in Blueprint

| Node Function              | Description                                         |
|---------------------------|-----------------------------------------------------|
| `StartConnection`         | Manually start a connection (for non-auto channels) |
| `StopConnection`          | Stop and destroy the socket                         |
| `IsConnected`             | Check whether a channel is currently connected      |
| `UpdateTCPClientConfig`   | Create or update channel config (auto reconnects)   |
| `GetTCPClientConfig`      | Get the current configuration of a channel          |

## Connection limits and socket lifecycle

Use an IPv4 address. The plugin does not support hostnames, IPv6, or encryption. The plugin manages each channel’s socket.

| Type         | Created When                           | Destroyed When                          |
|--------------|-----------------------------------------|------------------------------------------|
| Client Socket| When calling `StartConnection` or auto  | When calling `StopConnection` or shutdown|

## Connection node overview

![](/media-occurrence/doc%3Asimple-tcp-client%3Aconnect%3Amedia%3A1)

## Start and stop a connection manually

![](/media-occurrence/doc%3Asimple-tcp-client%3Aconnect%3Amedia%3A2)  
Note: If the channel is set to auto-connect and has a reconnect interval configured, manual startup is not required.

## Update configuration and reconnect

![](/media-occurrence/doc%3Asimple-tcp-client%3Aconnect%3Amedia%3A3)  
Note: The message delegate remains valid across socket reconnections. The update order does not matter — once config is updated, callbacks will still be triggered.

Use separate channels for different ports and application functions. The plugin handles communication asynchronously to avoid blocking the game thread and provides reconnection controls. The two ends must agree on whether to resend messages, log in again, or synchronize application state after reconnecting.
