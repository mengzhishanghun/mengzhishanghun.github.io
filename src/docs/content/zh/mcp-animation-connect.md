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
  group: getting-started
  slug: connect
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-animation/docs/connect/
lang: zh
translationKey: doc:mcp-animation:connect
---

MCPAnimation 是一个自包含的 Unreal Editor 插件，通过 HTTP MCP 向 AI 客户端提供动画蓝图、状态机、Skeleton、AnimSequence、Montage、AnimNotify 与 BlendSpace 的发现、读取和编辑能力。插件不依赖其他用户制作的插件。当前开发覆盖 UE 5.2–5.8，兼容性仍待确认，请先在自己的目标版本中试用。

## 连接方式

在 Unreal Editor 中启用插件后，把编辑器显示的实际地址填入 MCP 客户端的 HTTP 配置。默认端点为 `http://127.0.0.1:8760/mcp`；端口被占用时，服务会尝试后续端口。连接后可用 `initialize` 建立会话，通过 `tools/list` 查看可用工具，再用 `tools/call` 调用；`ping` 可用于检查连接。

## 输入校验与适用范围

输入使用严格 JSON Schema；未知字段会被拒绝，数组元素也会递归校验。

本插件是 Editor-only，不提供运行时或网络游戏复制能力。

工具不会执行 C++ 编译、Unreal 项目构建或插件打包。

## 与 UE 5.8 官方工具的区别

UE 5.8 的官方 `AnimationAssistantToolset` 侧重 Level Sequence、Control Rig、Sequencer 通道与曲线。MCPAnimation 处理动画资产，不提供这些 Sequencer 或 Control Rig 操作。

## 反馈

反馈请发送至 [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com)。
