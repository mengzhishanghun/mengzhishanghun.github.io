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
sourceHash: b7f99b66af57951b5b8441e2f529c1107b9eef183cee2f55f50190b104cb0c63
translationStatus: translated
generatedBodyHash: c8f9c5c810d61c24916258d823a9649371e01964fe9e857d6614b9dbc5d5fe12
docPage:
  work: simple-websocket
  group: features
  slug: native-module
  order: 2
---

## Use cases

- Web frontend control panels
- Real-time push messages from cloud services
- Communication with browsers or mobile clients
- A shared protocol across languages and platforms

## Add the built-in WebSockets module

To use UE’s built-in `WebSockets` module, add these dependencies to `.Build.cs`:

```csharp
PublicDependencyModuleNames.AddRange(new string[] {
    "Core",
    "WebSockets",
    "Http"
});
```

## Implementation example

Start the target WebSocket service before running the example and check the connection event. Send a short text message and check what the server receives. If the service replies, check the receive event as well.

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

- For a local service in a packaged build, try `127.0.0.1` in place of `localhost` when troubleshooting name resolution.
- The SimpleWebSocket plugin in this guide supports only `ws://`. Check the engine, backend, and certificate configuration for native UE WebSockets module support for `wss://`.
- Example connection URL: `ws://127.0.0.1:8080`.

## Module capabilities and plugin support

These three blocks show `.Build.cs` dependencies, connection creation, event binding, and text messages. They are not SimpleWebSocket node declarations. The project must retain the native `IWebSocket` object until the connection ends. The local `TSharedPtr` does not show where to keep it, and the example does not cover complete connection-error handling, delegate unbinding, or reconnection.

The original technical record described the `ws://` limitation as a general limitation of UE's WebSockets module. That scope was too broad: this guide documents the limitation for SimpleWebSocket, which does not establish that every UE version and underlying backend lacks `wss://` support. For a custom native connection, check the engine version, backend, and certificate configuration.

`127.0.0.1` is the local loopback address, suitable for a service on the same machine. Use the actual destination address for a service on another host. Avoiding `localhost` is a troubleshooting recommendation here; it does not mean remote services should use loopback.

See the [SimpleTCPClient overview](/en/works/simple-tcp-client/) for other protocols and its native TCP client guide for shared architecture.

The native communication examples were published on [Cnblogs](https://www.cnblogs.com/mengzhishanghun/p/19165484) on 2025-10-25.
