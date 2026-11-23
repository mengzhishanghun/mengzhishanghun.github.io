---
title: SimpleSSHTunnel
description: 基于 libssh2 与 OpenSSL，将 SSH 隧道功能封装为 UE 蓝图接口。
type: work
slug: simple-ssh-tunnel
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
order: 0
status: 正式文档
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/listings/e86019ed-6e80-4f14-b70c-1fb2f0154721
    - kind: docs
      href: /zh/works/simple-ssh-tunnel/docs/connect/
  compatibility:
    - platforms:
        - Windows (Win64)
      requirements:
        - UE 5.2–5.8
featured: false
draft: false
sitePublish: false
tags:
  - SSH
  - Simple 系列
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19165541
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/19165541
docIds:
  - simple-ssh-tunnel-connect
  - simple-ssh-tunnel-manage-tunnels
  - simple-ssh-tunnel-cpp-tunnels
coverAlt: SimpleSSHTunnel封面
websiteCoverUrl: /media/covers/works/simple-ssh-tunnel-20261101.webp
sourceDate: 2025-10-25
lang: zh
translationKey: simple-ssh-tunnel
---

## 作品简介

SimpleSSHTunnel 是一个用于 Unreal Engine 的 SSH 隧道插件，可以通过本地端口转发访问远程服务。

插件使用 libssh2 处理 SSH 协议，使用 OpenSSL 提供加密支持，并提供蓝图节点来管理隧道连接。

## 背景与目标

在 UE 中直接启动系统 SSH 客户端，需要额外处理可执行文件路径、进程管理和平台差异。

用 SimpleSSHTunnel 可以从蓝图管理隧道，无需启动外部 SSH 进程。

## 核心能力

### SSH 连接封装

插件负责建立 SSH 隧道，项目无需直接编写 libssh2 会话操作。使用前需要准备可访问的 SSH 服务和相应的认证信息。

### 端口转发

通过 SSH 隧道，将本地端口收到的连接转发到远程服务端口。转发目标、认证信息和网络是否可达，取决于实际部署环境。

例如，UE 应用可以连接本机监听端口，再由 SSH 隧道把连接转发到远程 API 的端口。应用继续按该 API 的协议收发数据。

### 蓝图侧调用

在项目设置中填写连接参数后，可以通过蓝图创建隧道、查询运行状态、关闭指定隧道或关闭全部隧道。

远程服务使用什么协议、连接后怎样收发和处理数据，仍由项目自己的通信与业务逻辑负责。

## 适用场景

如果 UE 应用需要通过 SSH 隧道访问受限网络中的远程服务，可以用这个插件在蓝图中管理连接，再由项目处理远程服务返回的数据。

## 使用流程

1. 打开 **项目设置 → Engine → Simple SSH Tunnel**，填写本地监听地址与端口、远程目标和 SSH 服务器信息。设置保存在 `DefaultSimpleSSHTunnel.ini` 中。
2. 用 **Create SSHTunnel** 创建命名隧道，再用 **Check SSHTunnel Is Running** 查看该隧道的状态。
3. 不再使用时，调用 **Close SSHTunnel** 关闭指定隧道，或用 **Close All SSHTunnel** 关闭全部隧道。

[查看蓝图节点说明](/zh/works/simple-ssh-tunnel/docs/manage-tunnels/)

## 适用范围与边界

目前支持 Windows。移植到其他平台前，需要核对库文件和构建支持。

默认子系统会在销毁时调用关闭全部隧道。接入实际项目时，仍需检查 SSH 凭据的保存与使用、连接线程和错误处理，以及关闭连接时会话与通道是否正确释放。

连接设置见 [使用教程](/zh/works/simple-ssh-tunnel/docs/connect/)。

使用 SSH 仍需核对服务器身份、认证方式和本地监听范围。如果替换了默认的 **Subsystem Class**，还要确认自定义子系统会在何时关闭隧道。

## 依赖库与来源

SimpleSSHTunnel 用 C++ 实现，提供蓝图接口。

- [libssh2](https://github.com/libssh2/libssh2) 提供 SSH2 连接、用户认证与端口转发，采用 BSD 3-Clause License。
- [OpenSSL](https://github.com/openssl/openssl) 提供 SSL/TLS 和加密算法，采用 Apache 2.0 License。

使用这些库时请遵守相应的许可证，并注明来源。原技术记录于 2025-10-25 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/19165541)。

## 支持与反馈

[联系与合作](https://mzsh.me/contact/)
