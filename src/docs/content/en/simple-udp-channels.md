---
title: Configure UDP Receive and Send Channels
type: doc
slug: simple-udp-channels
draft: false
sitePublish: true
tags:
  - UDP
workIds:
  - simple-udp
documentKind: product-manual
websiteRoute: /en/works/simple-udp/docs/channels/
lang: en
translationKey: doc:simple-udp:channels
sourceHash: 86a30626250d722868d6a2e2e0b23640474c7813d323598d3b2a3a0c4b10dcc2
translationStatus: translated
generatedBodyHash: 36474957eeed686b98a00990646fd7919bfc2276d51a9bc526791d20261feace
docPage:
  work: simple-udp
  group: features
  slug: channels
  order: 1
---

## Predefine channels in Project Settings

In **Project Settings → SimpleUDP Settings**, add receive or send channels. You can also add or update channels at runtime.

### Receive channels and address filters

| Field             | Example             | Description                              |
|------------------|---------------------|------------------------------------------|
| Channel Name      | `DefaultRecv`       | Channel name used in Blueprint           |
| Bind Address      | `0.0.0.0:9000`      | Local IP and port to listen on           |
| Max Receive Bytes | `1024`              | Max packet size per receive              |
| Filter Mode       | None / Whitelist / Blacklist | IP filtering mode               |
| Whitelist / Blacklist | `["192.168.1.0/24"]` | Supports CIDR format              |

`Max Receive Bytes` defaults to `1024` bytes. If a single UDP datagram in your protocol may exceed 1024 bytes, increase this value in the receive channel configuration before receiving; otherwise, the datagram may not be received completely.

### Send channels and ports

| Field             | Example                         | Description                              |
|------------------|----------------------------------|------------------------------------------|
| Channel Name      | `DefaultSend`                   | Channel name                             |
| Target Addresses  | `["255.255.255.255:9000"]`       | List of destination IP:Port              |
| Fixed Port     | `0` (default)                    | Local bind port for sending socket (0 = auto) |
| Max Send Bytes    | `1024`                           | Max size per packet                      |

`Max Send Bytes` defaults to `1024` bytes. If a single UDP datagram in your protocol may exceed 1024 bytes, increase this value in the send channel configuration before sending; otherwise, only data up to the configured limit will be sent.

## Read and update channels in Blueprint

Before updating, use the matching getter to see whether the channel exists and read its current settings. Read it again after the update and check the name, addresses, and port so you can catch changes to the wrong channel.

| Node                         | Description                                          |
|------------------------------|------------------------------------------------------|
| `UpdateReceiveChannelConfig` | Create/update a receive channel (rebinding if needed) |
| `UpdateSendChannelConfig`    | Create/update a send channel, supports `FixedPort` ✅  |
| `GetReceiveChannelConfig`    | Get one receive channel config                      |
| `GetSendChannelConfig`       | Get one send channel config                         |
| `GetAllReceiveChannelConfig` | Get all receive channel configs                     |
| `GetAllSendChannelConfig`    | Get all send channel configs                        |

### Example: update a receive channel

![](/media-occurrence/doc%3Asimple-udp%3Achannels%3Amedia%3A1)

The plugin rebuilds the socket when it needs to rebind. These calls have no required order.  

The two booleans control whether to override existing channels or add new ones.

### Example: update a send channel

![](/media-occurrence/doc%3Asimple-udp%3Achannels%3Amedia%3A2)

Send sockets only rebuild if `FixedPort` is different.  

The two booleans behave the same as receive config.

## Parse endpoints and check CIDR ranges

| Node             | Description                                |
|------------------|--------------------------------------------|
| `ParseEndpoint`  | Parse `"127.0.0.1:9000"` to IP and port     |
| `IsIPInCIDR`     | Check if an IP is in a CIDR block          |

## Address and port limits

- Only IPv4 is supported (no IPv6 or domain resolution)
- Valid port range: `0~65535`, where `0` means auto-assign
- Do not bind the same port in different channels unless the socket is released

## Blueprint function overview

![](/media-occurrence/doc%3Asimple-udp%3Achannels%3Amedia%3A3)
