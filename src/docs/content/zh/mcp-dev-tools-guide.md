---
title: MCPDevTools 使用文档
description: MCPDevTools 的安装、连接、工具用法与限制
type: doc
slug: mcp-dev-tools-guide
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-dev-tools
documentKind: product-manual
websiteRoute: /docs/zh/guides/ue-tools/mcp-dev-tools-guide/
lang: zh
translationKey: mcp-dev-tools-guide
---

# MCPDevTools

MCPDevTools 在 Unreal Editor 中通过 HTTP MCP 提供资产查询、编辑和只读开发诊断工具。当前注册 33 个工具：原有 30 个资产工具，以及 `GetDevContext`、`ListProjectPlugins`、`ReadDevLog`。使用时以目标编辑器实际返回的 `tools/list` 和工具结果为准。

## 启用和连接

将 `Plugins/MCPDevTools` 放入项目的 `Plugins` 目录，在 `.uproject` 的 `Plugins` 数组启用 `MCPDevTools`。打开编辑器后，可在 **Project Settings → Plugins → MCPDevTools** 设置端口和自动启动。默认地址为 `http://127.0.0.1:8768/mcp`；端口被占用时会尝试后续端口，以编辑器日志中的实际地址为准。InputAction 和 InputMappingContext 工具还要求启用 EnhancedInput；创建这两类资产需要 InputEditor 模块可用。

## 工具

| 类型 | 工具 | 用途与主要参数 |
|---|---|---|
| 通用查询 | `ListAssets`、`GetAssetInfo`、`GetAssetReferences`、`GetAssetTypeSchema` | 分页列出挂载内容目录的独立资产；按 `AssetPath` 读取注册信息、依赖或引用者；查询当前引擎支持的类型、工具、限制和可选 `ClassPath` 的字段、枚举与默认值。引用边不能证明资产可安全删除。 |
| DataAsset | `ListDataAssets`、`GetDataAsset`、`CreateDataAsset`、`SetDataAssetProperties` | 按 `/Game` 文件夹分页查找，读取反射属性；以 `AssetPath`、`ClassPath` 创建；用 `Properties` 与对应的 `ExpectedValues` 修改。 |
| DataTable | `GetDataTable`、`CreateDataTable`、`PatchDataTableRows` | 按页读取完整行；创建时指定已有的 `RowStructPath`；修改时提供当前 `RowStructPath`、`Changes` 和完整旧行 `ExpectedValues`，支持 Add、Update、Remove。不会生成或转换行结构。 |
| Curve | `GetCurve`、`CreateCurve`、`SetCurve` | 读取或创建 Float、Vector、LinearColor 曲线；用 `Channels` 和对应完整旧通道 `ExpectedValues` 替换指定通道。未指定的通道保持原值。 |
| CurveTable | `GetCurveTable`、`CreateCurveTable`、`PatchCurveTableRows` | 按页读取 Simple 或 Rich 行；创建时指定 `Mode`；用 `Mode`、`Changes` 和完整旧行 `ExpectedValues` 执行 Add、Replace、Remove。不转换 Simple/Rich 模式。 |
| StringTable | `GetStringTable`、`CreateStringTable`、`PatchStringTable` | 按页读取键、源文本与元数据；创建时指定固定的 `Namespace`；修改时提供 `Namespace`、`TableId`、`Changes` 与完整旧条目 `ExpectedValues`，支持 Add、Update、Remove。 |
| PrimaryAssetLabel | `GetPrimaryAssetLabel`、`CreatePrimaryAssetLabel`、`SetPrimaryAssetLabel` | 读取原生标签、创建新标签，或用 `Properties` 与 `ExpectedValues` 修改可编辑字段；派生 bundle 数据只读。 |
| InputAction | `GetInputAction`、`CreateInputAction`、`SetInputAction` | 读取设置及其 Trigger、Modifier、PlayerMappable 实例；修改时提交 `ExpectedSettings`、`ExpectedTriggers`、`ExpectedModifiers`、`ExpectedPlayerMappableKeySettings` 和相应的新 `Properties`、`Triggers`、`Modifiers`、`PlayerMappableKeySettings`。 |
| InputMappingContext | `GetInputMappingContext`、`CreateInputMappingContext`、`SetInputMappingContext` | 读取设置、有序默认 `Mappings` 和版本支持的 `MappingProfileOverrides`；修改时提交 `ExpectedSettings`、`ExpectedMappings`、新 `Properties` 和完整新 `Mappings`。支持 profiles 的版本还必须提交 `ExpectedMappingProfileOverrides` 与完整新 `MappingProfileOverrides`。 |
| 保存 | `SaveAsset` | 用 `AssetPath` 显式保存一个受支持的 `/Game` 独立资产包；不会连带保存引用资产或自动签出只读文件。 |
| 开发上下文 | `GetDevContext` | 读取项目、实际引擎/插件版本、实例和会话标识、服务器运行状态、实际端口及监听观测。`IncludePaths` 默认为 false，显式设为 true 才返回当前项目文件和引擎目录的绝对路径。 |
| 工程插件 | `ListProjectPlugins` | 从已加载插件管理信息读取白名单字段；`Scope` 默认为 `enabled`，也可选 `discovered`；稳定排序分页。 |
| 插件日志 | `ReadDevLog` | 只读取模块注册完成后捕获的 `LogMCPDevTools` 日志；用 `Cursor`、`Limit`、可选 `VerbosityFilter` 分页。 |

