---
title: Implement a TCP Server in C++
type: doc
slug: simple-tcp-server-native-server
draft: false
sitePublish: true
tags:
  - TCP
workIds:
  - simple-tcp-server
documentKind: product-manual
websiteRoute: /en/works/simple-tcp-server/docs/native-server/
lang: en
translationKey: doc:simple-tcp-server:native-server
sourceHash: 52b2a3e09a4f016a4ded8dcc0153a77df53d8cda8c77e142a126d2e3e512734d
translationStatus: translated
generatedBodyHash: 09c555dcc087697b6bd87fde26e2c4bd63c726da2cd3815394c265554f0f049b
docPage:
  work: simple-tcp-server
  group: native
  slug: native-server
  order: 1
---

## Implementation example

**Listen on a port:**

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

**Accept a client connection:**

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

## Listener and session lifecycles

These native examples demonstrate `Bind`, `Listen`, and `Accept`; they are not SimpleTCPServer Blueprint interfaces. Retain ownership of both listening and accepted sockets, and release them on failure, shutdown, or disconnection. The local pointers in these functions do not form a complete server lifecycle.

`Listen(8)` sets the queue for connections waiting to be accepted. It is not the plugin's total client limit. `IP:Port` identifies a network endpoint, not a persistent user identity or authentication. Client data still needs stream framing, partial read/write handling, timeouts, and permission checks. Multiple-client handling should also avoid blocking the game thread.

See the [SimpleTCPClient overview](/en/works/simple-tcp-client/) for protocol choices. Its connection guide covers threading and reconnection, and its messaging guide links to byte conversion.

The native communication examples were published on [Cnblogs](https://www.cnblogs.com/mengzhishanghun/p/19165484) on 2025-10-25.
