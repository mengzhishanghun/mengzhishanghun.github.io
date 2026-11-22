---
title: 安装并连接蓝图编辑工具
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
  group: setup
  slug: connect
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-blueprint/docs/connect/
lang: zh
translationKey: doc:mcp-blueprint:connect
---

MCPBlueprint 通过 MCP 向 AI 客户端提供蓝图发现、图表编辑、成员、组件、资产生命周期、编译反馈和图表截图能力。本文对应 Fab 已发布版本的 55 个工具。当前编辑器会话中可用的工具名和参数以 `tools/list` 返回结果为准。

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

## 功能概览

当前版本注册 55 个工具：

| 能力 | 数量 | 工具 |
|---|---:|---|
| 发现与读取 | 6 | `ListBlueprints`、`GetBlueprintOverview`、`ListBlueprintMembers`、`GetGraphDetail`、`SearchGraphNodes`、`GetCompileErrors` |
| User Defined Struct 与 Enum | 6 | `CreateUserDefinedStruct`、`GetUserDefinedStruct`、`ModifyUserDefinedStruct`、`CreateUserDefinedEnum`、`GetUserDefinedEnum`、`ModifyUserDefinedEnum` |
| 变量、函数、事件与 Pin | 17 | `AddVariable`、`ModifyVariable`、`RemoveVariable`、`CreateFunction`、`RenameFunction`、`ModifyFunctionSignature`、`RemoveFunction`、`CreateCustomEvent`、`AddEventNode`、`AddBoundEvent`、`AddLocalVariable`、`RemoveLocalVariable`、`AddNodePin`、`RemoveNodePin`、`AddInterface`、`AddEventDispatcher`、`RemoveEventDispatcher` |
| 图表编辑与布局 | 4 | `ApplyGraphPatch`、`SetPinDefaults`、`FormatGraph`、`AddCommentBox` |
| 组件与默认值 | 11 | `GetComponents`、`AddComponent`、`SetComponentProperties`、`RenameComponent`、`RemoveComponent`、`ReparentComponent`、`SetRootComponent`、`DuplicateComponent`、`GetComponentProperties`、`GetClassDefaults`、`SetClassDefaults` |
| 资产生命周期与截图 | 11 | `CreateBlueprint`、`ReparentBlueprint`、`CompileBlueprint`、`SaveAsset`、`OpenAsset`、`CloseAsset`、`ReloadBlueprintFromDisk`、`DeleteAsset`、`RenameAsset`、`DuplicateAsset`、`CaptureGraphScreenshot` |

主要能力包括：

- 大型资产、成员、图表和 Pin 读取的稳定有界分页。
- 使用 Action Registry 返回的节点 ID，而不是编造节点类型。
- 单事务图表 Patch：创建、连接、断开、删除、移动、默认值和布局；失败时尝试自动回滚，回滚失败会明确提示。
- `Balanced`、`Straight`、`Compact` 三种确定性布局风格。
- 局部和全图布局中的原生 Comment Box 包围关系保护。
- 高风险修改的 dry-run 影响分析和显式批准门禁。
- 事务回滚，以及 Unreal 支持范围内的单步 Undo。
- 显式持久化：普通编辑工具只把资产标脏；`SaveAsset` 明确写盘，`DeleteAsset` 在更严格门禁后明确删除磁盘资产。
- 无需项目声明即可从引擎目录自动发现并加载。

## 概念区分：先选对编辑对象

下列对象在 UE 编辑器里常常相邻显示，但它们不是同一件事；选错工具可能得到“调用成功但效果不在预期位置”的结果。