`AssetPath` 是包路径，例如 `/Game/Data/DA_Example`，不是短名、对象路径或子对象路径。`ClassPath` 是完整类对象路径，例如 `/Script/Engine.DataAsset` 或已编译的蓝图类路径 `/Game/Data/BP_Example.BP_Example_C`。常规列表和分页读取默认返回 20 项，每页最多 100 项；根据 `bHasMore` 和 `NextOffset` 继续读取。编辑支持的七类资产为 DataAsset、DataTable、Curve、CurveTable、StringTable、PrimaryAssetLabel 和 Enhanced Input（InputAction/InputMappingContext）。

## 只读开发诊断

三个诊断工具不会启动进程或测试作业、加载资产、保存包或更改配置。输入不接受额外字段。上下文缺失时返回具体不可用原因。

`ListProjectPlugins` 和 `ReadDevLog` 默认每页 100 项，上限 200，使用返回的 `NextCursor` 继续读取。日志页另按最坏 JSON 转义预留序列化预算，`TextContent` 最多 512 Ki TCHAR，因此实际条数可能低于 `Limit`，未返回的匹配日志保留到下一页。插件列表只返回名称、友好名称、版本号/版本名、启用状态、来源和类型；不返回任意 descriptor JSON 或插件路径。列表游标绑定快照、Scope 和 Limit，信息或查询条件变化后需不带 Cursor 重新查询。

日志仅保存在当前进程内存中，最多 2,048 条、文本总量 2 MiB、单条最多 8,192 TCHAR。`VerbosityFilter` 可选 `Fatal`、`Error`、`Warning`、`Display`、`Log`、`Verbose`、`VeryVerbose`，省略或空数组表示不按级别筛选。输出包含 `CaptureStartUtc`、`CaptureSession`、`NextCursor`、覆盖缺口 `bGap` / `DroppedSinceCursor` 和截断标记 `bTruncated`。没有匹配日志时，游标仍推进到已检查位置。旧捕获会话的游标会拒绝；首次读取也可能已有覆盖缺口。模块关闭时停止接收并注销输出设备，不提供磁盘日志、注册前历史或崩溃阶段完整性保证。HTTP 查询本身产生的插件日志可出现在后续页。该类别的消息可能包含项目名或路径，日志不承诺完全没有私密信息。

Windows 上的监听结果来自 `GetExtendedTcpTable` 对当前 PID 和 ActualPort 的 IPv4/IPv6 只读观测：`observed_loopback` 要求两族查询成功且全部匹配地址属于 IPv4 127/8 或 IPv6 ::1；通配地址为 `observed_non_loopback`。查询失败、归属歧义、无匹配或状态变化返回 `unknown`，停止服务返回 `not_running`。其他平台返回 `unsupported_platform` 原因。返回的 127.0.0.1 URL 本身不证明实际绑定；OS 观测只代表采样时刻，不是身份认证或持续安全保证。工具不改变监听、HTTP 设置、防火墙或权限。

