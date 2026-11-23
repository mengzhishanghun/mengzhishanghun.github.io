---
title: 配置 UDP 接收与发送通道
type: doc
slug: simple-udp-channels
draft: false
sitePublish: true
tags:
  - UDP
workIds:
  - simple-udp
docPage:
  work: simple-udp
  group: features
  slug: channels
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-udp/docs/channels/
lang: zh
translationKey: doc:simple-udp:channels
---

## 在项目设置中预定义通道

进入 **项目设置 → SimpleUDP Settings**，添加接收或发送通道。也可在运行时按需新增或更新通道。

### 接收通道与地址过滤

| 字段             | 示例                | 说明                              |
|-----------------|---------------------|-----------------------------------|
| Channel Name    | `DefaultRecv`       | 蓝图中使用的通道名称                |
| Bind Address    | `0.0.0.0:9000`      | 要监听的本地 IP 和端口             |
| Max Receive Bytes | `1024`            | 每次接收的最大包大小                |
| Filter Mode     | None / Whitelist / Blacklist | IP 过滤模式              |
| Whitelist / Blacklist | `["192.168.1.0/24"]` | 支持 CIDR 格式             |

`Max Receive Bytes` 默认值为 `1024` 字节。如果协议中的单个 UDP 数据包可能超过 1024 字节，在接收前调大对应接收通道的该参数，否则数据包可能无法被完整接收。

### 发送通道与端口

| 字段             | 示例                            | 说明                              |
|-----------------|---------------------------------|-----------------------------------|
| Channel Name    | `DefaultSend`                   | 通道名称                           |
| Target Addresses | `["255.255.255.255:9000"]`     | 目标 IP:Port 列表                  |
| Fixed Port   | `0`（默认）                      | 发送 Socket 的本地绑定端口（0 = 自动）|
| Max Send Bytes  | `1024`                          | 每个包的最大大小                    |

`Max Send Bytes` 默认值为 `1024` 字节。如果协议中的单个 UDP 数据包可能超过 1024 字节，在发送前调大对应发送通道的该参数，否则只会发送配置上限以内的数据。

## 在蓝图中读取和更新通道

更新前先用对应的读取节点查看通道是否已存在、当前监听或发送配置是什么。更新后再读一次，核对通道名称、地址和端口，避免改错同类通道。

| 节点                           | 说明                                          |
|-------------------------------|-----------------------------------------------|
| `UpdateReceiveChannelConfig`  | 创建/更新接收通道（如需要会重新绑定）            |
| `UpdateSendChannelConfig`     | 创建/更新发送通道，支持 `FixedPort` ✅          |
| `GetReceiveChannelConfig`     | 获取单个接收通道配置                            |
| `GetSendChannelConfig`        | 获取单个发送通道配置                            |
| `GetAllReceiveChannelConfig`  | 获取所有接收通道配置                            |
| `GetAllSendChannelConfig`     | 获取所有发送通道配置                            |

### 更新接收通道示例

![](/media-occurrence/doc%3Asimple-udp%3Achannels%3Amedia%3A1)

需要重新绑定时，插件会重建 Socket。这里的函数调用不要求固定顺序。  

两个布尔值控制是覆盖现有通道还是添加新通道。

### 更新发送通道示例

![](/media-occurrence/doc%3Asimple-udp%3Achannels%3Amedia%3A2)

发送 Socket 仅在 `FixedPort` 不同时重建。  

两个布尔值的行为与接收配置相同。

## 解析地址与检查 CIDR

| 节点             | 说明                                |
|-----------------|-------------------------------------|
| `ParseEndpoint` | 解析 `"127.0.0.1:9000"` 为 IP 和端口 |
| `IsIPInCIDR`    | 检查 IP 是否在 CIDR 块内             |

## 地址与端口限制

- 仅支持 IPv4（不支持 IPv6 或域名解析）
- 有效端口范围：`0~65535`，其中 `0` 表示自动分配
- 不要在不同通道中绑定相同端口，除非 Socket 已释放

## 蓝图函数一览

![](/media-occurrence/doc%3Asimple-udp%3Achannels%3Amedia%3A3)
