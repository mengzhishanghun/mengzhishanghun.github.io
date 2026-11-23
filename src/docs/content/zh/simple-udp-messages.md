---
title: 发送和接收 UDP 数据
type: doc
slug: simple-udp-messages
draft: false
sitePublish: true
tags:
  - UDP
workIds:
  - simple-udp
docPage:
  work: simple-udp
  group: features
  slug: messages
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/simple-udp/docs/messages/
lang: zh
translationKey: doc:simple-udp:messages
---

## 接收数据

先在项目设置中确认接收通道的名称、监听地址和过滤规则。把同一个通道名称传给绑定与解绑节点；绑定处理器后，从符合过滤规则的发送端发一个测试数据报，检查回调是否收到预期字节。

| 节点                           | 说明                             |
|-------------------------------|----------------------------------|
| `BindUDPMessageHandler`       | 绑定消息接收回调                   |
| `UnBindUDPMessageHandler`     | 解绑指定处理器                     |
| `UnBindAllUDPMessageHandler`  | 解绑所有处理器并关闭 Socket        |

### 绑定与解绑示例

![](/media-occurrence/doc%3Asimple-udp%3Amessages%3Amedia%3A1)

### 解绑所有接收处理器

![](/media-occurrence/doc%3Asimple-udp%3Amessages%3Amedia%3A2)

需要结束整个通道的接收时，用这个节点解绑所有处理器并关闭 Socket。

## 发送数据

| 节点              | 说明                             |
|------------------|----------------------------------|
| `SendUDPMessage` | 通过通道发送字节数组（Socket 自动创建）|

### 发送字符串示例

![](/media-occurrence/doc%3Asimple-udp%3Amessages%3Amedia%3A3)

## 收发 Socket 生命周期

| 类型   | 创建时机                              | 销毁时机                             |
|--------|--------------------------------------|--------------------------------------|
| 接收端 | 首次调用 `BindUDPMessageHandler` 时    | 所有处理器移除 → 自动关闭 Socket      |
| 发送端 | 首次调用 `SendUDPMessage` 或配置时     | 插件关闭或通道删除时                   |

## 转换字节数组

配合 **SimpleByteConversion** 插件使用，可实现数据与 `TArray<uint8>` 之间的序列化/反序列化。
