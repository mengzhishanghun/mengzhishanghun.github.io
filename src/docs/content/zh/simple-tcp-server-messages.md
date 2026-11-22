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
  group: workflows
  slug: messages
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/simple-tcp-server/docs/messages/
lang: zh
translationKey: doc:simple-tcp-server:messages
---

### 📥 接收

| 节点函数                    | 说明                                |
|----------------------------|-------------------------------------|
| `BindMessageHandle`        | 绑定消息接收委托                     |
| `UnbindMessageHandle`      | 解绑指定委托                         |
| `UnbindAllMessageHandle`   | 解绑所有委托                         |

### 📤 发送

| 节点函数           | 说明                                      |
|-------------------|-------------------------------------------|
| `SendMessage`     | 向指定 SessionChannel 发送字节数组          |
| `BroadcastMessage` | 向通道上所有连接广播字节数组               |

## ✅ 注意事项与提示

- 仅支持 IPv4——不支持域名、IPv6 和加密  
- 所有 Socket 由内部管理，无需手动清理  
- 插件跨越关卡切换持续存在，绑定到 GameInstance 生命周期  
- 每个连接的客户端被分配唯一的 `SessionChannel`，格式为 `"IP:Port"`

---

## 🔧 推荐配套插件

- 🔌 **SimpleTCPClient 插件**  
  为客户端设计的轻量级插件，适合连接到 SimpleTCPServer 实例。

- 🧩 **SimpleByteConversion 插件**
  支持原生 Unreal 类型（如 FString、float、int）与 `TArray<uint8>` 之间的转换，适合构建结构化协议。

---
