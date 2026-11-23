---
title: Enable the Plugin and Configure TCP Listening
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
sourceHash: 6c1d6d7092a9805a44f200a30d92e9499ffb50a55cb574321725cdbf26713edb
translationStatus: translated
generatedBodyHash: 8e7b9f979dd95dffc463cc18d8be08c987c629d3cd83493ef522a56cef45d364
docPage:
  work: simple-tcp-server
  group: getting-started
  slug: listen
  order: 1
---

## Compatibility

- Unreal Engine 5.2–5.8
- Version 1.1.0 (Version 2)

## Interface language

Open **Edit → Project Settings**, select the SimpleTCPServer settings page, and set **Language** to **English** or **Chinese**. English is the default. Available user-facing UI, tooltips, notifications, and functional logs update immediately without restarting the editor. Public API names and module startup/shutdown logs remain in English.

## Enable the plugin

Once enabled, the plugin activates automatically.  
It registers as a `GameInstanceSubsystem`, and its lifecycle persists across level transitions.

## Define a listening channel in Project Settings

Add listening channels under **Project Settings → SimpleTCPServer Settings** so you can inspect and troubleshoot their settings in one place.

### Listening channel parameters

| Field Name            | Example           | Description                                     |
|-----------------------|-------------------|-------------------------------------------------|
| Channel Name          | `MainServer`      | The name used in Blueprints to refer to channel|
| Bind Address (IP:Port)| `0.0.0.0:8888`     | Address to bind the listening socket           |
| Max Connections       | `32`              | Max number of concurrent client connections    |
| Max Receive Bytes     | `1024`            | Max buffer size for each message               |

## Start and stop listening in Blueprint

For example, use the settings in the table, start `MainServer` in Blueprint, and check the same channel with `IsServerRunning`. Once it is listening, connect a test client to a reachable IPv4 address of the server and its listening port. The bind address is a listener setting.

| Node Function             | Description                                               |
|---------------------------|-----------------------------------------------------------|
| `StartServer`             | Start listening on a server channel                       |
| `StopServer`              | Stop listening and disconnect all clients on the channel  |
| `IsServerRunning`         | Check if a server channel is running                      |
| `UpdateTCPServerConfig`   | Update channel config (hot reload supported)              |
| `GetTCPServerConfig`      | Get current config of a channel                           |

Call `StartServer` to create the listening socket. `StopServer` destroys it and disconnects clients on that channel. Listening supports IPv4 only. Hostnames, IPv6, and encryption are unsupported.
