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
sourceHash: 765ccd7cfb01f006762def1a688d265815d09b8c161d6657cbeb526e70e2811f
translationStatus: translated
generatedBodyHash: 1951fb28d0e3c00a5ee6235b76f930e4cf70a64ddd43f3a3f3a73ccbe3e3ab93
docPage:
  work: simple-tcp-server
  group: network
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

| Node Function             | Description                                               |
|---------------------------|-----------------------------------------------------------|
| `GetAllSessions`          | Get all current SessionChannels on a listening channel    |
| `IsSessionConnected`      | Check if a session is still connected                     |

## When session sockets are created and destroyed

The plugin creates a session socket when it accepts a client. The socket ends on disconnection or destruction. The plugin manages sockets; no manual cleanup is needed.

## Blueprint node overview

![](/media-occurrence/doc%3Asimple-tcp-server%3Asessions%3Amedia%3A1)
