---
title: 收发 TCP 客户端消息
type: doc
slug: simple-tcp-client-messages
draft: false
sitePublish: true
tags:
  - TCP
workIds:
  - simple-tcp-client
docPage:
  work: simple-tcp-client
  group: features
  slug: messages
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/simple-tcp-client/docs/messages/
lang: zh
translationKey: doc:simple-tcp-client:messages
---

## 接收消息

| 节点函数                    | 说明                             |
|----------------------------|----------------------------------|
| `BindMessageHandle`        | 绑定消息接收委托                   |
| `UnbindMessageHandle`      | 解绑指定委托                       |
| `UnbindAllMessageHandle`   | 解绑所有委托并关闭 Socket          |

### 绑定和解绑示例

![](/media-occurrence/doc%3Asimple-tcp-client%3Amessages%3Amedia%3A1)

## 发送消息

| 节点函数         | 说明                                   |
|-----------------|----------------------------------------|
| `SendMessage`   | 通过指定通道发送字节数组                  |

### 发送字符串或结构化数据

用连接时的通道名称发送数据。发送端和接收端先约定编码与消息边界；接收回调拿到的是 TCP 字节流的一段，可能只包含部分消息，也可能包含多条消息。

![](/media-occurrence/doc%3Asimple-tcp-client%3Amessages%3Amedia%3A2)

## 字节数组与业务数据转换

用 **SimpleByteConversion** 在常见 Unreal 类型（FString、float、int 等）和 `TArray<uint8>` 之间转换，以便按约定读写结构化数据。

[SimpleByteConversion 字节转换教程](/zh/works/simple-byte-conversion/docs/primitive-bytes/)
