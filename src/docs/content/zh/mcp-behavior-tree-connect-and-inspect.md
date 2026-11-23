---
title: 连接行为树编辑工具
type: doc
slug: mcp-behavior-tree-connect-and-inspect
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-behavior-tree
docPage:
  work: mcp-behavior-tree
  group: getting-started
  slug: connect-and-inspect
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-behavior-tree/docs/connect-and-inspect/
lang: zh
translationKey: doc:mcp-behavior-tree:connect-and-inspect
---

MCP Behavior Tree 是一个自包含的 Unreal Editor 插件，可通过 Model Context Protocol 创建、查看、编辑、验证并保存行为树与黑板资产。插件不依赖其他用户插件，UE 5.2–5.8 仍在开发与兼容性验证。

## 连接

在 Unreal Editor 中启用插件，等 MCP HTTP 服务启动后，把插件报告的实际地址填入客户端。默认端口为 `8767`；端口被占用时，以插件报告为准。

## 第一次编辑行为树

1. 使用 `CreateBlackboard` 创建黑板。
2. 使用 `AddBlackboardKey` 添加键。
3. 使用 `CreateBehaviorTree` 创建行为树并传入黑板路径。
4. 先在 `Root` 下添加 Composite，再添加任务、装饰器和服务。
5. 使用 `GetBehaviorTreeDetail` 获取节点 ID 和可编辑属性。
6. 运行 `ValidateBehaviorTree`，处理报告的问题。
7. 对每个改过的行为树或黑板分别调用 `SaveAsset`。

## 与 UE 5.8 官方工具集的区别

Unreal Engine 5.8 的 Epic `AIModuleToolset` 提供 7 个只读行为树辅助能力：获取黑板、根级装饰器、节点列表、单个/全部节点深度、子节点和引用的子树。MCP Behavior Tree 通过 `GetBehaviorTreeDetail` 覆盖黑板、装饰器、层级、子节点和深度语义，并额外提供创建与编辑能力。

Epic 工具集属于 Experimental，并绑定 UE 5.8 的 Toolset/MCP 基础设施。为了保持 UE 5.2+ 兼容和插件自包含，本插件不能依赖它。若某项官方专属行为未被本文档列出的插件工具覆盖，应在 UE 5.8 中调用 Epic 工具集，而不能假定早期引擎也具备该能力。

## 使用范围与版本

- 插件仅用于编辑器，不控制运行时或打包后的游戏。
- Behavior Tree 编辑器的私有图 API 会随引擎版本变化。插件包含 UE 5.2+ 兼容路径，但仍应在目标引擎版本中验证资产。
- 源码发生变化不代表既有插件包已经重新打包或发布。

## 反馈

反馈请发送至 [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com)。
