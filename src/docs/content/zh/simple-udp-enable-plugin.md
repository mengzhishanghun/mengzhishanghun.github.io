---
title: 启用 SimpleUDP
type: doc
slug: simple-udp-enable-plugin
draft: false
sitePublish: true
tags:
  - UDP
workIds:
  - simple-udp
docPage:
  work: simple-udp
  group: getting-started
  slug: enable-plugin
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-udp/docs/enable-plugin/
lang: zh
translationKey: doc:simple-udp:enable-plugin
---

## 兼容性

- Unreal Engine 5.2–5.8
- 版本 1.1.0（Version 2）

## 界面语言

打开 **编辑 → 项目设置**，进入 SimpleUDP 设置页，将 **Language** 设置为 **English** 或 **中文**。默认语言为英文。面向用户的界面、提示、通知和功能日志会立即更新，无需重启编辑器；公开 API 名称以及模块启动/关闭日志始终保持英文。

## 启用插件

启用后先配置通道。接收通道要填本地监听端点；发送通道要填目标端点。之后在蓝图中用相应的通道名称绑定接收或发送数据。

启用后，插件由 `GameInstanceSubsystem` 自动运行，无需另写启动或关闭代码。

[在项目设置中配置收发通道](/zh/works/simple-udp/docs/channels/)

![SimpleUDP 接收与发送通道设置](/media-occurrence/doc%3Asimple-udp%3Aenable-plugin%3Amedia%3A1)

在 Simple UDP Settings 中分别配置接收和发送通道。监听地址与目标地址用途不同，填写时按各自的通道说明核对。
