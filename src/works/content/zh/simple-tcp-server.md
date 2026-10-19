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
      href: /docs/zh/guides/ue-tools/simple-tcp-server-guide/
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
  - TCP
  - Simple 系列
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19165484
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/19165484
sourceDate: 2025-10-25
lang: zh
translationKey: simple-tcp-server
---

## 作品简介

SimpleTCPServer 为 Unreal Engine 提供 TCP 服务端的多客户端会话管理能力。

它把客户端连接与断开事件、以 IP:Port 区分的会话，以及运行时通道配置暴露给蓝图，让项目在 UE 侧接收外部 TCP 客户端连接。

## 背景与目标

实际服务端应用需要持续区分不同客户端，并在客户端离开时更新状态。SimpleTCPServer 围绕会话与连接事件封装这些工作，为业务层提供明确的客户端标识和事件入口。

## 核心能力

### 多客户端会话

服务端按 IP:Port 标识已接入客户端，使多个客户端的连接可以分别处理。使用方可依会话标识关联自己的业务数据；标识代表网络端点，长期用户身份仍需由业务协议定义。

### 连接事件

客户端接入与断开时可获得相应通知。蓝图能够基于这些事件维护界面或业务状态，例如显示当前连接，并清理离线客户端对应的业务记录。

### 通道配置与蓝图接口

工具提供运行时通道配置和蓝图调用入口，便于将服务端通信接入 UE 项目。消息格式、客户端权限和发送策略需要按项目协议设计。

## 适用场景

适合 UE 程序作为 TCP 服务端，接受多个外部程序或设备的连接，并需要按连接区分后续处理的场景。它管理服务端连接和会话，不能直接代替上层业务系统。

## 适用范围与边界

仅支持 IPv4，不支持域名、IPv6 或加密连接。连接数量、会话生命周期、超时和数据处理需要结合目标环境验证。TCP 字节流没有天然的业务消息边界，项目必须自行确定编码和拆包规则；IP:Port 也不应直接作为安全认证依据。

操作步骤和参数说明见 [使用教程](/zh/docs/guides/ue-tools/simple-tcp-server-guide/)。
