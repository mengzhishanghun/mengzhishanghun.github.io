---
title: 启用与连接开发工具
type: doc
slug: mcp-dev-tools-connect
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-dev-tools
docPage:
  work: mcp-dev-tools
  group: getting-started
  slug: connect
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-dev-tools/docs/connect/
lang: zh
translationKey: doc:mcp-dev-tools:connect
---

## 启用与配置

MCPDevTools 在 Unreal Editor 中通过 HTTP MCP 提供资产查询、编辑和只读开发诊断。在 MCP 客户端填入编辑器日志中的实际地址，连接后用 `tools/list` 确认当前实例提供哪些工具。

将 `Plugins/MCPDevTools` 放入项目的 `Plugins` 目录，在 `.uproject` 的 `Plugins` 数组启用 `MCPDevTools`。打开编辑器后，可在 **Project Settings → Plugins → MCPDevTools** 设置端口和自动启动。默认地址为 `http://127.0.0.1:8768/mcp`；端口被占用时会尝试后续端口，以编辑器日志中的实际地址为准。

## 预览写入与显式保存

1. 先调用相应的 `Get...` 工具读取当前完整值；不确定类型或字段时调用 `GetAssetTypeSchema`。创建操作先保持默认 `bDryRun=true`，确认路径、类或模式后，再设置 `bDryRun=false`。
2. 修改操作把读取结果中的完整旧值放入相应 `Expected...` 参数，并提交新值。先做默认 dry-run，再设置 `bDryRun=false`。冲突或字段无效时操作会拒绝；创建或修改后资产在内存中为 dirty。
3. 确认编辑结果后单独调用 `SaveAsset` 写入该资产包。工具不会自动签出、覆盖已有创建路径，或连带保存引用资产。

| 类型 | 工具 | 用途与主要参数 |
|---|---|---|
| 保存 | `SaveAsset` | 用 `AssetPath` 显式保存一个受支持的 `/Game` 独立资产包；不会连带保存引用资产或自动签出只读文件。 |

## 使用范围

本插件当前工具不提供 Automation/Build/Cook/Package 作业、任意命令或用户 C++ 源码编辑。