| 要改的对象 | 含义与适用工具 | 不要混同为 |
|---|---|---|
| 变量默认值 | 本蓝图**声明的成员变量**的声明默认值；用 `ModifyVariable` 的 `DefaultValue`。 | 节点 Pin 的字面量，也不是关卡中已有实例的覆盖值。 |
| 函数参数 / Pin | 函数 Entry/Result 的参数是函数签名，须用 `ModifyFunctionSignature`；图中某个现有节点的输入 Pin 字面量用 `SetPinDefaults`。 | 成员变量默认值；已连接输入 Pin 的默认值不会参与运行。 |
| 组件模板属性 | 此蓝图 SCS 中添加的组件模板，例如 `RelativeLocation`、`StaticMesh`；用 `SetComponentProperties`。 | Class Defaults；也不是场景内 Actor 实例的组件覆盖值。 |
| Class Defaults | 该蓝图生成类的 CDO 默认属性，包含可编辑的继承属性；用 `SetClassDefaults`。 | `ModifyVariable` 的变量声明元数据，或已摆放/已生成实例的当前值。 |
| 蓝图父类 | Blueprint 类继承的父类；用 `ReparentBlueprint`。 | 组件树中的父组件关系。 |
| 组件父子级 | 同一个 Actor Blueprint 的 SceneComponent 附着层级；用 `ReparentComponent`，本地根组件改用 `SetRootComponent`。 | Blueprint 的类继承关系。 |

## 55 个工具逐项功能总表

普通编辑工具只标脏，不会静默保存；需要保留改动时使用 `SaveAsset`。下表说明每个工具的用途和用户需要注意的边界。

