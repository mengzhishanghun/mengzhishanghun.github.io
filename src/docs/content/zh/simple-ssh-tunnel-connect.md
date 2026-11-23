---
title: 配置 SSH 连接
type: doc
slug: simple-ssh-tunnel-connect
draft: false
sitePublish: true
tags:
  - SSH
workIds:
  - simple-ssh-tunnel
docPage:
  work: simple-ssh-tunnel
  group: getting-started
  slug: connect
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-ssh-tunnel/docs/connect/
lang: zh
translationKey: doc:simple-ssh-tunnel:connect
---

## SSH 隧道与远程服务

UE 应用有时需要访问远程数据库、API 或内网服务，直接把服务暴露到公网会增加风险。SSH 隧道用 SSH 通道把本地端口的连接转发到远程服务，供项目在本机访问；是否安全仍取决于服务器身份核验、认证、监听范围和凭据管理，不能只因使用 SSH 就保证安全。

在项目设置中填写连接参数，再在蓝图中管理隧道。[C++ 实现示例](/zh/works/simple-ssh-tunnel/docs/cpp-tunnels/)适合需要了解集成细节或自定义连接行为的读者；使用插件无需编写这些代码。

## 兼容性

- Unreal Engine 5.2–5.8
- 版本 1.1.0（Version 2）

## 连接参数

先区分三组地址：本地参数决定 UE 应用连接哪个监听地址和端口；远程参数指向要访问的服务；SSH 参数用于登录建立隧道的服务器。创建隧道后，应让应用连接本地端点，再验证目标服务能否访问。

1. 在 Unreal Engine 编辑器中打开 **项目设置**。
2. 在左侧面板导航至 **Engine → Simple SSH Tunnel**。
3. 配置以下参数：

   - **Local Address**
   - **Local Port**
   - **Remote Server Address**
   - **Remote Port**
   - **SSH Server Address**
   - **SSH Port**（默认：22）
   - **SSH Username**
   - **SSH Password**

如需替换默认子系统，可设置 **Subsystem Class**。

设置都保存在 `DefaultSimpleSSHTunnel.ini` 中，引擎启动时会自动应用。

![SimpleSSHTunnel 连接预设](/media-occurrence/doc%3Asimple-ssh-tunnel%3Aconnect%3Amedia%3A1)

本地端点、远程端点和 SSH 登录信息分别填写。图中使用演示参数，实际使用时替换为自己的配置。

## 界面语言

打开 **编辑 → 项目设置**，进入 SimpleSSHTunnel 设置页，将 **Language** 设置为 **English** 或 **中文**。默认语言为英文。面向用户的界面、提示、通知和功能日志会立即更新，无需重启编辑器；公开 API 名称以及模块启动/关闭日志始终保持英文。

[在蓝图中管理 SSH 隧道](/zh/works/simple-ssh-tunnel/docs/manage-tunnels/)
