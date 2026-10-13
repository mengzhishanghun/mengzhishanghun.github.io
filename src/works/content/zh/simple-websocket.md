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
featured: false
draft: false
sitePublish: false
tags:
  - WebSocket
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19165484
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/19165484
sourceDate: 2025-10-25
lang: zh
translationKey: simple-websocket
---

## 作品简介

SimpleWebSocket 在 Unreal Engine 中封装 WebSocket 连接管理。项目可通过命名连接区分通信对象，绑定消息委托，并从蓝图调用相关接口。

它适合需要与 WebSocket 服务持续交换消息的 UE 应用。

## 背景与目标

项目中若有多个 WebSocket 通信入口，需要辨别每条连接属于哪个服务、何时建立，以及收到消息后交给谁处理。SimpleWebSocket 以命名连接和事件委托整理这些入口。

## 核心能力

### 命名连接管理

连接可按名称管理，便于项目将不同 WebSocket 服务或用途对应到明确的连接项。项目启动时也可建立连接，使需要常驻通信的入口随应用流程启动。

### 消息委托

收到的消息可通过委托交给使用方处理。蓝图侧可以订阅相应事件，再按业务协议解释内容。委托负责消息到达后的分发，消息结构仍需双方约定。

### 蓝图接口

连接和消息操作通过蓝图接口提供，供使用方在项目逻辑中调用。网络地址、服务可达性和服务端行为仍由实际部署决定，工具不会凭连接名称自动发现服务器。

## 适用场景

适用于 UE 与已有 WebSocket 服务交换实时消息、需要按用途区分连接并在蓝图中响应消息的项目。可以用于连接外部控制端或消息服务，具体交互取决于对方提供的协议。

## 适用范围与边界

使用前需要可访问的 WebSocket 服务和双方约定的消息格式。连接关闭后的恢复、鉴权方式与消息可靠性处理需按项目需求设计并验证。