## 建议操作顺序

1. 先调用相应的 `Get...` 工具读取当前完整值；不确定类型或字段时调用 `GetAssetTypeSchema`。创建操作先保持默认 `bDryRun=true`，确认路径、类或模式后，再设置 `bDryRun=false`。
2. 修改操作把读取结果中的完整旧值放入相应 `Expected...` 参数，并提交新值。先做默认 dry-run，再设置 `bDryRun=false`。冲突或字段无效时操作会拒绝；创建或修改后资产在内存中为 dirty。
3. 确认编辑结果后单独调用 `SaveAsset` 写入该资产包。工具不会自动签出、覆盖已有创建路径，或连带保存引用资产。

原有 DataAsset 调用方式保持不变。例如 `GetDataAsset` 读到 `Title` 当前值为 `"Old"` 后，可调用 `SetDataAssetProperties`：

```json
{
  "AssetPath": "/Game/Data/DA_Example",
  "Properties": { "Title": "New" },
  "ExpectedValues": { "Title": "Old" },
  "bDryRun": true
}
```

Input 的 Trigger、Modifier 和 PlayerMappable 设置是资产持有的实例，不是普通对象引用。替换实例使用 `{ "ClassPath": "/Script/EnhancedInput.InputTriggerHold", "Properties": {} }` 形态；数组保持输入顺序，`PlayerMappableKeySettings` 可为该对象形态或 `null`。InputMappingContext 的每条映射包含 `Properties`、`Triggers`、`Modifiers`，可选 `PlayerMappableKeySettings`；`MappingProfileOverrides` 是 profile 名到完整映射数组的对象。UE 5.8 暴露 profiles，UE 5.2 不提供该字段，传入 profile 参数会报错。先从 `GetInputMappingContext` 取得当前引擎的 `bProfileOverridesSupported` 与完整旧值。

## 值和限制

- 支持可写的布尔、有限且在类型范围内的数值、合法枚举名、字符串、名称、值类型结构体、数组、集合、字符串或名称键的 Map，以及硬/软对象和类引用。超出 JSON 精确整数范围的 64 位整数用十进制字符串读写。结构体可省略未改字段；数组、Set 和 Map 整体替换。
- `FText` 以身份对象读写：`{"InvariantText":"内容"}`、`{"StringTableId":"...","StringTableKey":"..."}`，或本地化的 `{"Namespace":"...","Key":"...","Source":"..."}`；UE 5.8 本地化形态还包含 `DevNotes`。格式化、数值等不能无损表示的文本只读。
- 字段名区分大小写；JSON 对象不得含重复键或仅大小写不同的键。属性名、枚举名、`FName` 值和键、路径不接受内嵌 NUL；普通字符串值按完整长度比较。Set 重复值和 Map 键归一化冲突会被拒绝。
- 普通属性引用使用存在且类型匹配的完整对象路径，或用 JSON `null` 清空。DataAsset 通用属性编辑不接受内联子对象、委托、Transient、只读字段或不支持的类型；Input 的实例使用上文的专用参数。
- `ListDataAssets` 的 `ClassPath` 按继承关系过滤，可使用抽象 DataAsset 基类（如 `DataAsset`、`PrimaryDataAsset`）；类路径和 Blueprint 当前成功编译要求仍适用。`CreateDataAsset` 要求非抽象具体类，使用通用 DataAsset 工厂，需专用工厂的类型使用相应创建工具。`SaveAsset` 只保存支持的单资产包；只读文件会拒绝保存。


## 能力限制

其他平台、Manage/SearchableName 自然依赖边、Cook/实际 Chunk 产出和非空 ExplicitBlueprints 的行为尚未确认。本插件当前工具不提供 Automation/Build/Cook/Package 作业、任意命令或用户 C++ 源码编辑。
