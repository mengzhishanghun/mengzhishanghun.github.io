---
title: 配置监听与会话生命周期
type: doc
slug: simple-tcp-server-listen
draft: false
sitePublish: true
tags:
  - TCP
workIds:
  - simple-tcp-server
docPage:
  work: simple-tcp-server
  group: workflows
  slug: listen
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-tcp-server/docs/listen/
lang: zh
translationKey: doc:simple-tcp-server:listen
---

**SimpleTCPServer** 是一个为 Unreal Engine 设计的轻量级 TCP 服务器插件。  
支持**多通道监听**、**动态配置更新**，提供完整蓝图 API 用于在运行时管理客户端连接。

## 兼容性

- Unreal Engine 5.2–5.8
- 版本 1.1.0（Version 2）

---

## 🔧 插件初始化

启用后插件自动激活。  
注册为 `GameInstanceSubsystem`，其生命周期跨越关卡切换。

---

## ⚙️ 静态通道配置（可选）

可通过 **项目设置 → SimpleTCPServer Settings** 定义服务器监听通道。  
建议用此方法集中管理和调试。

### 🔹 通道配置字段

| 字段名            | 示例              | 说明                                     |
|------------------|-------------------|------------------------------------------|
| Channel Name     | `MainServer`      | 蓝图中引用通道的名称                       |
| Bind Address (IP:Port) | `0.0.0.0:8888` | 监听 Socket 绑定的地址                  |
| Max Connections  | `32`              | 最大并发客户端连接数                       |
| Max Receive Bytes | `1024`           | 每条消息的最大缓冲区大小                   |

---

## 🧠 蓝图节点接口

### 🔌 连接状态回调

| 节点函数                     | 说明                                      |
|-----------------------------|-------------------------------------------|
| `BindConnectHandle`         | 绑定客户端连接/断开委托                     |
| `UnbindConnectHandle`       | 解绑指定连接委托                           |
| `UnbindAllConnectHandle`    | 解绑所有连接委托                           |

### ⚙️ 通道和连接管理

| 节点函数                    | 说明                                               |
|----------------------------|----------------------------------------------------|
| `StartServer`              | 开始在服务器通道上监听                               |
| `StopServer`               | 停止监听并断开该通道上所有客户端                      |
| `IsServerRunning`          | 检查服务器通道是否正在运行                           |
| `GetAllSessions`           | 获取监听通道上所有当前 SessionChannel                |
| `IsSessionConnected`       | 检查 Session 是否仍然连接                           |
| `UpdateTCPServerConfig`    | 更新通道配置（支持热重载）                           |
| `GetTCPServerConfig`       | 获取通道的当前配置                                  |

---

## 🔁 Socket 生命周期

| 类型            | 创建时机                      | 销毁时机                                  |
|----------------|-------------------------------|-------------------------------------------|
| 监听 Socket    | 调用 `StartServer` 时          | 调用 `StopServer` 时                       |
| Session Socket | 接受客户端连接时               | 客户端断开或 Socket 被销毁时               |

---

## 🧪 蓝图示例（图片）

### 所有节点概览  
![](/media-occurrence/doc%3Asimple-tcp-server%3Alisten%3Amedia%3A1)

---

## 版本历史



打开 **编辑 → 项目设置**，进入 SimpleTCPServer 设置页，将 **Language** 设置为 **English** 或 **中文**。默认语言为英文。面向用户的界面、提示、通知和功能日志会立即更新，无需重启编辑器；公开 API 名称以及模块启动/关闭日志始终保持英文。

## 支持

如有使用问题或合作需求，请前往联系页面。

- **联系入口：** [联系与合作](https://mzsh.me/contact/)
