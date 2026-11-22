---
title: 管理蓝图组件与附着层级
type: doc
slug: mcp-blueprint-components-and-inheritance
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-blueprint
docPage:
  work: mcp-blueprint
  group: class-structure
  slug: components-and-inheritance
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-blueprint/docs/components-and-inheritance/
lang: zh
translationKey: doc:mcp-blueprint:components-and-inheritance
---

## 读取与编辑本地组件树

| 工具 | 用途 | 注意事项 |
| --- | --- | --- |
| `GetComponents` | 查看 Actor Blueprint 的组件树、父级和模板信息。 | 仅适用于 Actor Blueprint。 |
| `AddComponent` | 添加本地 SCS 组件。 | 指定组件类、名称和可选父组件。 |
| `RenameComponent` | 重命名本地 SCS 组件并更新成员引用。 | 新名称必须唯一。 |
| `RemoveComponent` | 删除组件。 | 有引用或无法安全恢复时会被阻止。 |
| `DuplicateComponent` | 复制本地 SCS 组件及模板属性。 | 实际本地根组件不能复制。 |
| `ReparentComponent` | 修改本地 SceneComponent 的附着父级。 | 不能形成循环；根组件请用 `SetRootComponent`。 |
| `SetRootComponent` | 将本地 SceneComponent 设为根组件。 | 目标必须是本地 SceneComponent。 |
| `GetComponentProperties` | 分页查看可编辑的组件模板属性。 | 需要蓝图路径、组件名和分页参数。 |

## 修改 SCS 组件模板属性

先用 `GetComponents` 找到本地 SCS `ComponentName`。调用 `SetComponentProperties` 时，在 `Properties` 中提供“属性名 → UE 文本值”映射，例如 `RelativeLocation: "(X=0,Y=0,Z=50)"`、`bHiddenInGame: "True"`。工具只改此 Blueprint 添加的组件模板；任一属性不合法，整次调用会回滚并给出属性名与格式提示。按需使用 `SaveAsset` 保存。

此操作编辑本蓝图添加的 SCS 组件模板，例如 `StaticMesh` 或 `RelativeLocation`。已有场景 Actor 的组件覆盖值保留；生成类上的 Class Defaults 由 `SetClassDefaults` 修改。

## 调整附着关系

`ReparentComponent` 改的是同一 Actor Blueprint 内本地 **SceneComponent** 的附着树：传组件名与新的 `NewParentName`。不能把节点挂到自身或子孙节点下；非 SceneComponent 不可改；实际本地根组件必须用 `SetRootComponent`。
