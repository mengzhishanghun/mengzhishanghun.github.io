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
sourceHash: 492b829c6ba24d93310a3df756d22832374c89ced3f7e364bcb264fec2cb02b9
translationStatus: translated
generatedBodyHash: 6d1d357cb152917dee5a3cd68ad42daebacc23d8726140d35e7f768919413bd9
docPage:
  work: simple-tcp-client
  group: features
  slug: connect
  order: 1
---

## Predefine a channel in Project Settings

Add client channels under **Project Settings → SimpleTCPClient Settings**. Give each target its own channel name, then use that name to refer to the connection in Blueprint.

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

For a manual connection, make sure the target service is listening and pass the channel name from the table to `StartConnection`. Check the same channel with `IsConnected`. Test message exchange once the connection is up.

![](/media-occurrence/doc%3Asimple-tcp-client%3Aconnect%3Amedia%3A1)

## Start and stop a connection manually

![](/media-occurrence/doc%3Asimple-tcp-client%3Aconnect%3Amedia%3A2)  
Note: If the channel is set to auto-connect and has a reconnect interval configured, manual startup is not required.

## Update configuration and reconnect

![](/media-occurrence/doc%3Asimple-tcp-client%3Aconnect%3Amedia%3A3)  
Note: The message delegate remains valid across socket reconnections. The update order does not matter — once config is updated, callbacks will still be triggered.

Use separate channels for different ports and application functions. The plugin handles communication asynchronously to avoid blocking the game thread and provides reconnection controls. The two ends must agree on whether to resend messages, log in again, or synchronize application state after reconnecting.
