---
title: 发送与接收 TCP 消息
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
  group: workflows
  slug: messages
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-tcp-client/docs/messages/
lang: zh
translationKey: doc:simple-tcp-client:messages
---

### 📥 接收

| 节点函数                    | 说明                             |
|----------------------------|----------------------------------|
| `BindMessageHandle`        | 绑定消息接收委托                   |
| `UnbindMessageHandle`      | 解绑指定委托                       |
| `UnbindAllMessageHandle`   | 解绑所有委托并关闭 Socket          |

### 📤 发送

| 节点函数         | 说明                                   |
|-----------------|----------------------------------------|
| `SendMessage`   | 通过指定通道发送字节数组                  |

### 绑定和解绑消息处理  
![](/media-occurrence/doc%3Asimple-tcp-client%3Amessages%3Amedia%3A1)

### 发送消息（字符串或结构化数据）  
![](/media-occurrence/doc%3Asimple-tcp-client%3Amessages%3Amedia%3A2)

---

## ✅ 提示与注意事项

- 仅支持 IPv4——不支持域名、IPv6 或加密
- 所有 Socket 由内部完全管理，无需手动清理
- 插件存在于 `GameInstance` 生命周期中，不受关卡切换影响

---

## 🔧 推荐配套插件

配合 **SimpleByteConversion** 使用，可将常见 Unreal 类型（FString、float、int 等）与 `TArray<uint8>` 互转，构建结构化协议。

---

## 多通道、线程、重连与消息格式

原生 Socket 示例只展示基础收发；实际项目还需要把连接、业务和生命周期组织起来：

-   **多通道管理** — 不同端口处理不同业务逻辑
-   **异步线程处理** — 避免阻塞游戏主线程
-   **自动重连机制** — TCP客户端断线自动重试
-   **会话管理** — TCP服务端区分不同客户端
-   **IP过滤** — 白名单/黑名单机制(支持CIDR)
-   **蓝图支持** — 完整的蓝图节点封装
-   **数据序列化** — 结构体与字节数组的双向转换，见 [SimpleByteConversion 字节转换教程](/zh/works/simple-byte-conversion/docs/primitive-bytes/)。

SimpleTCPClient 提供客户端通道、异步处理和重连入口；服务端的会话管理、UDP 的地址过滤以及 WebSocket 的命名连接分别按对应插件教程接入。恢复传输通道后是否重发消息、重新登录或同步业务状态，需要双方协议另行约定。

先选协议，再理解 Socket 创建和收发，最后补齐异步、多通道和蓝图接入。熟悉 C++ 的使用者也可以沿这些示例练习自己的通信实现，但它们没有包含完整生产通信层。

原生通信示例于 2025-10-25 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/19165484)。
