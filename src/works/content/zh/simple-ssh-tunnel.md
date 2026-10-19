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
      href: /docs/zh/guides/ue-tools/simple-ssh-tunnel-guide/
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
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19165541
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/19165541
sourceDate: 2025-10-25
lang: zh
translationKey: simple-ssh-tunnel
---

## 作品简介

SimpleSSHTunnel 是一个用于 Unreal Engine 的 SSH 隧道插件，可以通过本地端口转发访问远程服务。

插件使用 libssh2 处理 SSH 协议，使用 OpenSSL 提供加密支持，并提供蓝图节点来管理隧道连接。

## 背景与目标

在 UE 中直接启动系统 SSH 客户端，需要额外处理可执行文件路径、进程管理和平台差异。

SimpleSSHTunnel 将相关连接操作封装在插件内，项目可以直接通过蓝图调用。

## 核心能力

### SSH 连接封装

插件负责建立 SSH 隧道，项目无需直接编写 libssh2 会话操作。使用前需要准备可访问的 SSH 服务和相应的认证信息。

### 端口转发

通过 SSH 隧道，将本地端口收到的连接转发到远程服务端口。转发目标、认证信息和网络是否可达，取决于实际部署环境。

### 蓝图侧调用

在项目设置中填写连接参数后，可以通过蓝图创建隧道、查询运行状态、关闭指定隧道或关闭全部隧道。

远程服务使用什么协议、连接后怎样收发和处理数据，仍由项目自己的通信与业务逻辑负责。

## 适用场景

如果 UE 应用需要通过 SSH 隧道访问受限网络中的远程服务，可以用这个插件在蓝图中管理连接，再由项目处理远程服务返回的数据。

## 适用范围与边界

目前支持 Windows。移植到其他平台前，需要核对库文件和构建支持。

默认子系统会在销毁时调用关闭全部隧道。接入实际项目时，仍需检查 SSH 凭据的保存与使用、连接线程和错误处理，以及关闭连接时会话与通道是否正确释放。

操作步骤和参数说明见 [使用教程](/zh/docs/guides/ue-tools/simple-ssh-tunnel-guide/)。
