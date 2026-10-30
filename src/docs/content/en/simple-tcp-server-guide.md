---
title: SimpleTCPServer User Guide
description: Complete product user guide for SimpleTCPServer
type: doc
slug: simple-tcp-server-guide
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
draft: false
sitePublish: true
tags:
  - TCP
workIds:
  - simple-tcp-server
documentKind: product-manual
websiteRoute: /docs/zh/guides/ue-tools/simple-tcp-server-guide/
lang: en
translationKey: simple-tcp-server-guide
sourceHash: 946a59a52d12753cac10c2747c869d7ad6a3384edea7caea9ca89482495250a8
translationStatus: translated
generatedBodyHash: 5cc69a4e321c44ad104613400e9dbab3d46c698bf8741efaf9385d5cda5e6259
---

# 📘 SimpleTCPServer Plugin Tutorial (Blueprint Edition)

**SimpleTCPServer** is a lightweight TCP server plugin designed for Unreal Engine.  
It supports **multi-channel listening**, **dynamic configuration updates**, and offers a fully Blueprint-exposed API for managing client connections at runtime.

## Compatibility

- Unreal Engine 5.2–5.8
- Version 1.1.0 (Version 2)

---

## 🔧 Plugin Initialization

Once enabled, the plugin activates automatically.  
It registers as a `GameInstanceSubsystem`, and its lifecycle persists across level transitions.

---

## ⚙️ Static Channel Configuration (Optional)

You can define server listening channels via **Project Settings → SimpleTCPServer Settings**.  
Using this method is recommended for centralized management and ease of debugging.

### 🔹 Channel Config Fields

| Field Name            | Example           | Description                                     |
|-----------------------|-------------------|-------------------------------------------------|
| Channel Name          | `MainServer`      | The name used in Blueprints to refer to channel|
| Bind Address (IP:Port)| `0.0.0.0:8888`     | Address to bind the listening socket           |
| Max Connections       | `32`              | Max number of concurrent client connections    |
| Max Receive Bytes     | `1024`            | Max buffer size for each message               |

---

## 🧠 Blueprint Node Interface

### 📥 Receiving

| Node Function             | Description                                |
|---------------------------|--------------------------------------------|
| `BindMessageHandle`       | Bind message receive delegate              |
| `UnbindMessageHandle`     | Unbind a specific delegate                 |
| `UnbindAllMessageHandle`  | Unbind all delegates                       |

### 🔌 Connection Status Callback

| Node Function              | Description                                      |
|----------------------------|--------------------------------------------------|
| `BindConnectHandle`        | Bind delegate for client connect/disconnect     |
| `UnbindConnectHandle`      | Unbind a specific connection delegate           |
| `UnbindAllConnectHandle`   | Unbind all connection delegates                 |

### 📤 Sending

| Node Function        | Description                                      |
|----------------------|--------------------------------------------------|
| `SendMessage`        | Send byte array to a specific SessionChannel     |
| `BroadcastMessage`   | Send byte array to all connections on a channel  |

### ⚙️ Channel & Connection Management

| Node Function             | Description                                               |
|---------------------------|-----------------------------------------------------------|
| `StartServer`             | Start listening on a server channel                       |
| `StopServer`              | Stop listening and disconnect all clients on the channel  |
| `IsServerRunning`         | Check if a server channel is running                      |
| `GetAllSessions`          | Get all current SessionChannels on a listening channel    |
| `IsSessionConnected`      | Check if a session is still connected                     |
| `UpdateTCPServerConfig`   | Update channel config (hot reload supported)              |
| `GetTCPServerConfig`      | Get current config of a channel                           |

---

## 🔁 Socket Lifecycle

| Type            | Created When                      | Destroyed When                                  |
|------------------|-----------------------------------|--------------------------------------------------|
| Listening Socket | When calling `StartServer`        | When calling `StopServer`                        |
| Session Socket   | When a client is accepted         | When client disconnects or socket is destroyed   |

---

## 🧪 Blueprint Example (Images)

### All Node Overview  
![](/media-occurrence/doc%3Asimple-tcp-server-guide%3Amedia%3A1)

---

## ✅ Notes & Tips

- Only IPv4 is supported — domain name, IPv6, and encryption are not supported  
- All sockets are internally managed, no manual cleanup required  
- Plugin persists across level transitions, bound to GameInstance lifecycle  
- Each connected client is assigned a unique `SessionChannel` in format `"IP:Port"`

---

## 🔧 Recommended Companion Plugins

- 🔌 **SimpleTCPClient Plugin**  
  Lightweight plugin designed for client-side usage, ideal for connecting to a SimpleTCPServer instance.

- 🧩 **SimpleByteConversion Plugin**
  Enables conversion between native Unreal types (e.g., FString, float, int) and `TArray<uint8>`, ideal for building structured protocols.

---

## Native TCP server implementation

### 2.3 Basic TCP server implementation

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

### Listener and session lifetimes

These native examples demonstrate `Bind`, `Listen`, and `Accept`; they are not SimpleTCPServer Blueprint interfaces. Retain ownership of both listening and accepted sockets, and release them on failure, shutdown, or disconnection. The local pointers in these functions do not form a complete server lifecycle.

`Listen(8)` sets the queue for connections waiting to be accepted. It is not the plugin's total client limit. `IP:Port` identifies a network endpoint, not a persistent user identity or authentication. Client data still needs stream framing, partial read/write handling, timeouts, and permission checks. Multiple-client handling should also avoid blocking the game thread.

See the [TCP client and network communication guide](/en/docs/guides/ue-tools/simple-tcp-client-guide/) for protocol choices and shared thread, reconnection, and byte-conversion guidance.

The native communication examples were published on [Cnblogs](https://www.cnblogs.com/mengzhishanghun/p/19165484) on 2025-10-25.

## Version History


Open **Edit → Project Settings**, select the SimpleTCPServer settings page, and set **Language** to **English** or **Chinese**. English is the default. Available user-facing UI, tooltips, notifications, and functional logs update immediately without restarting the editor. Public API names and module startup/shutdown logs remain in English.

## Support

For usage questions or collaboration, please visit the contact page.

- **Contact:** [Contact and collaboration](https://mzsh.me/contact/)
