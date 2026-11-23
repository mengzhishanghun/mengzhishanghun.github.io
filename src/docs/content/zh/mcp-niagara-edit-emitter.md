---
title: 添加和修改 Niagara 发射器
type: doc
slug: mcp-niagara-edit-emitter
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
  slug: edit-emitter
  order: 4
documentKind: product-manual
websiteRoute: /zh/works/mcp-niagara/docs/edit-emitter/
lang: zh
translationKey: doc:mcp-niagara:edit-emitter
---

## 复制与修改 Emitter

先读取目标 System 的发射器列表，确认要编辑的是哪一个。添加时，用 `AddEmitter` 走 NiagaraEditor 的标准复制流程生成唯一名称、重建 Emitter 节点并同步 Overview Graph。`RemoveEmitter` 和 `RenameEmitter` 要求名称唯一；增删改名均支持撤销事务并发送 System 编辑通知。

`SetEmitterProperties` 原子写入 `FVersionedNiagaraEmitterData`，每次 1–64 项：全部属性和值预校验成功后才提交，并对每项发送版本感知的 PostEditChange。支持可编辑的标量、枚举、字符串、名称和安全结构体；顶层属性必须可编辑且不得为临时或弃用属性，结构体成员会递归拒绝对象引用、容器、委托、临时和弃用字段。`SetEmitterProperties` 与 `SetModuleParameters` 的动态对象 Schema 只接受字符串、数字或布尔值，并与运行时数量边界一致。字符串输入及动态属性名的 Schema 和运行时上限不超过 4096 字符，部分资产路径更严格；输入 JSON 还限制为 8 层、2048 个值。所有加载现有 System 的工具在成功时统一返回实际对象的规范 `SystemPath`；最终错误文本最多 4096 字符，可用名称候选也会限制数量与文本长度。

限制：UE 5.2 未导出 NiagaraEditor 私有的 merge-adapter cache 清理 API。`RemoveEmitter` 会销毁引用实例、移除并重连公开 System Graph、同步 Overview Graph 并发送编辑通知，但无法显式清该私有缓存；响应会返回 `Warnings`，在紧接着执行继承 Emitter merge 工作流前应刷新或重开 System。插件不会为此依赖引擎 Private 头或非导出符号。
