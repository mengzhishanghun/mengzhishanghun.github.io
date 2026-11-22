---
title: 安装并连接 MCPBlueprint
type: doc
slug: mcp-blueprint-connect
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-blueprint
docPage:
  work: mcp-blueprint
  group: getting-started
  slug: connect
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-blueprint/docs/connect/
lang: zh
translationKey: doc:mcp-blueprint:connect
---

## 要求与安装

- Unreal Engine 5.2+ Editor，支持 Windows、macOS 和 Linux。
- 支持本机 HTTP 服务的 MCP 客户端。
- 插件包必须与 Unreal Engine 的小版本完全一致。

每个引擎只安装一次 MCPBlueprint：

```text
<UE_5.x>/Engine/Plugins/Marketplace/MCPBlueprint/
```

MCPBlueprint 是跟随引擎安装的可选编辑器工具。`.uplugin` 使用 `Installed=true` 和 `EnabledByDefault=true`。不要把它重复复制进每个项目，也不要向用户项目的 `.uproject` 添加 MCPBlueprint。替换引擎中的插件包后，应重启对应版本的编辑器。

## 连接 AI 客户端

MCPBlueprint 会自动启用；开启 Auto Start 后，本机 MCP 服务会随编辑器启动。用户不需要在每个项目中手动启用插件，也不需要向项目 `.uproject` 添加插件声明。

让你使用的 AI 客户端按照自身的 MCP 配置流程接入 MCPBlueprint，并把插件工具栏显示的端点交给它即可。默认端点为 `http://127.0.0.1:8766/mcp`；配置端口被占用时，MCPBlueprint 最多尝试后续九个端口。不同 AI 客户端的配置格式不同，因此本文不规定某个客户端专用的 JSON 文件或手动端口配置步骤。

`initialize` 和 `tools/list` 通常由 MCP 客户端自动完成；`ping` 只用于排障，不是普通用户每次都要手动执行的步骤。

服务器只绑定本机。浏览器风格的 `Origin` 只允许 `localhost`、`127.0.0.1` 和 `[::1]`；普通非浏览器 MCP 客户端可以省略 `Origin`。

## 设置

打开 **项目设置 → 插件 → MCP Blueprint**：

- **Port** — 默认 `8766`；被占用时最多尝试后续九个端口。
- **Auto Start** — 随编辑器启动服务器。
- **Auto Compile After Modify** — 支持的写操作完成后自动编译。
- **Request Timeout Seconds** — 普通工具超时。
- **Compile Timeout Seconds** — 编译类工具独立超时。

## 首次读取和修改蓝图

连接后，用 `ListBlueprints` 找到资产，再把确切的 `BlueprintPath` 交给 `GetBlueprintOverview`。如果要修改逻辑，先确认要编辑的图，再按[图表编辑流程](/zh/works/mcp-blueprint/docs/graphs/)预检操作。普通工具只标记资产有改动；需要保留时明确调用 `SaveAsset`。

## 按编辑对象选择工具

- 要改声明默认值，查看[蓝图变量](/zh/works/mcp-blueprint/docs/variables/)；要改节点输入 Pin 的字面量，查看[图表编辑](/zh/works/mcp-blueprint/docs/graphs/)；要改 Entry/Result 参数，查看[函数签名](/zh/works/mcp-blueprint/docs/members-and-types/)。
- 要改 Actor 蓝图的组件模板或附着树，查看[蓝图组件](/zh/works/mcp-blueprint/docs/components-and-inheritance/)；要改生成类的默认属性，查看[类默认值](/zh/works/mcp-blueprint/docs/class-defaults/)；要改 Blueprint 父类，查看[类继承](/zh/works/mcp-blueprint/docs/class-inheritance/)。

## 排查连接和插件加载

- **无法连接：** 使用工具栏显示的实际端点，配置端口可能已被占用。
- **找不到工具：** 刷新 `tools/list`，不要依赖旧缓存。
- **插件提示重建：** 安装与引擎小版本完全匹配的包。
- **项目中找不到插件：** 核对插件是否安装在该引擎的 `Engine/Plugins/Marketplace`；不要用添加项目依赖的方式绕过。
- **UE 5.5 提示项目文件过期，原因是已安装的 MCPBlueprint 不在项目描述符中：** 选择 **Not Now（暂不）**。引擎插件仍会自动加载；选择 **Update（更新）** 会把 MCPBlueprint 写入项目 `.uproject`，形成当前安装模式明确要避免的项目侧依赖。

- 支持 Windows、macOS 和 Linux Editor；不提供 Runtime/Shipping 模块。
