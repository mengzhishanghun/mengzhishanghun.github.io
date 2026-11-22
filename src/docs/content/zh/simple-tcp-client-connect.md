---
title: 配置与管理 TCP 客户端连接
type: doc
slug: simple-tcp-client-connect
draft: false
sitePublish: true
tags:
  - TCP
workIds:
  - simple-tcp-client
docPage:
  work: simple-tcp-client
  group: network
  slug: connect
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-tcp-client/docs/connect/
lang: zh
translationKey: doc:simple-tcp-client:connect
---

## 在项目设置中预定义通道

可通过 **项目设置 → SimpleTCPClient Settings** 预定义客户端通道。  
建议在此处配置通道，便于集中管理。

### 通道参数

| 字段                 | 示例                | 说明                                |
|---------------------|---------------------|-------------------------------------|
| Channel Name         | `DefaultClient`     | 蓝图中引用通道的名称                  |
| Remote Address (IP:Port) | `127.0.0.1:8888` | 要连接的目标地址                     |
| Auto Connect         | `True`              | 是否在启动时自动连接                  |
| Auto Reconnect Interval | `1.0`（秒）       | 重连尝试间隔                         |
| Max Receive Bytes    | `1024`              | 每次接收的最大字节数                  |

## 在蓝图中管理通道

| 节点函数                    | 说明                                         |
|----------------------------|----------------------------------------------|
| `StartConnection`          | 手动启动连接（用于非自动连接的通道）            |
| `StopConnection`           | 停止并销毁 Socket                             |
| `IsConnected`              | 检查通道当前是否已连接                         |
| `UpdateTCPClientConfig`    | 创建或更新通道配置（自动重连）                  |
| `GetTCPClientConfig`       | 获取通道的当前配置                             |

## 连接限制与 Socket 生命周期

目标地址只支持 IPv4，不支持域名、IPv6 或加密。通道的 Socket 由插件管理。

| 类型          | 创建时机                           | 销毁时机                            |
|--------------|-----------------------------------|-------------------------------------|
| Client Socket| 调用 `StartConnection` 或自动连接时 | 调用 `StopConnection` 或关闭时       |

## 连接节点示例

![](/media-occurrence/doc%3Asimple-tcp-client%3Aconnect%3Amedia%3A1)

## 手动启动和停止连接

![](/media-occurrence/doc%3Asimple-tcp-client%3Aconnect%3Amedia%3A2)  
注：如果通道设置了自动连接且配置了重连间隔，则无需手动启动。

## 更新配置与自动重连

![](/media-occurrence/doc%3Asimple-tcp-client%3Aconnect%3Amedia%3A3)  
注：消息委托在 Socket 重连后仍然有效。更新顺序无关紧要——配置更新后，回调仍会被触发。

用多个通道区分不同端口和业务。插件异步处理通信，避免阻塞游戏主线程，也提供断线重连入口。连接恢复后，需要重发消息、重新登录或同步业务状态时，由通信双方在协议中约定。
