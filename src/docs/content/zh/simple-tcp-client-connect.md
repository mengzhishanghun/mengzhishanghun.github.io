---
title: 配置与管理 TCP 客户端连接
type: doc
slug: simple-tcp-client-connect
draft: false
sitePublish: true
tags:
  - TCP
workIds:
  - simple-tcp-client
docPage:
  work: simple-tcp-client
  group: setup
  slug: connect
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-tcp-client/docs/connect/
lang: zh
translationKey: doc:simple-tcp-client:connect
---

**SimpleTCPClient** 是一个为 Unreal Engine 设计的轻量级 TCP 客户端插件。  
支持**运行时动态配置客户端通道**，所有功能均暴露给蓝图，方便集成。

## 网络通信选型与教程入口

UDP 常用于传感器、仿真器和局域网中的高频数据；TCP 用于需要有序字节流的客户端与服务端通信；WebSocket 适合已有 Web 服务、浏览器控制面板和跨语言的实时消息交互。协议选择仍应结合丢包容忍、延迟、消息格式与部署环境，不能仅凭名称判断可靠性或成本。
- [SimpleUDP 使用教程](/zh/works/simple-udp/docs/channels/)：UDP 收发、地址过滤与原生 Socket 示例。
- [TCP 客户端与网络通信导览](/zh/works/simple-tcp-client/docs/connect/)：主动连接 TCP 服务、重连与通用架构说明。
- [SimpleTCPServer 使用教程](/zh/works/simple-tcp-server/docs/listen/)：监听、接受客户端与会话管理。
- [SimpleWebSocket 使用教程](/zh/works/simple-websocket/docs/connect-and-send/)：命名连接、消息委托与 WebSockets 模块示例。
- [SimpleByteConversion 字节转换教程](/zh/works/simple-byte-conversion/docs/primitive-bytes/)：业务类型与字节数组的双向转换。

原技术记录还提到 HTTP 的 `Send Http Request` 蓝图节点，以及按需引入 MQTT、gRPC 等第三方库。具体 HTTP 节点是否可用取决于项目启用的模块或插件，应按所在项目核对；这里不扩展这些协议的实现。

## 兼容性

- Unreal Engine 5.2–5.8
- 版本 1.1.0（Version 2）

---

## 🔧 插件初始化

插件启用后自动激活。  
内部注册为 `GameInstanceSubsystem`，无需手动编写启动或关闭代码。

---

## ⚙️ 静态通道配置（可选）

可通过 **项目设置 → SimpleTCPClient Settings** 预定义客户端通道。  
建议在此处配置通道，便于集中管理。

### 🔹 客户端通道配置字段

| 字段                 | 示例                | 说明                                |
|---------------------|---------------------|-------------------------------------|
| Channel Name         | `DefaultClient`     | 蓝图中引用通道的名称                  |
| Remote Address (IP:Port) | `127.0.0.1:8888` | 要连接的目标地址                     |
| Auto Connect         | `True`              | 是否在启动时自动连接                  |
| Auto Reconnect Interval | `1.0`（秒）       | 重连尝试间隔                         |
| Max Receive Bytes    | `1024`              | 每次接收的最大字节数                  |

---

## 🧠 蓝图节点接口

### ⚙️ 运行时通道管理

| 节点函数                    | 说明                                         |
|----------------------------|----------------------------------------------|
| `StartConnection`          | 手动启动连接（用于非自动连接的通道）            |
| `StopConnection`           | 停止并销毁 Socket                             |
| `IsConnected`              | 检查通道当前是否已连接                         |
| `UpdateTCPClientConfig`    | 创建或更新通道配置（自动重连）                  |
| `GetTCPClientConfig`       | 获取通道的当前配置                             |

---

## 🔁 Socket 生命周期

| 类型          | 创建时机                           | 销毁时机                            |
|--------------|-----------------------------------|-------------------------------------|
| Client Socket| 调用 `StartConnection` 或自动连接时 | 调用 `StopConnection` 或关闭时       |

---

## 🧪 蓝图示例（图片）

### 所有蓝图节点  
![](/media-occurrence/doc%3Asimple-tcp-client%3Aconnect%3Amedia%3A1)

### 手动启动/停止连接  
![](/media-occurrence/doc%3Asimple-tcp-client%3Aconnect%3Amedia%3A2)  
注：如果通道设置了自动连接且配置了重连间隔，则无需手动启动。

### 动态更新客户端通道配置  
![](/media-occurrence/doc%3Asimple-tcp-client%3Aconnect%3Amedia%3A3)  
注：消息委托在 Socket 重连后仍然有效。更新顺序无关紧要——配置更新后，回调仍会被触发。

## 版本历史



打开 **编辑 → 项目设置**，进入 SimpleTCPClient 设置页，将 **Language** 设置为 **English** 或 **中文**。默认语言为英文。面向用户的界面、提示、通知和功能日志会立即更新，无需重启编辑器；公开 API 名称以及模块启动/关闭日志始终保持英文。

## 支持

如有使用问题或合作需求，请前往联系页面。

- **联系入口：** [联系与合作](https://mzsh.me/contact/)
