---
title: 管理客户端会话
type: doc
slug: simple-tcp-server-sessions
draft: false
sitePublish: true
tags:
  - TCP
workIds:
  - simple-tcp-server
docPage:
  work: simple-tcp-server
  group: features
  slug: sessions
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-tcp-server/docs/sessions/
lang: zh
translationKey: doc:simple-tcp-server:sessions
---

接受连接后，插件为每个客户端分配唯一的 `SessionChannel`，格式为 `"IP:Port"`。

## 订阅客户端连接和断开事件

| 节点函数                     | 说明                                      |
|-----------------------------|-------------------------------------------|
| `BindConnectHandle`         | 绑定客户端连接/断开委托                     |
| `UnbindConnectHandle`       | 解绑指定连接委托                           |
| `UnbindAllConnectHandle`    | 解绑所有连接委托                           |

## 列出会话并检查连接状态

监听启动后，先确认客户端确实连到了正确的通道，再用 `GetAllSessions` 查看当前会话。向某个客户端发消息前，用 `IsSessionConnected` 核对选中的会话；客户端重连时，重新读取会话列表。

| 节点函数                    | 说明                                               |
|----------------------------|----------------------------------------------------|
| `GetAllSessions`           | 获取监听通道上所有当前 SessionChannel                |
| `IsSessionConnected`       | 检查 Session 是否仍然连接                           |

## 会话 Socket 的创建和销毁

插件接受连接时创建会话 Socket。客户端断开或 Socket 被销毁后，会话结束。Socket 由插件清理。

## 蓝图节点一览

![](/media-occurrence/doc%3Asimple-tcp-server%3Asessions%3Amedia%3A1)
