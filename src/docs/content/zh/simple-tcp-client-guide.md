---
title: SimpleTCPClient 使用文档
description: SimpleTCPClient 的完整中文产品使用文档
type: doc
slug: simple-tcp-client-guide
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
draft: false
sitePublish: true
tags:
  - TCP
workIds:
  - simple-tcp-client
documentKind: product-manual
websiteRoute: /docs/zh/guides/ue-tools/simple-tcp-client-guide/
lang: zh
translationKey: simple-tcp-client-guide
---

# 📘 SimpleTCPClient 插件教程（蓝图版）

**SimpleTCPClient** 是一个为 Unreal Engine 设计的轻量级 TCP 客户端插件。  
支持**运行时动态配置客户端通道**，所有功能均暴露给蓝图，方便集成。

## 网络通信选型与教程入口

UDP 常用于传感器、仿真器和局域网中的高频数据；TCP 用于需要有序字节流的客户端与服务端通信；WebSocket 适合已有 Web 服务、浏览器控制面板和跨语言的实时消息交互。协议选择仍应结合丢包容忍、延迟、消息格式与部署环境，不能仅凭名称判断可靠性或成本。
- [SimpleUDP 使用教程](/zh/docs/guides/ue-tools/simple-udp-guide/)：UDP 收发、地址过滤与原生 Socket 示例。
- [TCP 客户端与网络通信导览](/zh/docs/guides/ue-tools/simple-tcp-client-guide/)：主动连接 TCP 服务、重连与通用架构说明。
- [SimpleTCPServer 使用教程](/zh/docs/guides/ue-tools/simple-tcp-server-guide/)：监听、接受客户端与会话管理。
- [SimpleWebSocket 使用教程](/zh/docs/guides/ue-tools/simple-websocket-guide/)：命名连接、消息委托与 WebSockets 模块示例。
- [SimpleByteConversion 字节转换教程](/zh/docs/guides/ue-tools/simple-byte-conversion-guide/)：业务类型与字节数组的双向转换。

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
![](/media-occurrence/doc%3Asimple-tcp-client-guide%3Amedia%3A1)

### 手动启动/停止连接  
![](/media-occurrence/doc%3Asimple-tcp-client-guide%3Amedia%3A2)  
注：如果通道设置了自动连接且配置了重连间隔，则无需手动启动。

### 绑定和解绑消息处理  
![](/media-occurrence/doc%3Asimple-tcp-client-guide%3Amedia%3A3)

### 动态更新客户端通道配置  
![](/media-occurrence/doc%3Asimple-tcp-client-guide%3Amedia%3A4)  
注：消息委托在 Socket 重连后仍然有效。更新顺序无关紧要——配置更新后，回调仍会被触发。

### 发送消息（字符串或结构化数据）  
![](/media-occurrence/doc%3Asimple-tcp-client-guide%3Amedia%3A5)

---

## ✅ 提示与注意事项

- 仅支持 IPv4——不支持域名、IPv6 或加密
- 所有 Socket 由内部完全管理，无需手动清理
- 插件存在于 `GameInstance` 生命周期中，不受关卡切换影响

---

## 🔧 推荐配套插件

配合 **SimpleByteConversion** 使用，可将常见 Unreal 类型（FString、float、int 等）与 `TArray<uint8>` 互转，构建结构化协议。

---

## 原生 TCP 客户端实现

### 2.1 适用场景

