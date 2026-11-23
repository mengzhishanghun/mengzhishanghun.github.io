---
title: SimpleUDP
description: 将 UDP 收发、多通道配置和地址过滤封装为蓝图接口。
type: work
slug: simple-udp
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
order: 3
status: 正式文档
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/zh-cn/listings/9e0d0c8c-ac79-4699-925c-abdfe9ac51eb
    - kind: docs
      href: /zh/works/simple-udp/docs/enable-plugin/
  compatibility:
    - platforms:
        - Windows (Win64)
        - macOS
        - Linux
      requirements:
        - UE 5.2–5.8
featured: false
draft: false
sitePublish: false
tags:
  - UDP
  - Simple 系列
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19165484
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/19165484
docIds:
  - simple-udp-enable-plugin
  - simple-udp-channels
  - simple-udp-messages
  - simple-udp-native-sockets
coverAlt: SimpleUDP封面
websiteCoverUrl: /media/covers/works/simple-udp-20261101.webp
sourceDate: 2025-10-25
lang: zh
translationKey: simple-udp
---

## 作品简介

SimpleUDP 让 Unreal Engine 项目在蓝图中管理多条 UDP 收发通道。你可以异步接收数据、按来源地址过滤，并在运行时调整通道配置。

它面向需要按不同用途维护 UDP 通道、并在接收端限制来源地址的项目。

## 背景与目标

UDP 可以用于局域网消息、外部设备数据和其他对传输时效有要求的场景。项目实际使用时要区分通道、配置地址以及筛选发送方。

SimpleUDP 将这些通信管理操作封装为蓝图接口。

## 核心能力

### 多通道收发

可分别配置和管理多个 UDP 通道，按通道进行数据发送与接收。接收采用异步处理，避免把等待数据的工作直接写进使用方的主要蓝图流程。通道如何对应设备或业务，由项目自行命名和组织。

接收通道设置本地绑定地址、单次接收上限和来源过滤；发送通道设置目标地址列表、发送大小上限，也可以指定发送 Socket 绑定的本地端口。

### 地址过滤与广播

接收端可使用 IP 白名单、黑名单和 CIDR 范围过滤来源，并支持广播地址。过滤规则用于限定允许处理的网络来源；它不能代替业务消息的身份校验或内容检查。

### 运行时配置与蓝图接口

通道参数可以在运行时调整，蓝图可调用封装后的通信操作。项目可据此把数据接入自己的业务流程，具体字节格式、字段含义和异常处理仍由通信双方约定。

运行时可用 `UpdateReceiveChannelConfig` 和 `UpdateSendChannelConfig` 分别更新两类通道。同一个本地端口需要交给另一条通道时，先释放原 Socket。

## 适用场景

适用于 UE 与局域网设备或外部程序交换 UDP 数据，需要多个独立端口或按地址筛选来源的项目。在广播发现或多来源接收场景中，也可先用通道和过滤配置整理通信入口。

## 使用流程

1. 启用插件后，在 **项目设置 → SimpleUDP Settings** 添加通道。例如，局域网接收通道可绑定 `0.0.0.0:9000`，并将白名单设为 `192.168.1.0/24`。
2. 用 `BindUDPMessageHandler` 订阅接收事件；第一次绑定时插件创建接收 Socket。移除最后一个处理器会关闭接收 Socket。
3. 用 `SendUDPMessage` 通过发送通道发出字节数组。两端按约定的格式编码和解析。

![](/media-occurrence/work%3Asimple-udp%3Amedia%3A1)

[配置收发通道](/zh/works/simple-udp/docs/channels/) · [查看消息收发示例](/zh/works/simple-udp/docs/messages/)

## 适用范围与边界

仅支持 IPv4，不支持 IPv6 或域名解析。UDP 不保证数据报可靠投递或按发送顺序到达。消息格式解析、丢包后的处理和业务状态维护由项目实现；使用时还需按实际网络与通信协议核对通道、目标地址和过滤规则。

启用插件见 [使用教程](/zh/works/simple-udp/docs/enable-plugin/)。

## 支持与反馈

[联系与合作](https://mzsh.me/contact/)
