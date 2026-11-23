---
title: SimpleTCPServer
description: 提供 TCP 服务端多客户端会话与连接事件接口。
type: work
slug: simple-tcp-server
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
order: 5
status: 正式文档
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/zh-cn/listings/cc276a4a-389b-43e3-8a04-a6d628534108
    - kind: docs
      href: /zh/works/simple-tcp-server/docs/listen/
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
  - simple-tcp-server-listen
  - simple-tcp-server-sessions
  - simple-tcp-server-messages
  - simple-tcp-server-native-server
coverAlt: SimpleTCPServer封面
websiteCoverUrl: /media/covers/works/simple-tcp-server-20261101.webp
sourceDate: 2025-10-25
lang: zh
translationKey: simple-tcp-server
---

## 作品简介

SimpleTCPServer 为 Unreal Engine 提供 TCP 服务端的多客户端会话管理能力。

它把客户端连接与断开事件、以 IP:Port 区分的会话，以及运行时通道配置暴露给蓝图，让项目在 UE 侧接收外部 TCP 客户端连接。

## 背景与目标

服务端往往要分别记录每个客户端的状态。SimpleTCPServer 提供会话标识和连接事件，项目可以据此在客户端接入或退出时更新记录。

## 核心能力

### 多客户端会话

服务端按 IP:Port 标识已接入客户端，使多个客户端的连接可以分别处理。使用方可依会话标识关联自己的业务数据；标识代表网络端点，长期用户身份仍需由业务协议定义。

接受连接后，插件为客户端分配 `SessionChannel`。用 `GetAllSessions` 可以列出某个监听通道当前的会话，也可以用 `IsSessionConnected` 检查指定会话是否仍在线。

### 连接事件

客户端接入与断开时可获得相应通知。蓝图能够基于这些事件维护界面或业务状态，例如显示当前连接，并清理离线客户端对应的业务记录。

### 通道配置与蓝图接口

工具提供运行时通道配置和蓝图调用入口，便于将服务端通信接入 UE 项目。消息格式、客户端权限和发送策略需要按项目协议设计。

监听通道可设置绑定地址、最大并发连接数和接收缓冲区大小。运行时用 `UpdateTCPServerConfig` 更新通道配置；需要向单个客户端回复时用 `SendMessage`，需要向通道内的所有客户端发送同一份字节数组时用 `BroadcastMessage`。

## 适用场景

适合 UE 程序作为 TCP 服务端，接受多个外部程序或设备的连接，并需要按连接区分后续处理的场景。它管理服务端连接和会话，不能直接代替上层业务系统。

## 使用流程

1. 在 **项目设置 → SimpleTCPServer Settings** 添加 `MainServer` 等命名通道，填写监听地址和连接上限，再用 `StartServer` 开始监听。
2. 用 `BindConnectHandle` 跟踪客户端接入与断开，用 `BindMessageHandle` 接收数据。例如，多台设备接入后，可按会话标识将回复发回请求方。
3. 用 `StopServer` 停止监听。插件会关闭监听 Socket，并断开该通道上的客户端。

![](/media-occurrence/work%3Asimple-tcp-server%3Amedia%3A1)

[查看会话管理](/zh/works/simple-tcp-server/docs/sessions/) · [查看消息收发](/zh/works/simple-tcp-server/docs/messages/)

## 适用范围与边界

仅支持 IPv4，不支持域名、IPv6 或加密连接。连接数量、会话生命周期、超时和数据处理需要结合目标环境验证。TCP 字节流没有天然的业务消息边界，项目必须自行确定编码和拆包规则；IP:Port 也不应直接作为安全认证依据。

启用插件和监听配置见 [使用教程](/zh/works/simple-tcp-server/docs/listen/)。

## 支持与反馈

[联系与合作](https://mzsh.me/contact/)
