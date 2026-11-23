---
title: 启用 SimpleTCPClient
type: doc
slug: simple-tcp-client-enable-plugin
draft: false
sitePublish: true
tags:
  - TCP
workIds:
  - simple-tcp-client
docPage:
  work: simple-tcp-client
  group: getting-started
  slug: enable-plugin
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-tcp-client/docs/enable-plugin/
lang: zh
translationKey: doc:simple-tcp-client:enable-plugin
---

## 兼容性

- Unreal Engine 5.2–5.8
- 版本 1.1.0（Version 2）

## 界面语言

打开 **编辑 → 项目设置**，进入 SimpleTCPClient 设置页，将 **Language** 设置为 **English** 或 **中文**。默认语言为英文。面向用户的界面、提示、通知和功能日志会立即更新，无需重启编辑器；公开 API 名称以及模块启动/关闭日志始终保持英文。

## 启用插件

启用插件后，`GameInstanceSubsystem` 会自动启动并管理连接，不需要编写初始化或关闭代码。插件的生命周期与 `GameInstance` 一致，切换关卡不影响连接。

## 首次连接

先让目标 TCP 服务开始监听。通道建好后可由自动连接启动，也可以从蓝图手动启动；继续测试收发前，先查看该通道是否已连接。

打开 **项目设置 → SimpleTCPClient Settings**，按[连接设置](/zh/works/simple-tcp-client/docs/connect/)创建通道。

![SimpleTCPClient 通道配置](/media-occurrence/doc%3Asimple-tcp-client%3Aenable-plugin%3Amedia%3A1)

在 TCP Client Settings 中填写通道名称和服务端地址，再根据需要设置自动连接与重连选项。
