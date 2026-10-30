---
title: SimpleTCPServer 使用文档
description: SimpleTCPServer 的完整中文产品使用文档
type: doc
slug: simple-tcp-server-guide
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
draft: false
sitePublish: true
tags:
  - TCP
workIds:
  - simple-tcp-server
documentKind: product-manual
websiteRoute: /docs/zh/guides/ue-tools/simple-tcp-server-guide/
lang: zh
translationKey: simple-tcp-server-guide
---

# 📘 SimpleTCPServer 插件教程（蓝图版）

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

### 📥 接收

| 节点函数                    | 说明                                |
|----------------------------|-------------------------------------|
| `BindMessageHandle`        | 绑定消息接收委托                     |
| `UnbindMessageHandle`      | 解绑指定委托                         |
| `UnbindAllMessageHandle`   | 解绑所有委托                         |

### 🔌 连接状态回调

| 节点函数                     | 说明                                      |
|-----------------------------|-------------------------------------------|
| `BindConnectHandle`         | 绑定客户端连接/断开委托                     |
| `UnbindConnectHandle`       | 解绑指定连接委托                           |
| `UnbindAllConnectHandle`    | 解绑所有连接委托                           |

### 📤 发送

| 节点函数           | 说明                                      |
|-------------------|-------------------------------------------|
| `SendMessage`     | 向指定 SessionChannel 发送字节数组          |
| `BroadcastMessage` | 向通道上所有连接广播字节数组               |

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
![](/media-occurrence/doc%3Asimple-tcp-server-guide%3Amedia%3A1)

---

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

## 原生 TCP 服务端实现

### 2.3 TCP Server基础实现

**监听端口:**

```cpp
bool StartTCPServer(int32 Port)
{
    ISocketSubsystem* SocketSubsystem = ISocketSubsystem::Get(PLATFORM_SOCKETSUBSYSTEM);

    // 创建监听Socket
    FSocket* ListenSocket = SocketSubsystem->CreateSocket(NAME_Stream, TEXT("TCP Server"), false);

    // 绑定端口
    TSharedRef<FInternetAddr> Addr = SocketSubsystem->CreateInternetAddr();
    Addr->SetPort(Port);
    Addr->SetAnyAddress();

    if (!ListenSocket->Bind(*Addr))
    {
        UE_LOG(LogTemp, Error, TEXT("绑定端口失败: %d"), Port);
        return false;
    }

    // 开始监听(最大8个待连接队列)
    if (!ListenSocket->Listen(8))
    {
        UE_LOG(LogTemp, Error, TEXT("监听失败"));
        return false;
    }

    UE_LOG(LogTemp, Log, TEXT("TCP服务器启动,端口: %d"), Port);
    return true;
}
```

**接受客户端连接:**

```cpp
void AcceptClients(FSocket* ListenSocket)
{
    ISocketSubsystem* SocketSubsystem = ISocketSubsystem::Get(PLATFORM_SOCKETSUBSYSTEM);
    TSharedRef<FInternetAddr> ClientAddr = SocketSubsystem->CreateInternetAddr();
    FSocket* ClientSocket = ListenSocket->Accept(*ClientAddr, TEXT("TCP Client"));

    if (ClientSocket)
    {
        FString ClientIP = ClientAddr->ToString(false);
        int32 ClientPort = ClientAddr->GetPort();

        UE_LOG(LogTemp, Log, TEXT("客户端连接: %s:%d"), *ClientIP, ClientPort);

        // 存储客户端Socket用于后续通讯
    }
}
```

* * *

### 监听与会话的生命周期

这两段原生示例展示 `Bind`、`Listen` 与 `Accept`，不是 SimpleTCPServer 的蓝图接口。监听 Socket 和已接受 Socket 都需要保存所有权并在失败、停止或断开时释放；示例函数里的局部指针没有组成完整的服务器生命周期。

`Listen(8)` 设置待接受连接队列，并不是插件允许的总客户端数。`IP:Port` 能区分网络端点，不能当成长期用户身份或认证。读取客户端数据时仍需要处理字节流分帧、部分读写、超时和权限；多客户端示例也应避免阻塞主线程。

协议选型与共同的线程、重连和字节转换入口见 [TCP 客户端与网络通信导览](/zh/docs/guides/ue-tools/simple-tcp-client-guide/)。

原生通信示例于 2025-10-25 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/19165484)。

## 版本历史



打开 **编辑 → 项目设置**，进入 SimpleTCPServer 设置页，将 **Language** 设置为 **English** 或 **中文**。默认语言为英文。面向用户的界面、提示、通知和功能日志会立即更新，无需重启编辑器；公开 API 名称以及模块启动/关闭日志始终保持英文。

## 支持

如有使用问题或合作需求，请前往联系页面。

- **联系入口：** [联系与合作](https://mzsh.me/contact/)
