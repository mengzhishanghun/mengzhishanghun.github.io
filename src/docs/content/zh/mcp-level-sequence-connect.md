---
title: 连接序列编辑工具
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
  group: setup
  slug: connect
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-level-sequence/docs/connect/
lang: zh
translationKey: doc:mcp-level-sequence:connect
---

MCP Level Sequence 是一个自包含的 Unreal Editor 插件，通过 MCP 兼容的 JSON-RPC 2.0 HTTP 服务，让 AI 客户端发现和编辑 Level Sequence。插件支持 Unreal Engine 5.2 及以上版本，不依赖其他用户插件或跨插件共享模块。

## 安装与连接

1. 将 `Plugins/MCPLevelSequence` 放入 UE 项目或引擎插件目录并启用插件。
2. 启动 Unreal Editor。服务默认自动监听 `http://127.0.0.1:8762/mcp`。
3. 如端口被占用，服务最多向后尝试 10 个端口；以编辑器工具栏和日志显示的实际地址为准。
4. 在 `Project Settings > Plugins > MCP Level Sequence` 中可配置端口、自动启动和请求超时。

服务支持 `initialize`、`ping`、`tools/list` 和 `tools/call`。HTTP 请求体最大为 1 MiB，超限返回 HTTP 413。请求必须使用 `jsonrpc: "2.0"`，`params` 与 `arguments` 必须是对象，并按工具 Schema 严格校验未知字段、必填字段、类型、数组元素和数值边界。

## 23 个工具

| 分组 | 工具 | 用途 |
|---|---|---|
| 序列 | `ListSequences`、`GetSequenceDetail`、`CreateSequence` | 发现、分页读取和创建序列 |
| 时间 | `SetPlaybackRange`、`SetSequenceRates` | 设置播放范围、显示帧率和 Tick Resolution |
| Binding | `ListBindings`、`AddBinding`、`RemoveBinding` | 分页列出、添加和级联删除对象绑定 |
| Track | `ListTrackTypes`、`AddTrack`、`RemoveTrack` | 查询、添加和级联删除轨道 |
| Section | `AddSection`、`RemoveSection`、`SetSectionRange` | 创建、删除和调整 Section 范围 |
| Key | `GetKeyframes`、`SetKeyframes`、`RemoveKeyframes` | 分页读取、写入和删除关键帧 |
| Camera | `AddCameraCut`、`SetCameraCut` | 创建和修改 Camera Cut |
| 生命周期 | `OpenAsset`、`SaveAsset`、`CloseAsset` | 打开、保存指定资产并核验关闭结果 |
| 预览 | `CaptureSequencerView` | 截取活动关卡编辑器视口并返回 PNG |

## 与 UE 5.8 官方实验 Toolset 的边界

UE 5.8 的实验性 Animation Assistant Toolset 是依赖 SequencerScripting 的广覆盖 Python 能力；本插件选择 UE 5.2+ 兼容、自包含的 C++ HTTP 边界。本轮已补齐可稳定跨版本实现的序列帧率设置、Skeletal Animation Track/Section 和 Audio 资产 Section。

以下差异为有意保留，而不是文档遗漏：

- Subsequence 创建/导航：需要循环依赖检查、层级所有权和跨序列时间语义设计，当前不提供写入工具。
- Spawnable 创建：对象模板所有权、Undo 与 spawner 路径跨版本变化较大，需独立运行时验证后再开放。
- Event payload：依赖 Director Blueprint endpoint/graph；当前只创建 Event Section，不承诺触发具体逻辑。
- 任意 Track/Class、Folder、Tag、选择状态和骨骼级高级操作：官方实验 Toolset 覆盖更广，本插件只公开已审查并能维持严格 Schema 的能力。

UE 5.2–5.8 的编译、编辑器运行、资产保存与关闭交互，以及完整 Undo 行为尚未完成验证。请先在目标引擎的项目副本中确认这些操作。

如有问题或反馈，请发送邮件至 [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com)。我看到后会处理。