-   连接外部服务器(Python/C#工具链)
-   可靠指令传输(不允许丢包)
-   文件传输、资源下载
-   需要双向通讯的场景

### 2.2 TCP Client基础实现

**连接服务器:**

```cpp
bool ConnectToTCPServer(const FString& IP, int32 Port)
{
    ISocketSubsystem* SocketSubsystem = ISocketSubsystem::Get(PLATFORM_SOCKETSUBSYSTEM);

    // 创建TCP Socket
    FSocket* ClientSocket = SocketSubsystem->CreateSocket(NAME_Stream, TEXT("TCP Client"), false);

    // 设置目标地址
    TSharedRef<FInternetAddr> Addr = SocketSubsystem->CreateInternetAddr();
    bool bIsValid;
    Addr->SetIp(*IP, bIsValid);
    Addr->SetPort(Port);

    if (!bIsValid)
    {
        UE_LOG(LogTemp, Error, TEXT("无效的IP地址: %s"), *IP);
        return false;
    }

    // 连接
    if (ClientSocket->Connect(*Addr))
    {
        UE_LOG(LogTemp, Log, TEXT("TCP连接成功: %s:%d"), *IP, Port);
        return true;
    }
    else
    {
        UE_LOG(LogTemp, Error, TEXT("TCP连接失败"));
        return false;
    }
}
```

**发送和接收数据:**

```cpp
// 发送
bool SendTCPData(FSocket* Socket, const TArray<uint8>& Data)
{
    int32 BytesSent = 0;
    return Socket->Send(Data.GetData(), Data.Num(), BytesSent);
}

// 接收
bool ReceiveTCPData(FSocket* Socket, TArray<uint8>& OutData)
{
    uint32 PendingDataSize = 0;
    if (Socket->HasPendingData(PendingDataSize))
    {
        OutData.SetNumUninitialized(PendingDataSize);
        int32 BytesRead = 0;

        if (Socket->Recv(OutData.GetData(), OutData.Num(), BytesRead))
        {
            OutData.SetNum(BytesRead);
            return true;
        }
    }
    return false;
}
```

### 连接所有权与字节流处理

这些 `FSocket` 函数是原生实现示例，不是 SimpleTCPClient 节点。原连接函数只返回布尔值，尚未向调用方交出 Socket 的持有和释放方式；无效地址、连接失败与关闭路径都要释放资源。同步 `Connect` 还可能等待，不能直接把它放进要求持续响应的游戏主线程流程。

`Send` 返回成功不代表一次调用就发完全部字节，应按实际发送数量继续处理；`Recv` 得到的是字节流的一段，不一定是一条完整业务消息。缓冲区上限、零字节读取、断开和错误都要处理。TCP 的可靠传输也不等于业务指令必定执行或断线后自动恢复，协议仍需定义分帧、确认及恢复规则。

## 多通道、线程、重连与消息格式

原生 Socket 示例只展示基础收发；实际项目还需要把连接、业务和生命周期组织起来：

-   **多通道管理** — 不同端口处理不同业务逻辑
-   **异步线程处理** — 避免阻塞游戏主线程
-   **自动重连机制** — TCP客户端断线自动重试
-   **会话管理** — TCP服务端区分不同客户端
-   **IP过滤** — 白名单/黑名单机制(支持CIDR)
-   **蓝图支持** — 完整的蓝图节点封装
-   **数据序列化** — 结构体与字节数组的双向转换，见 [SimpleByteConversion 字节转换教程](/zh/docs/guides/ue-tools/simple-byte-conversion-guide/)。

SimpleTCPClient 提供客户端通道、异步处理和重连入口；服务端的会话管理、UDP 的地址过滤以及 WebSocket 的命名连接分别按对应插件教程接入。恢复传输通道后是否重发消息、重新登录或同步业务状态，需要双方协议另行约定。

先选协议，再理解 Socket 创建和收发，最后补齐异步、多通道和蓝图接入。熟悉 C++ 的使用者也可以沿这些示例练习自己的通信实现，但它们没有包含完整生产通信层。

原生通信示例于 2025-10-25 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/19165484)。

## 版本历史



打开 **编辑 → 项目设置**，进入 SimpleTCPClient 设置页，将 **Language** 设置为 **English** 或 **中文**。默认语言为英文。面向用户的界面、提示、通知和功能日志会立即更新，无需重启编辑器；公开 API 名称以及模块启动/关闭日志始终保持英文。

## 支持

如有使用问题或合作需求，请前往联系页面。

- **联系入口：** [联系与合作](https://mzsh.me/contact/)
