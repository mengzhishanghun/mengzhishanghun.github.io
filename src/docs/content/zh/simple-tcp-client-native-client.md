---
title: 在 C++ 中实现 TCP 客户端
type: doc
slug: simple-tcp-client-native-client
draft: false
sitePublish: true
tags:
  - TCP
workIds:
  - simple-tcp-client
docPage:
  work: simple-tcp-client
  group: workflows
  slug: native-client
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/simple-tcp-client/docs/native-client/
lang: zh
translationKey: doc:simple-tcp-client:native-client
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
