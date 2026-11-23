---
title: 安装并连接 MCPUMG
type: doc
slug: mcp-umg-connect
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-umg
docPage:
  work: mcp-umg
  group: getting-started
  slug: connect
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-umg/docs/connect/
lang: zh
translationKey: doc:mcp-umg:connect
---

## 开发状态与要求

MCPUMG 是开发中的 Unreal Engine 编辑器插件。它通过 MCP（模型上下文协议）让 AI 客户端读取、创建和编辑 Widget 树、属性、插槽、动画和事件。UE 5.2–5.8 相关版本仍在开发，各版本的测试尚未全部完成，兼容性待确认。

- Unreal Engine 5.2+
- 仅限编辑器
- 可选：[MCPBlueprint](/zh/works/mcp-blueprint/docs/connect/)，用于 Blueprint 图表编辑（Widget 事件逻辑的高级图表操作会调用 MCPBlueprint 工具）

如有问题或反馈，请访问[统一联系页面](https://mzsh.me/contact/)，添加我的微信。

## 安装与更新

1. 关闭所有正在使用目标引擎版本的 Unreal Editor 实例。
2. 选择与引擎版本匹配的 MCPUMG 安装包，将其内容复制到该引擎安装目录下的 `Engine/Plugins/Marketplace/MCPUMG`。
3. 打开复制后的 `MCPUMG.uplugin`，保留 `"Installed": true`，并添加或设置 `"EnabledByDefault": true`；打包后处理可能会移除此字段。
4. 重启编辑器。除非在项目设置中关闭 `bAutoStart`，插件会自动启动。

更新 MCPUMG 时，请先关闭编辑器，再使用匹配版本的新安装包完整替换现有 `MCPUMG` 目录。不要混用不同引擎版本的文件。

## 配置

项目设置 > 插件 > MCPUMG：

| 设置 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| Port | int32 | 8765 | HTTP 端口（被占用时自动递增，最多重试 10 次） |
| bAutoStart | bool | true | 编辑器启动时自动启动服务器 |
| RequestTimeoutSeconds | int32 | 30 | 工具执行超时时间 |
| CompileTimeoutSeconds | int32 | 120 | 编译超时时间 |

## MCP 连接

先打开要操作的 Unreal 项目，再从编辑器工具栏确认实际 MCP URL。客户端连上后，先核对下面的会话信息，再尝试读取 Widget 树。

插件会在 Unreal Editor 内运行 HTTP 服务器，AI 客户端通过 MCP 协议连接。

**MCP URL**：`http://127.0.0.1:8765/mcp`

编辑器打开时服务器会自动启动（可通过 `bAutoStart` 配置）。如果 8765 端口被占用，插件会自动递增端口，工具栏将显示实际 URL。

### Claude Code

用户范围的配置存放在 `~/.claude.json`；项目范围的配置使用项目根目录的 `.mcp.json`。在所选范围添加下面的 HTTP 服务器条目，并将示例 URL 换成工具栏显示的实际地址：

```json
{
  "mcpServers": {
    "ue-umg": {
      "type": "http",
      "url": "http://127.0.0.1:8765/mcp"
    }
  }
}
```

### 其他 AI 客户端

Cursor、Windsurf、VS Code Copilot 等 MCP 客户端的配置方式各不相同。服务器 URL 保持一致，具体添加 MCP 服务器的方法请查阅所用 AI 工具的文档。

## 确认连接的是目标项目

`initialize` 返回 `_meta.mcpumgContext`：ProjectFile、ProjectName、EngineVersion、PluginVersion、ProcessId、ActualPort、SessionId。端口可因占用而变化，使用返回值确认实际项目。SessionId 绑定服务器对象生命周期，重建服务器对象后改变。

后续调用可以在 **params._meta** 中携带令牌；不要把它放入业务 arguments。

```json
{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"GetWidgetTree","arguments":{"BlueprintPath":"/Game/UI/WBP_Menu"},"_meta":{"MCPUMGExpectedSessionId":"从initialize读取"}}}
```

错误类型或过期令牌在工具执行前拒绝。省略令牌兼容旧客户端；这是防止误操作其他编辑器的检查，不是身份认证机制。

## 首次读取 Widget 树

连接后，确认客户端的 `tools/list` 返回 MCPUMG 工具。用 `ListWidgetBlueprints` 查找目标资产，再用 `GetWidgetTree` 读取结构。参见[编辑 Widget 树](/zh/works/mcp-umg/docs/layout/)。基础版有 71 个工具；主动启用 MVVM 增强模块后另增 6 个。

## 工具版本与保存排查

- 运行时能力以当前编辑器返回的 `tools/list` 为准。更新源码或安装包后，已经运行的编辑器不会自动换用新 DLL；工具数量不符时先核对部署目录并重启目标编辑器。
- `SaveWidgetBlueprint` 保存失败时检查项目日志的 `LogSavePackage`。Windows `Error 32` 通常表示同一项目仍有旧 `-game`、PIE 或第二编辑器进程占用资产；只关闭命令行明确指向该项目的遗留进程，再重试精确保存。
- Patch 已成功而保存失败时，不要改用 Save All、外部覆盖或重复 Patch。解除文件锁后直接重试 `SaveWidgetBlueprint`，避免重复执行已生效的内存修改。
