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
featured: false
draft: false
sitePublish: false
tags:
  - UDP
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19165484
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/19165484
sourceDate: 2025-10-25
lang: zh
translationKey: simple-udp
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/zh-cn/listings/9e0d0c8c-ac79-4699-925c-abdfe9ac51eb
    - kind: docs
      href: /docs/zh/guides/ue-tools/simple-udp-guide/
  compatibility:
    - platforms: []
      requirements:
        - UE 5.2–5.8
---
## 作品简介

SimpleUDP 为 Unreal Engine 项目提供蓝图可调用的 UDP 通信能力，将多通道收发、异步接收、地址过滤和运行时配置集中在一个插件中。

它面向需要按不同用途维护 UDP 通道、并在接收端限制来源地址的项目。

## 背景与目标

UDP 可以用于局域网消息、外部设备数据和其他对传输时效有要求的场景。项目实际使用时要区分通道、配置地址以及筛选发送方。

SimpleUDP 将这些通信管理操作封装为蓝图接口。

## 核心能力

### 多通道收发

可分别配置和管理多个 UDP 通道，按通道进行数据发送与接收。接收采用异步处理，避免把等待数据的工作直接写进使用方的主要蓝图流程。通道如何对应设备或业务，由项目自行命名和组织。

### 地址过滤与广播

接收端可使用 IP 白名单、黑名单和 CIDR 范围过滤来源，并支持广播地址。过滤规则用于限定允许处理的网络来源；它不能代替业务消息的身份校验或内容检查。

### 运行时配置与蓝图接口

通道参数可以在运行时调整，蓝图可调用封装后的通信操作。项目可据此把数据接入自己的业务流程，具体字节格式、字段含义和异常处理仍由通信双方约定。

## 适用场景

适用于 UE 与局域网设备或外部程序交换 UDP 数据，需要多个独立端口或按地址筛选来源的项目。在广播发现或多来源接收场景中，也可先用通道和过滤配置整理通信入口。

## 适用范围与边界

UDP 不保证数据报可靠投递或按发送顺序到达。消息格式解析、丢包后的处理和业务状态维护由项目实现；使用时还需按实际网络与通信协议核对通道、目标地址和过滤规则。
