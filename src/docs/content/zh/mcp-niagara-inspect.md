---
title: 查找并检查 Niagara 资产
type: doc
slug: mcp-niagara-inspect
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-niagara
docPage:
  work: mcp-niagara
  group: systems
  slug: inspect
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-niagara/docs/inspect/
lang: zh
translationKey: doc:mcp-niagara:inspect
---

MCP Niagara 在 Unreal Editor 中提供面向 Niagara System、Emitter、模块栈、参数、Renderer、编译状态和资产生命周期的 MCP 工具。

## 资产发现与分页

`ListNiagaraSystems`、`ListNiagaraEmitters` 和 `SearchModules` 都支持稳定分页：

- `MaxResults` 必须为 1–500，默认 100。
- `Offset` 必须为非负整数，默认 0。
- 返回 `TotalCount`、`Returned`、`Offset` 和 `HasMore`；存在下一页时还会返回 `NextOffset`。
- 结果按完整资产对象路径稳定排序，因此连续分页不会依赖 Asset Registry 的枚举顺序。

`SearchModules` 只返回 Niagara 编辑器认可的可见 Module 库资产；弃用、隐藏和非库脚本不会出现在结果中，也不会为了搜索而逐个加载脚本资产。

`GetSystemDetail` 对 Emitter 和 User Parameter 分别分页：`MaxEmitters` 为 1–128，`MaxUserParameters` 为 1–256，两类 Offset 均须非负。每个 Emitter 最多返回 64 个 Renderer 和 64 个 Simulation Stage，并在截断时返回总数和标记。User Parameter 按名称/类型稳定排序，值文本最多 4096 字符；对象与 Data Interface 返回对象路径。所有工具的根输入 Schema 默认拒绝未声明字段，具有枚举、分页或动态对象的工具会进一步声明相应边界。

## 模块详情

`GetModuleDetail` 只检查所选 Spawn、Update 或 Event 阶段参数映射主链上的模块，`ModuleIndex` 与实际执行顺序一致。重名模块必须使用索引；同时传入名称与索引时，两者必须指向同一模块。`GetModuleDetail`、`AddModule`、`RemoveModule` 和 `ReorderModule` 在存在多个 Event 阶段时都必须提供 `UsageId`；成功响应会返回实际选中的输出 GUID。

模块输入按 `MaxResults`（1–256，默认 100）和 `Offset` 分页，并返回真实 Niagara 类型及 `ValueSource`。图覆盖、链接/动态覆盖和 Rapid Iteration 值会被明确区分；`Value` 最多返回 4096 字符，并由 `bValueTruncated` 明示是否截断。未形成覆盖的输入统一标记为 `ModuleDefaultOrBinding`；为了保持 UE 5.2+ 自包含兼容，工具不依赖仅供 NiagaraEditor 内部使用的默认值拓扑 API，因此不会进一步猜测模块默认值与内部绑定。

## 版本与使用限制

插件提供 UE 5.2 及以上版本的兼容路径。目标引擎中的资产编辑、保存、重新打开和打包行为尚未完成验证，请先在项目副本中确认。

## 反馈

反馈请发送至 [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com)。
