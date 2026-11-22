---
title: 修改蓝图成员、函数与类型
type: doc
slug: mcp-blueprint-members-and-types
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-blueprint
docPage:
  work: mcp-blueprint
  group: workflows
  slug: members-and-types
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/mcp-blueprint/docs/members-and-types/
lang: zh
translationKey: doc:mcp-blueprint:members-and-types
---

### 1. `ModifyVariable`：声明默认值，不是节点值

先用 `GetBlueprintOverview` 找到本蓝图声明的目标变量。只传入需要变化的字段：`TypeName`、`DefaultValue`、`NewName`、`bInstanceEditable`、`Category` 或 `Tooltip`。`DefaultValue` 使用 UE 文本格式；空 `Category` 恢复 UE 默认分类，空 `Tooltip` 删除提示。变量被引用时不能改类型；带 RepNotify 的变量不能通过此工具非交互改名。需要保留改动时再使用 `SaveAsset`。

### 2. `ModifyFunctionSignature`：函数参数不是普通节点 Pin

使用 `GetGraphDetail` 找到函数图及 Entry/Result 的所需标识；不要用显示名称代替这些标识。选择一个操作：`AddInput`、`AddOutput`、`RenamePin`、`RemovePin` 或 `ChangePinType`。默认 `bDryRun=true`；更新引用时必须设置 `bApproveReferenceUpdates=true`。删除参数或改参数类型还须设置 `bAllowPotentialDataLoss=true`。工具会处理可安全更新的调用点，失败时尝试回滚；不会自动保存。

## 成员、函数、Struct 与 Enum

- 变量工具管理类型、默认值、Category、Tooltip 和安全删除。
- 函数工具创建、重命名、执行受支持的签名修改，或安全删除用户函数。
- 局部变量操作需要函数图和变量声明标识。
- Struct/Enum 修改使用字段或条目标识，并会报告引用影响。
- 可能丢失数据或改变 Enum 序列化值语义的操作需要独立显式批准。

函数重命名和签名修改会先分析影响。遇到无法安全处理的 Override、Delegate 绑定、派生类或引用时，工具会拒绝操作，不会勉强修改。

### 函数重命名示例

下面两张图展示函数改名后的定义与调用点。改名前先使用 dry-run；工具要求更新引用时，必须显式批准。需要保留改动时使用 `SaveAsset`。

![RenameFunction 后的函数定义](/media-occurrence/doc%3Amcp-blueprint%3Amembers-and-types%3Amedia%3A1)

![RenameFunction 后的调用者](/media-occurrence/doc%3Amcp-blueprint%3Amembers-and-types%3Amedia%3A2)

### 函数、事件与绑定事件示例

以下示例展示带输入输出参数的函数、组件事件辅助函数图，以及 Actor 生命周期、组件绑定事件和可变 Pin 的常见结构。

![包含丰富输入输出参数的函数签名与实现](/media-occurrence/doc%3Amcp-blueprint%3Amembers-and-types%3Amedia%3A3)

![组件事件辅助函数图](/media-occurrence/doc%3Amcp-blueprint%3Amembers-and-types%3Amedia%3A4)

![Actor 生命周期、组件绑定事件与可变 Pin 流程](/media-occurrence/doc%3Amcp-blueprint%3Amembers-and-types%3Amedia%3A5)
