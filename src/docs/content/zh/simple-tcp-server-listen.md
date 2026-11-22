---
title: 启用插件并配置 TCP 监听
type: doc
slug: simple-tcp-server-listen
draft: false
sitePublish: true
tags:
  - TCP
workIds:
  - simple-tcp-server
docPage:
  work: simple-tcp-server
  group: setup
  slug: listen
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-tcp-server/docs/listen/
lang: zh
translationKey: doc:simple-tcp-server:listen
---

## 兼容性

- Unreal Engine 5.2–5.8
- 版本 1.1.0（Version 2）

## 界面语言

打开 **编辑 → 项目设置**，进入 SimpleTCPServer 设置页，将 **Language** 设置为 **English** 或 **中文**。默认语言为英文。面向用户的界面、提示、通知和功能日志会立即更新，无需重启编辑器；公开 API 名称以及模块启动/关闭日志始终保持英文。

## 启用插件

启用后插件自动激活。  
注册为 `GameInstanceSubsystem`，其生命周期跨越关卡切换。

## 在项目设置中定义监听通道

可通过 **项目设置 → SimpleTCPServer Settings** 定义服务器监听通道。  
建议用此方法集中管理和调试。

### 监听通道参数

| 字段名            | 示例              | 说明                                     |
|------------------|-------------------|------------------------------------------|
| Channel Name     | `MainServer`      | 蓝图中引用通道的名称                       |
| Bind Address (IP:Port) | `0.0.0.0:8888` | 监听 Socket 绑定的地址                  |
| Max Connections  | `32`              | 最大并发客户端连接数                       |
| Max Receive Bytes | `1024`           | 每条消息的最大缓冲区大小                   |

## 在蓝图中启停监听

| 节点函数                    | 说明                                               |
|----------------------------|----------------------------------------------------|
| `StartServer`              | 开始在服务器通道上监听                               |
| `StopServer`               | 停止监听并断开该通道上所有客户端                      |
| `IsServerRunning`          | 检查服务器通道是否正在运行                           |
| `UpdateTCPServerConfig`    | 更新通道配置（支持热重载）                           |
| `GetTCPServerConfig`       | 获取通道的当前配置                                  |

调用 `StartServer` 创建监听 Socket；调用 `StopServer` 销毁它，并断开该通道上的客户端。监听仅支持 IPv4；不支持域名、IPv6 和加密。
