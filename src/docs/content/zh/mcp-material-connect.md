---
title: 连接材质编辑工具
type: doc
slug: mcp-material-connect
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-material
docPage:
  work: mcp-material
  group: getting-started
  slug: connect
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-material/docs/connect/
lang: zh
translationKey: doc:mcp-material:connect
---

## 端点与兼容版本

MCPMaterial 为 Unreal Editor 提供面向 AI 客户端的材质与材质实例 MCP 工具。插件支持 UE 5.2 及以上版本，默认端点为 `http://127.0.0.1:8763/mcp`；端口被占用时会在有限范围内递增。

## HTTP 限制与失败处理

默认 HTTP 请求体上限为 1 MiB，JSON-RPC 响应体上限为 8 MiB，可在 Project Settings 的 MCP Material 设置中调整。

服务端会按工具输入 Schema 递归拒绝未知字段、缺失必填字段、错误类型和值域；原始 `tools/call` 也不能绕过该校验。

工具结果超限时会保留真实成功/失败终态并省略过大的内容；成功写工具不得仅因结果被省略而盲目重试。

JSON-RPC 仅把缺少 `id` 字段的消息视为通知；显式 `id:null` 仍会收到带空 id 的响应。

GameThread 接手操作后，即使客户端收到超时错误，编辑器也可能继续执行。先读回目标资产，核对这次请求有没有生效，再决定是否重试。

## 反馈

反馈请发送至 [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com)。
