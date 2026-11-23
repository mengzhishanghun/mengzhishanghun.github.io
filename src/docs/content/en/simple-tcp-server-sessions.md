---
title: Manage Client Sessions
type: doc
slug: simple-tcp-server-sessions
draft: false
sitePublish: true
tags:
  - TCP
workIds:
  - simple-tcp-server
documentKind: product-manual
websiteRoute: /en/works/simple-tcp-server/docs/sessions/
lang: en
translationKey: doc:simple-tcp-server:sessions
sourceHash: c4e07b7801683747dc750dd0a3482b1bd86540e0de0154ae0d5e82cdc40d8f1a
translationStatus: translated
generatedBodyHash: 95a368674cfa9f0228bb784b245d4d79fd3ef21cda15cabe5f4c1ec50e2bdad4
docPage:
  work: simple-tcp-server
  group: features
  slug: sessions
  order: 1
---

When the server accepts a client, the plugin assigns it a unique `SessionChannel` in `"IP:Port"` format.

## Subscribe to client connection and disconnection events

| Node Function              | Description                                      |
|----------------------------|--------------------------------------------------|
| `BindConnectHandle`        | Bind delegate for client connect/disconnect     |
| `UnbindConnectHandle`      | Unbind a specific connection delegate           |
| `UnbindAllConnectHandle`   | Unbind all connection delegates                 |

## List sessions and check their connection state

Once the listener starts, check that the client connected to the right channel, then use `GetAllSessions` to see the current sessions. Before sending to a client, check the selected session with `IsSessionConnected`. Read the list again after a reconnect.

| Node Function             | Description                                               |
|---------------------------|-----------------------------------------------------------|
| `GetAllSessions`          | Get all current SessionChannels on a listening channel    |
| `IsSessionConnected`      | Check if a session is still connected                     |

## When session sockets are created and destroyed

The plugin creates a session socket when it accepts a client. The session ends when the client disconnects or the socket is destroyed. The plugin handles socket cleanup.

## Blueprint node overview

![](/media-occurrence/doc%3Asimple-tcp-server%3Asessions%3Amedia%3A1)
