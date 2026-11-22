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
  group: workflows
  slug: messages
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/simple-udp/docs/messages/
lang: zh
translationKey: doc:simple-udp:messages
---

### 📥 接收

| 节点                           | 说明                             |
|-------------------------------|----------------------------------|
| `BindUDPMessageHandler`       | 绑定消息接收回调                   |
| `UnBindUDPMessageHandler`     | 解绑指定处理器                     |
| `UnBindAllUDPMessageHandler`  | 解绑所有处理器并关闭 Socket        |

### 📤 发送

| 节点              | 说明                             |
|------------------|----------------------------------|
| `SendUDPMessage` | 通过通道发送字节数组（Socket 自动创建）|

### 绑定和解绑示例  
![](/media-occurrence/doc%3Asimple-udp%3Amessages%3Amedia%3A1)

首次绑定后 Socket 自动创建，无处理器时自动销毁。

### 发送字符串消息  
![](/media-occurrence/doc%3Asimple-udp%3Amessages%3Amedia%3A2)

---

## ✅ 提示与注意事项

- 仅支持 IPv4（不支持 IPv6 或域名解析）
- 有效端口范围：`0~65535`，其中 `0` 表示自动分配
- 不要在不同通道中绑定相同端口，除非 Socket 已释放
- IP 过滤支持 CIDR 格式（如 `192.168.1.0/24`）

---

## 🔧 推荐配套

配合 **SimpleByteConversion** 插件使用，可实现数据与 `TArray<uint8>` 之间的序列化/反序列化。

---
