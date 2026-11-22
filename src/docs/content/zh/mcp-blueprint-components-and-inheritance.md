---
title: 修改组件、继承与类默认值
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
  group: workflows
  slug: components-and-inheritance
  order: 3
documentKind: product-manual
websiteRoute: /zh/works/mcp-blueprint/docs/components-and-inheritance/
lang: zh
translationKey: doc:mcp-blueprint:components-and-inheritance
---

### 4. `SetComponentProperties`：改 SCS 模板，不改实例

先用 `GetComponents` 找到本地 SCS `ComponentName`。把 `Properties` 作为“属性名 → UE 文本值”映射，例如 `RelativeLocation: "(X=0,Y=0,Z=50)"`、`bHiddenInGame: "True"`。工具只改此 Blueprint 添加的组件模板；任一属性不合法，整次调用会回滚并给出属性名与格式提示。按需使用 `SaveAsset` 保存。

### 5. `SetClassDefaults`：改 CDO，可覆盖继承属性

使用 `GetClassDefaults` 找到可编辑且**大小写敏感**的反射属性名。传入 `Properties` 的 UE 文本映射，如 `bReplicates: "True"` 或 `JumpMaxCount: "2"`。它改的是该 Blueprint CDO，作用于以后放置/生成且未覆写的实例；不会追溯改变已存在实例。工具还能访问父 C++/父 Blueprint 的属性，这是 `ModifyVariable` 做不到的。按需使用 `SaveAsset` 保存。

### 6. `ReparentBlueprint` 与 `ReparentComponent`：两个“父级”完全不同

`ReparentBlueprint` 改的是类继承：传 `NewParentClassPath`（原生完整路径、唯一已加载短名或 Blueprint 生成类）。先使用 `bDryRun=true` 查看风险；新父类不是旧父类的子类、旧父类缺失或接口冲突时，必须明确 `bAllowPotentialDataLoss=true`。它会刷新图；若操作失败会尝试 Undo 回滚。

`ReparentComponent` 改的是同一 Actor Blueprint 内本地 **SceneComponent** 的附着树：传组件名与新的 `NewParentName`。不能把节点挂到自身或子孙节点下；非 SceneComponent 不可改；实际本地根组件必须用 `SetRootComponent`。

## 组件与类默认值

添加、重命名、复制、重设父级、设置根组件、修改模板属性或删除组件前，先读取当前组件层级。类默认值工具读取或修改支持的 Blueprint 默认值，不会把实例值冒充为类默认值。
