---
title: 安装与连接序列编辑工具
type: doc
slug: mcp-level-sequence-connect
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-level-sequence
docPage:
  work: mcp-level-sequence
  group: getting-started
  slug: connect
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-level-sequence/docs/connect/
lang: zh
translationKey: doc:mcp-level-sequence:connect
---

MCP Level Sequence 是一个自包含的 Unreal Editor 插件，通过 MCP 兼容的 JSON-RPC 2.0 HTTP 服务，让 AI 客户端发现和编辑 Level Sequence。插件不依赖其他用户插件或跨插件共享模块。UE 5.2–5.8 的兼容性仍在验证。

## 安装与连接

1. 将 `Plugins/MCPLevelSequence` 放入 UE 项目或引擎插件目录并启用插件。
2. 启动 Unreal Editor。服务默认自动监听 `http://127.0.0.1:8762/mcp`。
3. 如端口被占用，服务最多向后尝试 10 个端口；将编辑器工具栏和日志显示的实际地址填入客户端。
4. 在 `Project Settings > Plugins > MCP Level Sequence` 中可配置端口、自动启动和请求超时。

## HTTP 请求

服务支持 `initialize`、`ping`、`tools/list` 和 `tools/call`。HTTP 请求体最大为 1 MiB，超限返回 HTTP 413。请求必须使用 `jsonrpc: "2.0"`，`params` 与 `arguments` 必须是对象，并按工具 Schema 严格校验未知字段、必填字段、类型、数组元素和数值边界。

## 快速上手

先用 `ListSequences` 找到序列，再用 `GetSequenceDetail` 定位要改的绑定、轨道或区段。使用详情给出的 ID 或名称修改；填入帧数前先核对序列的时间单位。改动不会自动保存，确认后再调用 `SaveAsset`。

## 与 UE 5.8 实验工具集的区别

UE 5.8 的实验性 Animation Assistant Toolset 依赖 SequencerScripting，提供更广的 Python 功能。MCP Level Sequence 是面向 UE 5.2+ 开发的自包含 C++ HTTP 插件，支持设置序列帧率、添加骨骼动画轨道和区段，以及引用 Audio 资产的区段。

UE 5.2–5.8 的编译、编辑器运行、资产保存与关闭交互，以及完整 Undo 行为尚未完成验证。请先在目标引擎的项目副本中确认这些操作。

## 反馈

反馈请发送至 [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com)。