| 工具 | 具体功能 | 必要注意事项 |
|---|---|---|
| `ListBlueprints` | 分页查找项目中的 Blueprint 资产。 | 大型项目请用 `PathFilter` 和分页缩小范围。 |
| `GetBlueprintOverview` | 查看蓝图的父类、图、变量、组件和接口概览。 | 需要提供准确的 `BlueprintPath`。 |
| `ListBlueprintMembers` | 分页查看函数、事件、分发器和局部变量。 | 大型蓝图请使用分页。 |
| `GetGraphDetail` | 查看指定图的节点、Pin、连线和布局信息。 | 可用 `GraphName` 限定目标图。 |
| `SearchGraphNodes` | 按英文动作名查找可创建的节点。 | 后续创建节点时只能使用返回的 `SpawnerId`。 |
| `GetCompileErrors` | 获取蓝图当前的编译诊断。 | 用于处理编辑器报告的错误或警告。 |
| `CreateUserDefinedStruct` | 在 `/Game` 下创建用户定义 Struct。 | 创建后不会自动保存。 |
| `GetUserDefinedStruct` | 查看 Struct 的字段定义。 | 大型 Struct 可分页读取。 |
| `ModifyUserDefinedStruct` | 添加、调整或删除 Struct 字段。 | 先使用 `bDryRun`；可能造成数据丢失时必须显式批准。 |
| `CreateUserDefinedEnum` | 在 `/Game` 下创建用户定义 Enum。 | 创建后不会自动保存。 |
| `GetUserDefinedEnum` | 查看 Enum 的条目、数值和显示名。 | 大型 Enum 可分页读取。 |
| `ModifyUserDefinedEnum` | 添加、调整或删除 Enum 条目。 | 先使用 `bDryRun`；改变序列化含义时必须显式批准。 |
| `AddVariable` | 为蓝图添加成员变量。 | 需要蓝图路径、变量名和 `TypeName`。 |
| `ModifyVariable` | 修改成员变量的类型、默认值、名称、可编辑性、分类或提示。 | 被引用的变量不能改类型；带 RepNotify 的变量不能通过此工具改名。 |
| `RemoveVariable` | 删除成员变量。 | 有引用或无法安全恢复时会被阻止。 |
| `CreateFunction` | 创建蓝图函数及其参数。 | 需要蓝图路径、函数名和参数定义。 |
| `RenameFunction` | 重命名用户函数，并更新可安全更新的引用。 | 先使用 dry-run；更新引用必须显式批准。 |
| `ModifyFunctionSignature` | 添加、重命名、删除或改类型函数参数。 | 默认 dry-run；删除参数或改类型可能造成数据丢失，须显式批准。 |
| `RemoveFunction` | 删除用户函数。 | 有引用或无法安全恢复时会被阻止。 |
| `CreateCustomEvent` | 在 Event Graph 中创建自定义事件。 | 目标必须是实际的 Event Graph。 |
| `AddEventNode` | 添加受支持的事件节点。 | 需指定蓝图和事件类型。 |
| `AddBoundEvent` | 为组件或委托添加绑定事件。 | 组件和委托必须能被解析。 |
| `AddLocalVariable` | 在函数图中添加局部变量。 | 需要函数名、变量名和类型。 |
| `RemoveLocalVariable` | 删除函数局部变量。 | 有引用或无法安全恢复时会被阻止。 |
| `AddNodePin` | 为支持可变 Pin 的节点增加 Pin。 | 先从图表详情取得目标节点标识。 |
| `RemoveNodePin` | 删除节点上可编辑的用户 Pin。 | 需要准确定位目标 Pin。 |
| `AddInterface` | 为蓝图添加接口。 | 使用接口类路径。 |
| `AddEventDispatcher` | 添加事件分发器。 | 指定名称和签名。 |
| `RemoveEventDispatcher` | 删除事件分发器。 | 有引用或无法安全恢复时会被阻止。 |
| `ApplyGraphPatch` | 在一次操作中创建、连线、断线、删除、移动节点，设置默认值并布局。 | 先搜索节点；支持 dry-run；失败时会尝试回滚。 |
| `SetPinDefaults` | 修改现有节点输入 Pin 的字面量。 | 已连线的输入 Pin 在运行时会忽略字面量。 |
| `FormatGraph` | 用 `Balanced`、`Straight` 或 `Compact` 整理图表布局。 | 可按图或范围指定布局。 |
| `AddCommentBox` | 添加原生 Comment Box。 | 指定文字和范围或目标节点。 |
| `GetComponents` | 查看 Actor Blueprint 的组件树、父级和模板信息。 | 仅适用于 Actor Blueprint。 |
| `AddComponent` | 添加本地 SCS 组件。 | 指定组件类、名称和可选父组件。 |
| `SetComponentProperties` | 修改本蓝图 SCS 组件模板属性。 | 属性使用 UE 文本格式；任一属性无效时整次修改回滚。 |
| `RenameComponent` | 重命名本地 SCS 组件并更新成员引用。 | 新名称必须唯一。 |
| `RemoveComponent` | 删除组件。 | 有引用或无法安全恢复时会被阻止。 |
| `ReparentComponent` | 修改本地 SceneComponent 的附着父级。 | 不能形成循环；根组件请用 `SetRootComponent`。 |
| `SetRootComponent` | 将本地 SceneComponent 设为根组件。 | 目标必须是本地 SceneComponent。 |
| `DuplicateComponent` | 复制本地 SCS 组件及模板属性。 | 实际本地根组件不能复制。 |
| `GetComponentProperties` | 分页查看可编辑的组件模板属性。 | 需要蓝图路径、组件名和分页参数。 |
| `GetClassDefaults` | 分页查看可编辑的 CDO 默认值。 | 大型属性集请使用分页。 |
| `SetClassDefaults` | 修改蓝图 CDO（含继承属性）的默认值。 | 属性名区分大小写，值使用 UE 文本格式。 |
| `CreateBlueprint` | 创建受支持类型的 Blueprint 资产。 | 指定资产路径和父类等定义；创建后不会自动保存。 |
| `ReparentBlueprint` | 更改 Blueprint 类的父类。 | 先使用 `bDryRun`；层级或接口冲突可能需要 `bAllowPotentialDataLoss`。 |
| `CompileBlueprint` | 编译指定蓝图并返回诊断。 | 用于处理编辑器报告的错误或警告。 |
| `SaveAsset` | 将资产的当前改动明确保存到磁盘。 | 普通编辑不会自动保存。 |
| `OpenAsset` | 打开资产编辑器。 | 截图前必须先打开资产。 |
| `CloseAsset` | 关闭资产编辑器。 | 关闭前请先保存需要保留的改动。 |
| `ReloadBlueprintFromDisk` | 用磁盘版本替换当前内存中的 Blueprint。 | 默认 dry-run；丢弃未保存改动必须显式批准。 |
| `DeleteAsset` | 删除资产。 | 删除具有更严格的引用和恢复安全检查。 |
| `RenameAsset` | 重命名或移动资产。 | 指定源路径和目标路径。 |
| `DuplicateAsset` | 复制资产。 | 指定源路径和目标路径。 |
| `CaptureGraphScreenshot` | 截取已打开蓝图图表的画面。 | 先 `OpenAsset`；图表控件必须已初始化。 |

