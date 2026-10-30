---
title: SimpleWebSocket 使用文档
description: SimpleWebSocket 的完整中文产品使用文档
type: doc
slug: simple-websocket-guide
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
draft: false
sitePublish: true
tags:
  - WebSocket
workIds:
  - simple-websocket
documentKind: product-manual
websiteRoute: /docs/zh/guides/ue-tools/simple-websocket-guide/
lang: zh
translationKey: simple-websocket-guide
---

# 📘 SimpleWebSocket 用户指南

本指南介绍如何配置和使用 SimpleWebSocket 插件在 Unreal Engine 项目中实现 WebSocket 通信。

## 兼容性

- Unreal Engine 5.2–5.8
- 版本 1.1.0（Version 2）

---

## 🛠️ 插件设置

启用插件后，前往项目设置面板的 `Simple WebSocket Settings`。

### 步骤：

1. 打开 Unreal Engine 编辑器  
2. 前往 `编辑 > 项目设置`  
3. 向下滚动找到 `Simple WebSocket Settings`  
4. 添加新的 WebSocket 连接条目（如命名为 `Test`）  
5. 输入 WebSocket 地址（推荐格式：`ws://127.0.0.1:xxxx`，**不要使用 localhost**）  
6. 启用 **Auto Connect**（可选；启用后运行时自动建立连接）

📷 示例截图：

![](/media-occurrence/doc%3Asimple-websocket-guide%3Amedia%3A1)

---

## 🎮 蓝图使用示例

可使用 GameInstance 级别的蓝图函数来连接、发送、接收和关闭 WebSocket 连接。所有函数都是静态的，可从任何蓝图调用。

### 可用节点：

- `Connect Web Socket`：按名称连接 WebSocket  
- `Send WebSocket Message`：发送文本消息  
- `Bind Web Socket Message`：绑定蓝图事件接收消息（支持多个回调）  
- `Close Web Socket`：关闭指定连接  
- `Close All Web Socket`：关闭所有连接  
- `Check Web Socket Connect`：检查连接是否已建立  
- `Get Web Socket Config`：获取指定连接的配置  
- `Unbind Web Socket Message`：解绑消息事件  

📷 蓝图示例：

![](/media-occurrence/doc%3Asimple-websocket-guide%3Amedia%3A2)

---

## ✅ 注意事项

- 插件仅支持 `ws://` 协议。不支持安全连接 `wss://`。
- 已在**打包构建**中完全测试——在生产环境中正常工作。
- WebSocket URL 中避免使用 `localhost`。始终使用 `127.0.0.1` 以防止连接问题。
- 每个连接名称可以绑定多个回调，支持模块化事件处理。

---

## UE WebSockets 模块的原生示例

### 3.1 适用场景

-   Web前端控制面板
-   云服务实时推送
-   与浏览器/移动端通讯
-   需要跨语言、跨平台的统一协议

### 3.2 UE内置WebSocket模块

UE提供了`WebSockets`模块,需要在`.Build.cs`中添加:

```csharp
PublicDependencyModuleNames.AddRange(new string[] {
    "Core",
    "WebSockets",
    "Http"
});
```

### 3.3 基础实现

**连接WebSocket:**

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

**发送消息:**

```cpp
void SendWebSocketMessage(TSharedPtr<IWebSocket> WebSocket, const FString& Message)
{
    if (WebSocket.IsValid() && WebSocket->IsConnected())
    {
        WebSocket->Send(Message);
    }
}
```

**注意事项:**

-   打包后使用`127.0.0.1`而非`localhost`(避免域名解析问题)
-   本教程中的 SimpleWebSocket 插件仅支持 `ws://`；原生 UE WebSockets 模块的 `wss://` 能力需按所用引擎、后端与证书配置核对。
-   连接URL格式: `ws://127.0.0.1:8080`

* * *

### 区分模块能力与插件支持范围

这三段代码演示 `.Build.cs` 模块依赖、创建连接、绑定事件和发送文本，不是 SimpleWebSocket 的节点声明。原生 `IWebSocket` 对象需要由项目持有到连接结束；示例里的局部 `TSharedPtr` 没有展示这个持有位置，也没有包含连接错误、解绑和重连的完整处理。

上面的原技术记录把 `ws://` 限制写成了 UE WebSockets 模块的一般结论，这个范围过大：当前 SimpleWebSocket 教程明确只支持 `ws://`，不能据此推断所有 UE 版本和底层后端都不支持 `wss://`。自定义原生连接时，应核对所用引擎、后端与证书配置。

`127.0.0.1` 指本机回环地址，适合连接本机服务；部署到其他主机时应填实际目标地址。避免 `localhost` 是这里的连接排查建议，不表示远程服务都应使用回环地址。

其他协议与共享架构说明见 [TCP 客户端与网络通信导览](/zh/docs/guides/ue-tools/simple-tcp-client-guide/)。

原生通信示例于 2025-10-25 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/19165484)。

## 版本历史



打开 **编辑 → 项目设置**，进入 SimpleWebSocket 设置页，将 **Language** 设置为 **English** 或 **中文**。默认语言为英文。面向用户的界面、提示、通知和功能日志会立即更新，无需重启编辑器；公开 API 名称以及模块启动/关闭日志始终保持英文。

## 支持

如有使用问题或合作需求，请前往联系页面。

- **联系入口：** [联系与合作](https://mzsh.me/contact/)
