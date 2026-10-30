---
title: SimpleUDP 使用文档
description: SimpleUDP 的完整中文产品使用文档
type: doc
slug: simple-udp-guide
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
draft: false
sitePublish: true
tags:
  - UDP
workIds:
  - simple-udp
documentKind: product-manual
websiteRoute: /docs/zh/guides/ue-tools/simple-udp-guide/
lang: zh
translationKey: simple-udp-guide
---

# 📘 SimpleUDP 插件教程（蓝图版）

**SimpleUDP** 是 Unreal Engine 的轻量级 UDP 通信插件。  
支持**运行时动态配置收发通道**，所有功能均暴露给蓝图，方便集成。

## 兼容性

- Unreal Engine 5.2–5.8
- 版本 1.1.0（Version 2）

---

## 🔧 插件初始化

插件启用后立即生效。  
内部注册为 `GameInstanceSubsystem`——无需手动编写启动或关闭代码。

---

## ⚙️ 静态通道配置（可选）

可通过 **项目设置 → SimpleUDP Settings** 预配置通道。

注意：虽然支持运行时修改通道，但建议尽可能在此处配置，便于管理。

### 🔹 接收通道

| 字段             | 示例                | 说明                              |
|-----------------|---------------------|-----------------------------------|
| Channel Name    | `DefaultRecv`       | 蓝图中使用的通道名称                |
| Bind Address    | `0.0.0.0:9000`      | 要监听的本地 IP 和端口             |
| Max Receive Bytes | `1024`            | 每次接收的最大包大小                |
| Filter Mode     | None / Whitelist / Blacklist | IP 过滤模式              |
| Whitelist / Blacklist | `["192.168.1.0/24"]` | 支持 CIDR 格式             |

> **重要：** `Max Receive Bytes` 默认值为 `1024` 字节。如果协议中的单个 UDP 数据包可能超过 1024 字节，请务必在接收前调大对应接收通道的该参数，否则数据包可能无法被完整接收。

### 🔹 发送通道

| 字段             | 示例                            | 说明                              |
|-----------------|---------------------------------|-----------------------------------|
| Channel Name    | `DefaultSend`                   | 通道名称                           |
| Target Addresses | `["255.255.255.255:9000"]`     | 目标 IP:Port 列表                  |
| Fixed Port 🔧   | `0`（默认）                      | 发送 Socket 的本地绑定端口（0 = 自动）|
| Max Send Bytes  | `1024`                          | 每个包的最大大小                    |

> **重要：** `Max Send Bytes` 默认值为 `1024` 字节。如果协议中的单个 UDP 数据包可能超过 1024 字节，请务必在发送前调大对应发送通道的该参数，否则只会发送配置上限以内的数据。

---

## 🧠 蓝图节点接口

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

### ⚙️ 运行时配置

| 节点                           | 说明                                          |
|-------------------------------|-----------------------------------------------|
| `UpdateReceiveChannelConfig`  | 创建/更新接收通道（如需要会重新绑定）            |
| `UpdateSendChannelConfig`     | 创建/更新发送通道，支持 `FixedPort` ✅          |
| `GetReceiveChannelConfig`     | 获取单个接收通道配置                            |
| `GetSendChannelConfig`        | 获取单个发送通道配置                            |
| `GetAllReceiveChannelConfig`  | 获取所有接收通道配置                            |
| `GetAllSendChannelConfig`     | 获取所有发送通道配置                            |

### 🛠️ 工具节点

| 节点             | 说明                                |
|-----------------|-------------------------------------|
| `ParseEndpoint` | 解析 `"127.0.0.1:9000"` 为 IP 和端口 |
| `IsIPInCIDR`    | 检查 IP 是否在 CIDR 块内             |

---

## 🔁 Socket 生命周期

| 类型   | 创建时机                              | 销毁时机                             |
|--------|--------------------------------------|--------------------------------------|
| 接收端 | 首次调用 `BindUDPMessageHandler` 时    | 所有处理器移除 → 自动关闭 Socket      |
| 发送端 | 首次调用 `SendUDPMessage` 或配置时     | 插件关闭或通道删除时                   |

---

## 🧪 蓝图示例（图片）

### 所有蓝图函数  
![](/media-occurrence/doc%3Asimple-udp-guide%3Amedia%3A1)

### 绑定和解绑示例  
![](/media-occurrence/doc%3Asimple-udp-guide%3Amedia%3A2)

首次绑定后 Socket 自动创建，无处理器时自动销毁。

### 解绑全部（强制关闭 Socket）  
![](/media-occurrence/doc%3Asimple-udp-guide%3Amedia%3A3)

使用此节点解绑通道上的所有内容并手动关闭 Socket。

### 动态更新接收通道  
![](/media-occurrence/doc%3Asimple-udp-guide%3Amedia%3A4)

如需要 Socket 会自动重建。函数调用顺序无关紧要。  

两个布尔值控制是覆盖现有通道还是添加新通道。

### 动态更新发送通道  
![](/media-occurrence/doc%3Asimple-udp-guide%3Amedia%3A5)

