---
title: SimpleTCPClient
description: 提供 TCP 客户端多通道连接、异步处理和重连管理。
type: work
slug: simple-tcp-client
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
order: 4
status: 正式文档
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/zh-cn/listings/6d6d46bf-eaed-4b66-8382-9d69eb56981e
    - kind: docs
      href: /zh/works/simple-tcp-client/docs/enable-plugin/
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
  - TCP
  - Simple 系列
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19165484
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/19165484
docIds:
  - simple-tcp-client-enable-plugin
  - simple-tcp-client-connect
  - simple-tcp-client-messages
  - simple-tcp-client-native-client
coverAlt: SimpleTCPClient封面
websiteCoverUrl: /media/covers/works/simple-tcp-client-20261101.webp
sourceDate: 2025-10-25
lang: zh
translationKey: simple-tcp-client
---

## 作品简介

SimpleTCPClient 在 Unreal Engine 中封装 TCP 客户端连接，提供多通道管理、异步处理、自动重连间隔配置，以及面向蓝图的连接状态接口。

它帮助项目把与外部服务建立和维护连接的工作集中起来。

## 背景与目标

一个 UE 应用可能同时连接多个外部程序或服务。单次 Socket 连接示例能说明 TCP 收发原理，却没有覆盖多个连接的状态区分和断线后的处理。

插件按通道管理连接。你可以在蓝图中查看各通道的状态，再按项目需要设置重试。

## 核心能力

### 独立通道管理

多个 TCP 客户端通道可分别维护连接，避免不同服务的连接状态混在同一入口。项目可以据通道区分通信对象，并为各自的数据处理建立业务规则。

每条通道有自己的名称、远程地址和接收上限。插件由 `GameInstanceSubsystem` 管理，切换关卡时连接不会因换图而中断。

### 异步处理与重连

连接相关工作采用异步处理，并可配置断线后的自动重连间隔。重连能力用于重新建立传输通道；是否重发消息、恢复登录或同步业务状态，需要由服务协议和使用方决定。

可以在项目设置中启用 **Auto Connect**，也可以从蓝图手动启动通道。`UpdateTCPClientConfig` 可新增或更新通道，Socket 重连后原有消息委托仍有效。

### 状态委托与蓝图调用

插件通过委托提供连接状态，蓝图可据此响应连接变化。项目可以把连接与断开的反馈接入界面或业务流程，但消息内容的编码、分帧和解析仍需双方明确。

## 适用场景

适用于 UE 主动连接外部 TCP 服务、同时维护多个通信目标，或需要在服务断开后按设定间隔重试的应用。项目可分别配置连接通道，并按连接状态处理各服务的业务数据。

## 使用流程

1. 在 **项目设置 → SimpleTCPClient Settings** 添加通道，例如 `DefaultClient`，指向本机测试服务 `127.0.0.1:8888`。
2. 如果未启用自动连接，用 `StartConnection` 启动通道，再用 `IsConnected` 检查状态。
3. 用 `BindMessageHandle` 接收数据，用 `SendMessage` 发送字节数组。不再使用该通道时，调用 `StopConnection` 关闭 Socket。

![](/media-occurrence/work%3Asimple-tcp-client%3Amedia%3A1)

[查看消息收发示例](/zh/works/simple-tcp-client/docs/messages/)

## 适用范围与边界

仅支持 IPv4，不支持域名、IPv6 或加密连接。TCP 提供字节流传输，插件的连接管理不自动定义业务消息边界、序列化格式或重连后的状态恢复。应在实际服务端协议下验证断线、重试和数据处理行为，并核对各通道的配置。

启用插件和首次连接见 [使用教程](/zh/works/simple-tcp-client/docs/enable-plugin/)。

## 支持与反馈

[联系与合作](https://mzsh.me/contact/)

## 选择网络协议

UDP 常用于传感器、仿真器和局域网中的高频数据；TCP 用于需要有序字节流的客户端与服务端通信；WebSocket 适合已有 Web 服务、浏览器控制面板和跨语言的实时消息交互。协议选择仍应结合丢包容忍、延迟、消息格式与部署环境，不能仅凭名称判断可靠性或成本。
- [SimpleUDP 使用教程](/zh/works/simple-udp/docs/channels/)：收发通道与地址过滤。
- [SimpleTCPServer 使用教程](/zh/works/simple-tcp-server/docs/listen/)：启用插件及配置监听。
- [SimpleWebSocket 使用教程](/zh/works/simple-websocket/docs/connect-and-send/)：通过蓝图管理连接并收发消息。
- [SimpleByteConversion 字节转换教程](/zh/works/simple-byte-conversion/docs/primitive-bytes/)：业务类型与字节数组的双向转换。

原技术记录还提到 HTTP 的 `Send Http Request` 蓝图节点，以及按需引入 MQTT、gRPC 等第三方库。具体 HTTP 节点是否可用取决于项目启用的模块或插件，应按所在项目核对；这里不扩展这些协议的实现。

## 原生示例来源

原生通信示例于 2025-10-25 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/19165484)。
