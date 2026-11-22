---
title: 在蓝图中管理连接和收发消息
type: doc
slug: simple-websocket-connect-and-send
draft: false
sitePublish: true
tags:
  - WebSocket
workIds:
  - simple-websocket
docPage:
  work: simple-websocket
  group: network
  slug: connect-and-send
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-websocket/docs/connect-and-send/
lang: zh
translationKey: doc:simple-websocket:connect-and-send
---

这些静态函数属于 GameInstance，可从任意蓝图按配置名称调用。

## 连接、查询和关闭

- `Connect Web Socket`：按名称连接 WebSocket  
- `Close Web Socket`：关闭指定连接  
- `Close All Web Socket`：关闭所有连接  
- `Check Web Socket Connect`：检查连接是否已建立  
- `Get Web Socket Config`：获取指定连接的配置  

## 发送文本与绑定回调

- `Send WebSocket Message`：发送文本消息  
- `Bind Web Socket Message`：绑定蓝图事件接收消息（支持多个回调）  
- `Unbind Web Socket Message`：解绑消息事件  

## 蓝图示例

![](/media-occurrence/doc%3Asimple-websocket%3Aconnect-and-send%3Amedia%3A1)
