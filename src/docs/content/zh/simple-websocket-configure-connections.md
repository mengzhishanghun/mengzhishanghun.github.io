---
title: 配置命名 WebSocket 连接
type: doc
slug: simple-websocket-configure-connections
draft: false
sitePublish: true
tags:
  - WebSocket
workIds:
  - simple-websocket
docPage:
  work: simple-websocket
  group: setup
  slug: configure-connections
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-websocket/docs/configure-connections/
lang: zh
translationKey: doc:simple-websocket:configure-connections
---

## 兼容性

- Unreal Engine 5.2–5.8
- 版本 1.1.0（Version 2）

## 界面语言

打开 **编辑 → 项目设置**，进入 SimpleWebSocket 设置页，将 **Language** 设置为 **English** 或 **中文**。默认语言为英文。面向用户的界面、提示、通知和功能日志会立即更新，无需重启编辑器；公开 API 名称以及模块启动/关闭日志始终保持英文。

## 添加命名连接

1. 在 Unreal Engine 编辑器中启用插件。  
2. 前往 `编辑 > 项目设置`  
3. 向下滚动找到 `Simple WebSocket Settings`  
4. 添加新的 WebSocket 连接条目（如命名为 `Test`）  
5. 输入 WebSocket 地址（推荐格式：`ws://127.0.0.1:xxxx`）  
6. 启用 **Auto Connect**（可选；启用后运行时自动建立连接）

![](/media-occurrence/doc%3Asimple-websocket%3Aconfigure-connections%3Amedia%3A1)

## 地址与协议限制

插件仅支持 `ws://`，不支持 `wss://`。连接本机服务时用 `127.0.0.1`，避免使用 `localhost`。

[在蓝图中使用已配置的连接](/zh/works/simple-websocket/docs/connect-and-send/)