发送 Socket 仅在 `FixedPort` 不同时重建。  

两个布尔值的行为与接收配置相同。

### 发送字符串消息  
![](/media-occurrence/doc%3Asimple-udp-guide%3Amedia%3A6)

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

## 原生 UDP Socket 实现与场景选择

### 1.1 适用场景

-   传感器数据采集(LiDAR、Camera、GPS)
-   仿真器对接(CarSim、PreScan)
-   局域网广播/组播
-   实时控制指令

### 1.2 基础实现

**创建UDP Socket并绑定端口:**

```cpp
#include "Sockets.h"
#include "SocketSubsystem.h"

// 获取Socket子系统
ISocketSubsystem* SocketSubsystem = ISocketSubsystem::Get(PLATFORM_SOCKETSUBSYSTEM);

// 创建UDP Socket
FSocket* RecvSocket = SocketSubsystem->CreateSocket(NAME_DGram, TEXT("UDP Receiver"), false);

// 创建地址并绑定
TSharedRef<FInternetAddr> Addr = SocketSubsystem->CreateInternetAddr();
Addr->SetPort(8888);
Addr->SetAnyAddress();

if (RecvSocket->Bind(*Addr))
{
    UE_LOG(LogTemp, Log, TEXT("UDP Socket绑定成功,端口: 8888"));
}

// 设置非阻塞模式
RecvSocket->SetNonBlocking(true);
```

**接收UDP数据:**

```cpp
void ReceiveUDPData(FSocket* RecvSocket)
{
    ISocketSubsystem* SocketSubsystem = ISocketSubsystem::Get(PLATFORM_SOCKETSUBSYSTEM);

    TArray<uint8> RecvData;
    RecvData.SetNumUninitialized(65507); // UDP最大包大小

    int32 BytesRead = 0;
    TSharedRef<FInternetAddr> SenderAddr = SocketSubsystem->CreateInternetAddr();

    if (RecvSocket->RecvFrom(RecvData.GetData(), RecvData.Num(), BytesRead, *SenderAddr))
    {
        RecvData.SetNum(BytesRead);

        FString SenderIP = SenderAddr->ToString(false);
        int32 SenderPort = SenderAddr->GetPort();

        UE_LOG(LogTemp, Log, TEXT("收到来自 %s:%d 的数据,大小: %d"),
            *SenderIP, SenderPort, BytesRead);

        // 处理接收到的数据
        ProcessReceivedData(RecvData);
    }
}
```

**发送UDP数据:**

```cpp
void SendUDPData(const FString& TargetIP, int32 TargetPort, const TArray<uint8>& Data)
{
    ISocketSubsystem* SocketSubsystem = ISocketSubsystem::Get(PLATFORM_SOCKETSUBSYSTEM);
    FSocket* SendSocket = SocketSubsystem->CreateSocket(NAME_DGram, TEXT("UDP Sender"), false);

    TSharedRef<FInternetAddr> RemoteAddr = SocketSubsystem->CreateInternetAddr();
    bool bIsValid;
    RemoteAddr->SetIp(*TargetIP, bIsValid);
    RemoteAddr->SetPort(TargetPort);

    if (bIsValid)
    {
        int32 BytesSent = 0;
        SendSocket->SendTo(Data.GetData(), Data.Num(), BytesSent, *RemoteAddr);

        UE_LOG(LogTemp, Log, TEXT("发送 %d 字节到 %s:%d"), BytesSent, *TargetIP, TargetPort);
    }

    SendSocket->Close();
    ISocketSubsystem::Get()->DestroySocket(SendSocket);
}
```

* * *

### 原生示例与插件通道的区别

这三段 `FSocket` 代码演示绑定、接收和发送，并非 SimpleUDP 的蓝图 API。`ProcessReceivedData` 是项目处理入口，需要自行实现。创建、绑定、收发和关闭的返回值及对象有效性仍需处理，接收端也要有明确的退出和释放路径；原生非阻塞 Socket 不等于已经提供后台接收线程。

示例中的 `65507` 是普通 IPv4 UDP 数据报负载上限的示意值，不是建议每次发送这么大的包；实际可用大小还受路径 MTU、分片和插件通道缓冲区影响。广播或组播是协议层面的应用场景，不能据此推定插件已配置好对应路由、Socket 选项或订阅。UDP 本身不保证投递和顺序，业务应自行处理丢包与消息身份。

多协议选型、线程和数据转换入口见 [TCP 客户端与网络通信导览](/zh/docs/guides/ue-tools/simple-tcp-client-guide/)。

原生通信示例于 2025-10-25 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/19165484)。

## 版本历史



打开 **编辑 → 项目设置**，进入 SimpleUDP 设置页，将 **Language** 设置为 **English** 或 **中文**。默认语言为英文。面向用户的界面、提示、通知和功能日志会立即更新，无需重启编辑器；公开 API 名称以及模块启动/关闭日志始终保持英文。

## 支持

如有使用问题或合作需求，请前往联系页面。

- **联系入口：** [联系与合作](https://mzsh.me/contact/)
