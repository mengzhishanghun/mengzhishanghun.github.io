---
title: 准备并首次查询 Niagara
type: doc
slug: mcp-niagara-quickstart
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-niagara
docPage:
  work: mcp-niagara
  group: getting-started
  slug: quickstart
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-niagara/docs/quickstart/
lang: zh
translationKey: doc:mcp-niagara:quickstart
---

## 使用前准备

本页从已安装并加载 MCPNiagara 的 Unreal Editor 会话开始。准备目标编辑器实际配置的 MCP 服务地址，并在所用 AI 客户端中添加该服务；客户端的配置方式以其官方说明为准。

插件仍在开发中，UE 5.2–5.8 的兼容性待确认。先在项目副本中使用，并确认客户端连接的是预期项目。

## 首次查询

可以向 AI 提出这样的需求：

> 使用我提供的 MCP 地址连接目标编辑器，先列出项目中的 Niagara System，再读取我指定的系统。先不要修改、创建或保存资产。

`ListNiagaraSystems` 用于查找 System，`GetSystemDetail` 用于读取系统详情。查看分页结果时，根据返回的 `HasMore` 和 `NextOffset` 继续读取。把查到的完整资产路径用于后续请求，不只凭显示名称选择资产。

具体分页参数与模块定位方式见[查找并检查 Niagara 资产](/zh/works/mcp-niagara/docs/inspect/)。

## 从查询进入编辑

确定目标后，再选择相应的[系统资产操作](/zh/works/mcp-niagara/docs/niagara-system-assets/)、[发射器编辑](/zh/works/mcp-niagara/docs/edit-emitter/)或[用户参数编辑](/zh/works/mcp-niagara/docs/parameters-preview/)。创建与修改后的资产需要按对应功能说明检查并显式保存。

缓存缩略图不会实时渲染，不能用来判断刚做的编辑是否已经出现在画面中。确认视觉结果时，应在目标编辑器中查看实际 Niagara 效果。
