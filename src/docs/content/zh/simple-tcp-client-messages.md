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
  group: network
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

![](/media-occurrence/doc%3Asimple-tcp-client%3Amessages%3Amedia%3A2)

## 字节数组与业务数据转换

配合 **SimpleByteConversion** 使用，可将常见 Unreal 类型（FString、float、int 等）与 `TArray<uint8>` 互转，构建结构化协议。

[SimpleByteConversion 字节转换教程](/zh/works/simple-byte-conversion/docs/primitive-bytes/)
