---
title: 在 C++ 中使用 UDP Socket
type: doc
slug: simple-udp-native-sockets
draft: false
sitePublish: true
tags:
  - UDP
workIds:
  - simple-udp
docPage:
  work: simple-udp
  group: native
  slug: native-sockets
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-udp/docs/native-sockets/
lang: zh
translationKey: doc:simple-udp:native-sockets
---

## 适用场景

-   传感器数据采集(LiDAR、Camera、GPS)
-   仿真器对接(CarSim、PreScan)
-   局域网广播/组播
-   实时控制指令

## 实现示例

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

## 原生示例与插件通道

这三段 `FSocket` 代码演示绑定、接收和发送，并非 SimpleUDP 的蓝图 API。`ProcessReceivedData` 是项目处理入口，需要自行实现。创建、绑定、收发和关闭的返回值及对象有效性仍需处理，接收端也要有明确的退出和释放路径；原生非阻塞 Socket 不等于已经提供后台接收线程。

示例中的 `65507` 是普通 IPv4 UDP 数据报负载上限的示意值，不是建议每次发送这么大的包；实际可用大小还受路径 MTU、分片和插件通道缓冲区影响。广播或组播是协议层面的应用场景，不能据此推定插件已配置好对应路由、Socket 选项或订阅。UDP 本身不保证投递和顺序，业务应自行处理丢包与消息身份。

多协议选型见 [SimpleTCPClient 作品页](/zh/works/simple-tcp-client/)。该插件的连接文档介绍线程，收发文档提供字节转换入口。

原生通信示例于 2025-10-25 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/19165484)。
