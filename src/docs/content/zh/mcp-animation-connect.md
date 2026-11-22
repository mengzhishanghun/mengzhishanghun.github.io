---
title: 连接动画编辑工具
type: doc
slug: mcp-animation-connect
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-animation
docPage:
  work: mcp-animation
  group: setup
  slug: connect
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-animation/docs/connect/
lang: zh
translationKey: doc:mcp-animation:connect
---

MCPAnimation 是一个自包含的 Unreal Editor 插件，通过 HTTP MCP 向 AI 客户端提供动画蓝图、状态机、Skeleton、AnimSequence、Montage、AnimNotify 与 BlendSpace 的发现、读取和编辑能力。插件支持 Unreal Engine 5.2 及以上版本，不依赖其他用户制作的插件。

## 连接方式

默认端点为 `http://127.0.0.1:8760/mcp`。若端口被占用，服务器会继续尝试后续端口；请以编辑器中显示的实际端点为准。服务器实现 `initialize`、`tools/list`、`tools/call` 和 `ping`。

## 输入校验与适用范围

输入使用严格 JSON Schema；未知字段会被拒绝，数组元素也会递归校验。

本插件是 Editor-only，不提供运行时或网络游戏复制能力。

工具不会执行 C++ 编译、Unreal 项目构建或插件打包。

## 与 UE 5.8 官方工具的区别

UE 5.8 的官方 `AnimationAssistantToolset` 侧重 Level Sequence、Control Rig、Sequencer 通道与曲线。MCPAnimation 处理动画资产，不提供这些 Sequencer 或 Control Rig 操作。

## 反馈

反馈请发送至 [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com)。
