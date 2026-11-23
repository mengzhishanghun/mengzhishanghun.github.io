---
title: 收发 TCP 服务端消息
type: doc
slug: simple-tcp-server-messages
draft: false
sitePublish: true
tags:
  - TCP
workIds:
  - simple-tcp-server
docPage:
  work: simple-tcp-server
  group: features
  slug: messages
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/simple-tcp-server/docs/messages/
lang: zh
translationKey: doc:simple-tcp-server:messages
---

## 接收客户端消息

| 节点函数                    | 说明                                |
|----------------------------|-------------------------------------|
| `BindMessageHandle`        | 绑定消息接收委托                     |
| `UnbindMessageHandle`      | 解绑指定委托                         |
| `UnbindAllMessageHandle`   | 解绑所有委托                         |

## 向单个会话发送或向通道广播

只回复一个客户端时，先按当前会话列表确认它的会话标识；确认要发给通道上的所有客户端时，再选广播。收发两端需使用同一种编码和分帧约定。

| 节点函数           | 说明                                      |
|-------------------|-------------------------------------------|
| `SendMessage`     | 向指定 SessionChannel 发送字节数组          |
| `BroadcastMessage` | 向通道上所有连接广播字节数组               |

## 客户端与字节转换

- **SimpleTCPClient 插件**  
  轻量客户端插件，可用于连接 SimpleTCPServer 实例。

- **SimpleByteConversion 插件**
  支持原生 Unreal 类型（如 FString、float、int）与 `TArray<uint8>` 之间的转换，适合构建结构化协议。
