---
title: Use UDP Sockets in C++
type: doc
slug: simple-udp-native-sockets
draft: false
sitePublish: true
tags:
  - UDP
workIds:
  - simple-udp
documentKind: product-manual
websiteRoute: /en/works/simple-udp/docs/native-sockets/
lang: en
translationKey: doc:simple-udp:native-sockets
sourceHash: 9143cd48e572584aeb3971782f83174eccb975f7daaa45c97a9b22e618acc1d4
translationStatus: translated
generatedBodyHash: 54b10dffe14a582a04f8d13fbd7483bf1fdb8f2ab5c1f2ec11dd913b576a77fb
docPage:
  work: simple-udp
  group: workflows
  slug: native-sockets
  order: 3
---

## Native UDP sockets and use cases

### 1.1 Use cases

- Collecting sensor data, such as LiDAR, camera, and GPS data
- Connecting simulators such as CarSim and PreScan
- LAN broadcast or multicast
- Real-time control commands

### 1.2 Basic implementation

**Create a UDP socket and bind a port:**

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

**Receive UDP data:**

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

**Send UDP data:**

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

### Native examples and plugin channels

These three `FSocket` examples demonstrate binding, receiving, and sending. They are not SimpleUDP Blueprint APIs. Implement `ProcessReceivedData` in your project. Check object validity and the return values from creation, binding, data transfer, and closing. The receiver also needs an explicit exit and cleanup path. A nonblocking native socket does not by itself provide a background receive thread.

The example's `65507` illustrates the usual IPv4 UDP datagram payload limit. It is not a recommended packet size. The usable size also depends on path MTU, fragmentation, and plugin channel buffers. Broadcast and multicast are protocol use cases; listing them does not mean the plugin has configured the routes, socket options, or subscriptions they require. UDP does not guarantee delivery or ordering, so application logic must handle packet loss and message identity.

See the [TCP client and network communication guide](/en/works/simple-tcp-client/docs/connect/) for protocol choices, threading, and data conversion.

The native communication examples were published on [Cnblogs](https://www.cnblogs.com/mengzhishanghun/p/19165484) on 2025-10-25.
