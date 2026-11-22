---
title: Implement a TCP Client in C++
type: doc
slug: simple-tcp-client-native-client
draft: false
sitePublish: true
tags:
  - TCP
workIds:
  - simple-tcp-client
documentKind: product-manual
websiteRoute: /en/works/simple-tcp-client/docs/native-client/
lang: en
translationKey: doc:simple-tcp-client:native-client
sourceHash: 7ad3142425984f4a63d53a1f600748b76bab8883ad0a54163eb40a290774e476
translationStatus: translated
generatedBodyHash: 0ea9553b289740ef81650e602938ca460c1ca0b75a8c63a548bce384f46b8182
docPage:
  work: simple-tcp-client
  group: workflows
  slug: native-client
  order: 2
---

## Native TCP client implementation

### 2.1 Use cases

- Connecting to external servers, including Python/C# tools
- Sending commands that require reliable transport
- File transfer and resource downloads
- Bidirectional communication

### 2.2 Basic TCP client implementation

**Connect to a server:**

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

**Send and receive data:**

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

### Connection ownership and byte stream handling

These `FSocket` functions are native implementation examples, not SimpleTCPClient nodes. The connection function only returns a Boolean and does not give the caller a way to own and release the socket. Release resources for invalid addresses, failed connections, and shutdown. A synchronous `Connect` can wait, so keep it out of game-thread flows that need to remain responsive.

A successful `Send` does not mean one call sent every byte; continue according to the actual number sent. `Recv` returns part of a byte stream, which may not be one complete application message. Handle buffer limits, zero-byte reads, disconnections, and errors. Reliable TCP transport does not guarantee that an application command executes or that a disconnected session recovers automatically. Define message framing, acknowledgments, and recovery rules in the application protocol.
