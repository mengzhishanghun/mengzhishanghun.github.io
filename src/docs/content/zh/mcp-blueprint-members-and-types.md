---
title: 创建与修改蓝图函数
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
  group: features
  slug: members-and-types
  order: 5
documentKind: product-manual
websiteRoute: /zh/works/mcp-blueprint/docs/members-and-types/
lang: zh
translationKey: doc:mcp-blueprint:members-and-types
---

## 创建、重命名或删除函数

| 工具 | 用途 | 注意事项 |
| --- | --- | --- |
| `ListBlueprintMembers` | 分页查看函数、事件、分发器和局部变量。 | 大型蓝图请使用分页。 |
| `CreateFunction` | 创建蓝图函数及其参数。 | 需要蓝图路径、函数名和参数定义。 |
| `RenameFunction` | 重命名用户函数，并更新可安全更新的引用。 | 先使用 dry-run；更新引用必须显式批准。 |
| `RemoveFunction` | 删除用户函数。 | 有引用或无法安全恢复时会被阻止。 |

处理已有函数时，先用 `ListBlueprintMembers` 找到它。重命名或改签名前，先查看工具报告的影响范围。遇到无法安全处理的 Override、Delegate 绑定、派生类或引用时，工具会在改动前拒绝请求。

## 修改函数签名

运行 `ModifyFunctionSignature` 前，用 `GetGraphDetail` 查找函数图和 Entry/Result 标识。用这些标识定位，不要传显示名称。选择一项操作：`AddInput`、`AddOutput`、`RenamePin`、`RemovePin` 或 `ChangePinType`。默认 `bDryRun=true`；更新引用时必须设置 `bApproveReferenceUpdates=true`。删除参数或改参数类型还须设置 `bAllowPotentialDataLoss=true`。工具会处理可安全更新的调用点，失败时尝试回滚；不会自动保存。

函数 Entry/Result 上的参数属于签名。图中，紫色框左端是函数入口，右端是返回节点。要修改普通节点的输入 Pin 字面量，请用 `SetPinDefaults`。

![包含丰富输入输出参数的函数签名与实现](/media-occurrence/doc%3Amcp-blueprint%3Amembers-and-types%3Amedia%3A1)

## 示例：重命名后的函数与调用点

改名后，可以在定义蓝图的函数列表中看到新名称，在调用方图中也能看到使用新名称的调用节点。改名前先使用 dry-run；工具要求更新引用时，必须显式批准。需要保留改动时使用 `SaveAsset`。

![RenameFunction 后的函数定义](/media-occurrence/doc%3Amcp-blueprint%3Amembers-and-types%3Amedia%3A2)

![RenameFunction 后的调用者](/media-occurrence/doc%3Amcp-blueprint%3Amembers-and-types%3Amedia%3A3)

MCPBlueprint 暂无通用工具来调用任意 Blueprint 函数并返回运行结果。
