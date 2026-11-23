---
title: 编辑 Niagara 用户参数
type: doc
slug: mcp-niagara-parameters-preview
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-niagara
docPage:
  work: mcp-niagara
  group: features
  slug: parameters-preview
  order: 6
documentKind: product-manual
websiteRoute: /zh/works/mcp-niagara/docs/parameters-preview/
lang: zh
translationKey: doc:mcp-niagara:parameters-preview
---

## User Parameter 编辑

`AddUserParameter` 以撤销事务添加 float、int、bool、Vector、Vector2、Vector4 或 Color 值参数，并发送 System PostEditChange。`SetSystemParameters` 每次原子写入 1–64 个现有值参数：所有名称和值预校验并保存旧值后才提交；JSON 布尔值会按 Niagara 的 `FNiagaraBool` 表示写入。`RemoveUserParameter` 按唯一名称执行与 UE 5.8 External 相同的公开 exposed-parameter 删除语义。

先读取 System 的用户参数，按名称和类型确认目标。新建时用添加工具；已有值参数要改值时，使用设置工具。对象和 Data Interface 需要按类型处理资产或实例，不能安全地用文本导入，因此 `AddUserParameter`/`SetSystemParameters` 不声称支持它们。删除参数不会猜测如何重写图引用，调用者应另行更新引用。UE 5.2–5.8 没有共同导出的 User Parameter 重命名及引用传播 API，插件不依赖 Private 头来绕过这个限制，因此没有 RenameUserParameter 工具。
