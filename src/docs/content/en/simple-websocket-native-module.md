---
title: Use the UE WebSockets Module
type: doc
slug: simple-websocket-native-module
draft: false
sitePublish: true
tags:
  - WebSocket
workIds:
  - simple-websocket
documentKind: product-manual
websiteRoute: /en/works/simple-websocket/docs/native-module/
lang: en
translationKey: doc:simple-websocket:native-module
sourceHash: 7a92f3fb506e5d0d99097fc7b4ed6a438d022d7d6fcb9468d3972130dd21fd6f
translationStatus: translated
generatedBodyHash: 5c42e3203a85e155b6060491b215ec68d1e1a7805f3b2c81f5503538b7b1ec15
docPage:
  work: simple-websocket
  group: workflows
  slug: native-module
  order: 2
---

## Native examples with the UE WebSockets module

### 3.1 Use cases

- Web frontend control panels
- Real-time push messages from cloud services
- Communication with browsers or mobile clients
- A shared protocol across languages and platforms

### 3.2 UE's built-in WebSockets module

UE provides the `WebSockets` module. Add these dependencies to `.Build.cs`:

```csharp
PublicDependencyModuleNames.AddRange(new string[] {
    "Core",
    "WebSockets",
    "Http"
});
```

### 3.3 Basic implementation

**Connect a WebSocket:**

```cpp
#include "IWebSocket.h"
#include "WebSocketsModule.h"

void ConnectWebSocket(const FString& URL)
{
    // 创建WebSocket实例
    TSharedPtr<IWebSocket> WebSocket = FWebSocketsModule::Get().CreateWebSocket(URL);

    // 绑定连接成功事件
    WebSocket->OnConnected().AddLambda([]()
    {
        UE_LOG(LogTemp, Log, TEXT("WebSocket连接成功"));
    });

    // 绑定消息接收事件
    WebSocket->OnMessage().AddLambda([](const FString& Message)
    {
        UE_LOG(LogTemp, Log, TEXT("收到消息: %s"), *Message);
    });

    // 绑定连接关闭事件
    WebSocket->OnClosed().AddLambda([](int32 StatusCode, const FString& Reason, bool bWasClean)
    {
        UE_LOG(LogTemp, Warning, TEXT("WebSocket关闭: %s"), *Reason);
    });

    // 发起连接
    WebSocket->Connect();
}
```

**Send a message:**

```cpp
void SendWebSocketMessage(TSharedPtr<IWebSocket> WebSocket, const FString& Message)
{
    if (WebSocket.IsValid() && WebSocket->IsConnected())
    {
        WebSocket->Send(Message);
    }
}
```

**Connection notes:**

- Use `127.0.0.1` instead of `localhost` when troubleshooting name resolution in packaged builds.
- The SimpleWebSocket plugin in this guide supports only `ws://`. Check the engine, backend, and certificate configuration for native UE WebSockets module support for `wss://`.
- Example connection URL: `ws://127.0.0.1:8080`.

### Module capabilities and plugin support

These three blocks show `.Build.cs` dependencies, connection creation, event binding, and text messages. They are not SimpleWebSocket node declarations. The project must retain the native `IWebSocket` object until the connection ends. The local `TSharedPtr` does not show where to keep it, and the example does not cover complete connection-error handling, delegate unbinding, or reconnection.

The original technical record described the `ws://` limitation as a general limitation of UE's WebSockets module. That scope was too broad: this guide documents the limitation for SimpleWebSocket, which does not establish that every UE version and underlying backend lacks `wss://` support. For a custom native connection, check the engine version, backend, and certificate configuration.

`127.0.0.1` is the local loopback address, suitable for a service on the same machine. Use the actual destination address for a service on another host. Avoiding `localhost` is a troubleshooting recommendation here; it does not mean remote services should use loopback.

See the [TCP client and network communication guide](/en/works/simple-tcp-client/docs/connect/) for other protocols and shared architecture.

The native communication examples were published on [Cnblogs](https://www.cnblogs.com/mengzhishanghun/p/19165484) on 2025-10-25.
