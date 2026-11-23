---
title: SimpleWebSocket
description: 通过命名连接和消息委托，在 UE 中使用 WebSocket 通信。
type: work
slug: simple-websocket
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
order: 2
status: 正式文档
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/zh-cn/listings/70e9040b-66c0-4793-a219-93203a117545
    - kind: docs
      href: /zh/works/simple-websocket/docs/configure-connections/
  compatibility:
    - platforms:
        - Windows (Win64)
        - macOS
        - Linux
        - Android
        - iOS
      requirements:
        - UE 5.2–5.8
featured: false
draft: false
sitePublish: false
tags:
  - WebSocket
  - Simple 系列
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19165484
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/19165484
docIds:
  - simple-websocket-configure-connections
  - simple-websocket-connect-and-send
  - simple-websocket-native-module
coverAlt: SimpleWebSocket封面
websiteCoverUrl: /media/covers/works/simple-websocket-20261101.webp
sourceDate: 2025-10-25
lang: zh
translationKey: simple-websocket
---

## 作品简介

SimpleWebSocket 在 Unreal Engine 中封装 WebSocket 连接管理。项目可通过命名连接区分通信对象，绑定消息委托，并从蓝图调用相关接口。

它适合需要与 WebSocket 服务持续交换消息的 UE 应用。

## 背景与目标

项目要连接多个 WebSocket 服务时，可以为每个服务指定连接名，决定何时建立连接，再为收到的消息绑定处理逻辑。

## 核心能力

### 命名连接管理

连接可按名称管理，便于项目将不同 WebSocket 服务或用途对应到明确的连接项。项目启动时也可建立连接，使需要常驻通信的入口随应用流程启动。

### 消息委托

收到的消息可通过委托交给使用方处理。蓝图侧可以订阅相应事件，再按业务协议解释内容。委托负责消息到达后的分发，消息结构仍需双方约定。

同一连接可以用 `Bind Web Socket Message` 绑定多个接收回调。发送文本用 `Send WebSocket Message`；不再处理某条连接的消息时，可以解绑回调。

### 蓝图接口

连接和消息操作通过蓝图接口提供，供使用方在项目逻辑中调用。网络地址、服务可达性和服务端行为仍由实际部署决定，工具不会凭连接名称自动发现服务器。

## 适用场景

适用于 UE 与已有 WebSocket 服务交换实时消息、需要按用途区分连接并在蓝图中响应消息的项目。可以用于连接外部控制端或消息服务，具体交互取决于对方提供的协议。

## 使用流程

1. 在 **项目设置 → Simple WebSocket Settings** 添加命名连接（如 `Test`），填入服务地址。需要随应用启动时，勾选 **Auto Connect**。
2. 手动连接时，按名称调用 `Connect Web Socket`，再用 `Check Web Socket Connect` 查询状态。连接后可绑定回调并发送文本。例如，可以把收到的消息交给 UE 中的控制面板处理。
3. 用 `Close Web Socket` 关闭指定连接，或用 `Close All Web Socket` 关闭全部。

![](/media-occurrence/work%3Asimple-websocket%3Amedia%3A1)

[查看蓝图连接和收发节点](/zh/works/simple-websocket/docs/connect-and-send/)

## 适用范围与边界

仅支持 `ws://`，不支持 `wss://` 安全连接。使用前需要可访问的 WebSocket 服务和双方约定的消息格式。连接关闭后的恢复、鉴权方式与消息可靠性处理需按项目需求设计并验证。

命名连接的配置见 [使用教程](/zh/works/simple-websocket/docs/configure-connections/)。

连接本机服务时，教程建议用 `127.0.0.1` 作为主机地址，避免使用 `localhost`。

## 支持与反馈

[联系与合作](https://mzsh.me/contact/)

## 打包项目

SimpleWebSocket 可用于 UE 打包构建。
