---
title: 诊断 Unreal Editor 实例
type: doc
slug: mcp-dev-tools-inspect-editor
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-dev-tools
docPage:
  work: mcp-dev-tools
  group: diagnostics
  slug: inspect-editor
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-dev-tools/docs/inspect-editor/
lang: zh
translationKey: doc:mcp-dev-tools:inspect-editor
---

## 会话、插件与日志

| 类型 | 工具 | 用途与主要参数 |
|---|---|---|
| 开发上下文 | `GetDevContext` | 读取项目、实际引擎/插件版本、实例和会话标识、服务器运行状态、实际端口及监听观测。`IncludePaths` 默认为 false，显式设为 true 才返回当前项目文件和引擎目录的绝对路径。 |
| 工程插件 | `ListProjectPlugins` | 从已加载插件管理信息读取白名单字段；`Scope` 默认为 `enabled`，也可选 `discovered`；稳定排序分页。 |
| 插件日志 | `ReadDevLog` | 只读取模块注册完成后捕获的 `LogMCPDevTools` 日志；用 `Cursor`、`Limit`、可选 `VerbosityFilter` 分页。 |

三个诊断工具不会启动进程或测试作业、加载资产、保存包或更改配置。输入不接受额外字段。上下文缺失时返回具体不可用原因。

## 插件列表与日志分页

`ListProjectPlugins` 和 `ReadDevLog` 默认每页 100 项，上限 200，使用返回的 `NextCursor` 继续读取。日志页另按最坏 JSON 转义预留序列化预算，`TextContent` 最多 512 Ki TCHAR，因此实际条数可能低于 `Limit`，未返回的匹配日志保留到下一页。插件列表只返回名称、友好名称、版本号/版本名、启用状态、来源和类型；不返回任意 descriptor JSON 或插件路径。列表游标绑定快照、Scope 和 Limit，信息或查询条件变化后需不带 Cursor 重新查询。

## 插件日志保留与缺口

日志仅保存在当前进程内存中，最多 2,048 条、文本总量 2 MiB、单条最多 8,192 TCHAR。`VerbosityFilter` 可选 `Fatal`、`Error`、`Warning`、`Display`、`Log`、`Verbose`、`VeryVerbose`，省略或空数组表示不按级别筛选。输出包含 `CaptureStartUtc`、`CaptureSession`、`NextCursor`、覆盖缺口 `bGap` / `DroppedSinceCursor` 和截断标记 `bTruncated`。没有匹配日志时，游标仍推进到已检查位置。旧捕获会话的游标会拒绝；首次读取也可能已有覆盖缺口。模块关闭时停止接收并注销输出设备，不提供磁盘日志、注册前历史或崩溃阶段完整性保证。HTTP 查询本身产生的插件日志可出现在后续页。该类别的消息可能包含项目名或路径，日志不承诺完全没有私密信息。

## 监听地址观测

Windows 上的监听结果来自 `GetExtendedTcpTable` 对当前 PID 和 ActualPort 的 IPv4/IPv6 只读观测：`observed_loopback` 要求两族查询成功且全部匹配地址属于 IPv4 127/8 或 IPv6 ::1；通配地址为 `observed_non_loopback`。查询失败、归属歧义、无匹配或状态变化返回 `unknown`，停止服务返回 `not_running`。其他平台返回 `unsupported_platform` 原因。返回的 127.0.0.1 URL 本身不证明实际绑定；OS 观测只代表采样时刻，不是身份认证或持续安全保证。工具不改变监听、HTTP 设置、防火墙或权限。
