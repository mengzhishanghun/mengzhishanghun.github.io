---
title: 在 C++ 中实现 TCP 服务端
type: doc
slug: simple-tcp-server-native-server
draft: false
sitePublish: true
tags:
  - TCP
workIds:
  - simple-tcp-server
docPage:
  work: simple-tcp-server
  group: features
  slug: native-server
  order: 3
documentKind: product-manual
websiteRoute: /zh/works/simple-tcp-server/docs/native-server/
lang: zh
translationKey: doc:simple-tcp-server:native-server
---

## 实现示例

先创建并启动监听，再用一个测试客户端发起连接，确认接收连接得到有效的会话 Socket。测试结束时，分别核对监听和已接受连接的释放路径。

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

## 监听与会话的生命周期

这两段原生示例展示 `Bind`、`Listen` 与 `Accept`，不是 SimpleTCPServer 的蓝图接口。让项目持有监听 Socket 和已接受的 Socket，并在失败、停止或断开时释放。示例只定义了局部指针，没有演示完整的持有和释放过程。

`Listen(8)` 设置待接受连接队列，并不是插件允许的总客户端数。`IP:Port` 能区分网络端点，不能当成长期用户身份或认证。读取客户端数据时仍需要处理字节流分帧、部分读写、超时和权限；多客户端示例也应避免阻塞主线程。

协议选型见 [SimpleTCPClient 作品页](/zh/works/simple-tcp-client/)。该插件的连接文档介绍线程和重连，收发文档提供字节转换入口。

原生通信示例于 2025-10-25 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/19165484)。