## 重点教程：默认值、签名、组件与继承

## 推荐操作流程

涉及结构或数据变化的写操作可按以下顺序进行：

1. **定位**： 确定目标资产、图、Pin、成员或组件。
2. **搜索**： 通过 `SearchGraphNodes` 获取合法 `SpawnerId`。
3. **预览**： 工具支持时使用 `bDryRun=true`，检查受影响资产、规范化操作、限制和 blocker。
4. **应用**： 使用工具返回的标识，不编造 `SpawnerId`。
5. **保存**： 只有需要保留改动时才调用 `SaveAsset`。

Dry-run 不能展示所有生成 Pin、类型提升或最终布局。这是预览能力的限制，不代表工具会自动写入；写入前仍应使用当前搜索结果中的 `SpawnerId`。

## 资产生命周期

资产工具可以创建、复制、重命名、重设父类、编译、打开、关闭、重载、删除和保存支持的蓝图资产。

- 磁盘重载默认 dry-run，丢弃内存状态前必须显式批准。
- 破坏性删除比普通图修改具有更严格的 Undo/Redo 和 Package 安全要求。

## 设置

打开 **项目设置 → 插件 → MCP Blueprint**：

- **Port** — 默认 `8766`；被占用时最多尝试后续九个端口。
- **Auto Start** — 随编辑器启动服务器。
- **Auto Compile After Modify** — 支持的写操作完成后自动编译。
- **Request Timeout Seconds** — 普通工具超时。
- **Compile Timeout Seconds** — 编译类工具独立超时。

## 当前限制

- 支持 Windows、macOS 和 Linux Editor；不提供 Runtime/Shipping 模块。
- 暂无“调用任意 Blueprint 函数并返回运行结果”的通用工具。
- Custom Event 和 Event Dispatcher 的签名修改能力尚未达到普通函数签名修改的完整程度。
- 某些 Blueprint Action 无法安全处理时，工具会直接拒绝操作。
- 截图需要真实初始化的 Blueprint Graph Editor 控件。

## 故障排查

- **无法连接：** 使用工具栏显示的实际端点，配置端口可能已被占用。
- **找不到工具：** 刷新 `tools/list`，不要依赖旧缓存。
- **写入被拒绝：** 阅读所有 blocker 和批准参数要求，重试前重新读取目标。
- **编译失败：** 获取编译诊断，根据真实蓝图错误修复后再保存。
- **图表结果异常：** 对比前后的 `GetGraphDetail`，适用时执行 Undo。
- **插件提示重建：** 安装与引擎小版本完全匹配的包。
- **项目中找不到插件：** 核对插件是否安装在该引擎的 `Engine/Plugins/Marketplace`；不要用添加项目依赖的方式绕过。
- **UE 5.5 提示项目文件过期，原因是已安装的 MCPBlueprint 不在项目描述符中：** 选择 **Not Now（暂不）**。引擎插件仍会自动加载；选择 **Update（更新）** 会把 MCPBlueprint 写入项目 `.uproject`，形成当前安装模式明确要避免的项目侧依赖。

## 支持

如有问题或反馈，请使用[统一联系页面](https://mzsh.me/contact/)。
