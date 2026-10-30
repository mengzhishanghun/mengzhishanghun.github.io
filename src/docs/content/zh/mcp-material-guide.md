---
title: MCPMaterial 使用文档
description: MCPMaterial 的安装、连接、工具用法与限制
type: doc
slug: mcp-material-guide
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-material
documentKind: product-manual
websiteRoute: /docs/zh/guides/ue-tools/mcp-material-guide/
lang: zh
translationKey: mcp-material-guide
---

# MCPMaterial

MCPMaterial 为 Unreal Editor 提供面向 AI 客户端的材质与材质实例 MCP 工具。插件支持 UE 5.2 及以上版本，默认端点为 `http://127.0.0.1:8763/mcp`；端口被占用时会在有限范围内递增。

## 能力

- 发现材质、材质实例与可用表达式类。
- 读取材质图、连接、属性和 Scalar、Vector、Texture、Sparse Volume Texture、Static Switch 参数。
- 创建材质与材质实例，批量编辑属性、参数、表达式节点和连线。
- 编译材质与材质实例、保存资产、打开或关闭资产编辑器，以及捕获材质预览。
- 写入工具使用事务并标记包 Dirty；调用 `SaveAsset` 前可先调用 `CompileMaterial` 验证材质。

## 安全工作流

1. 使用 `ListMaterials`、`GetMaterialDetail`、`GetMaterialParameters` 和 `SearchMaterialExpressions` 获取真实路径、Guid、引脚与参数信息。
2. 如果目标材质或材质实例已在资产编辑器中打开，先保存或处理编辑器中的更改，再调用 `CloseAsset`。
3. 调用 `ApplyMaterialPatch`、`SetMaterialProperties`、`SetInstanceParameters`、`ResetInstanceParameter`、`RemoveConnection` 或 `FormatGraph`。
4. 调用 `CompileMaterial`，检查终态编译结果。
5. 调用 `SaveAsset` 持久化更改；需要人工检查时再调用 `OpenAsset`。

写入、编译和保存工具会拒绝操作仍在资产编辑器中打开的目标。这可避免 Material Editor 的 transient preview 与 backing asset 形成双状态，并防止编辑器稍后 Apply 时覆盖 MCP 已完成的修改。

## 编译结果

`CompileMaterial` 的 `AssetPath` 接受 Material 或 MaterialInstanceConstant。保存前检查 `CompileStatus`（`Success` 或 `Error`）和 `Errors` 数组。

| 返回字段 | 含义 |
| --- | --- |
| `AssetPath` | 保留请求中传入的路径。 |
| `AssetType` | 请求资产的类型，值为 `Material` 或 `MaterialInstanceConstant`。 |
| `ResourceOwnerPath` | 实际编译资源所属资产的完整对象路径，例如 `/Game/Materials/MI_Example.MI_Example`。 |

有静态置换的实例编译自身资源；没有静态置换的实例使用父链中的有效资源，其所属资产可能是父材质，也可能是祖先实例。`ResourceOwnerPath` 返回实际所属资产。编译前，请关闭请求资产和资源所属资产的编辑器。资源缺失时，返回 `CompileStatus: "Error"`、非空 `Errors` 和空字符串 `ResourceOwnerPath`；实例没有完整 shader map 时也返回编译错误。

## 编辑既有节点

调用 `GetMaterialDetail` 并设置 `IncludeEditableProperties: true`，可读取当前节点页的 `EditableProperties`（`Name`、`Type`、`ValueText`、`Editable`）和实际 `Inputs`/`Outputs`（`Index`、`Name`、数值形式的材质值 `Type`）。根响应还会包含材质的 `EditableMaterialProperties`。属性描述中的 `Type` 是 UE C++ 类型，`ValueText` 使用 UE 文本格式；`Editable` 同时反映服务端支持范围和当前属性组合。省略该开关时，响应保持原有结构。

使用查询得到的节点 GUID 原位修改属性：

```json
{
  "AssetPath": "/Game/Materials/M_Example",
  "Patch": {
    "UpdateNodes": [
      {"NodeGuid": "<GetMaterialDetail 返回的 GUID>", "Properties": {"DefaultValue": 0.75}}
    ]
  }
}
```

响应的 `UpdatedNodeGuids` 列出已更新节点。属性更新会保留节点 GUID、参数 GUID 和既有连线；同一 Patch 显式编辑连线时，按请求执行。修改 Constant3Vector 时，将 `Constant` 设为 UE 颜色字符串，例如 `"(R=1,G=0,B=0,A=1)"`。

`UpdateNodes` 接受 1–1000 项，与 `Nodes`、`Connections`、`RemoveNodes` 共用总计 2000 次操作的上限。GUID 必须指向请求材质内的既有节点；重复 GUID，以及同一节点同时更新和删除的请求都会被拒绝。该更新模式不开放身份修改、参数改名、动态引脚变更、容器及需要专用适配器的外部引用。原有 `Nodes.Defaults` 创建请求保留既有支持范围。

TextureSample 支持更新 `Texture` 引用。未指定 `SamplerType` 时，采样类型随最终纹理自动调整；显式指定的 `SamplerType` 始终优先，不受属性顺序或名称大小写影响。后续连接失败时，整个 Patch 会回滚。若返回 `StateUnknown`，表示恢复结果无法核实，应停止写入并检查资产。编辑后请编译材质，再显式保存。

## 结构化实例参数

调用 `GetMaterialParameters` 时传入 `IncludeStructuredParameters: true`，响应会增加 `Parameters`。每行包含 `Type`、`Name`、`Association`、`Index`、解析后的 `Value`、严格本地的 `Overridden` 和 `ExpressionGuid`。祖先实例的覆盖会影响解析值，但不会把子实例的 `Overridden` 变为 true。不传开关时保留原响应结构。

新列表独立使用同一组 `Offset`、`MaxResults`，计数字段为 `StructuredTotalCount`、`StructuredReturned`、`StructuredOffset`。`SupportedParameterTypes` 不分页：UE 5.2–5.4 支持九类，5.5–5.6 增加 TextureCollection，5.7+ 增加 ParameterCollection。排序依次为 Scalar、Vector、DoubleVector、Texture、Font、RuntimeVirtualTexture、SparseVolumeTexture、StaticSwitch、StaticComponentMask、TextureCollection、ParameterCollection，再按 Association、Index、名称排序。

`SetInstanceParameters` 接受 1–1000 个完整身份及值：

```json
{"AssetPath":"/Game/Materials/MI_Example","Parameters":[{"Type":"Scalar","Name":"Amount","Association":"Global","Index":-1,"Value":0.5}]}
```

`Global` 的 `Index` 必须为 -1；`Layer`、`Blend` 必须对应层栈索引上的真实参数。重复身份按 UE FName 语义比较名称。`Parameters` 与任何旧映射同时出现时，整请求在编辑前拒绝，空映射也不例外。结构化更新先校验完整列表，再用单个事务应用；旧映射保留部分成功行为。

| 类型 | Value |
| --- | --- |
| Scalar | 有限且在 float 范围内的数值。 |
| Vector / DoubleVector | `{R,G,B,A}` 四个有限数值；DoubleVector 保留双精度。 |
| StaticSwitch | bool。 |
| StaticComponentMask | `{R,G,B,A}` 四个 bool。 |
| Font | `{AssetPath,Page}`，要求 Offline 字体及有效纹理页。 |
| Texture / RuntimeVirtualTexture / SparseVolumeTexture / TextureCollection | 对应资源类的资产路径；普通纹理还须匹配编译资源中的纹理类型。 |
| ParameterCollection | 从表达式原始集合派生的集合，要求 UE 5.7+。 |

用 `ResetInstanceParameter` 的 `Parameter: {Type,Name,Association,Index}` 只移除指定本地覆盖，之后从父级继承，其他覆盖与层栈保留。`Parameter` 不得与旧 `ParameterName`、`ParameterType` 选择器混用。

编辑成功后返回 `Applied`、dirty/保存字段、`RequiredSaveSet` 及 `CompileStatus: "NotCompiled"`，仍需显式编译和保存。编辑失败时会尽可能验证恢复结果；`RecoveryFailed/StateUnknown` 表示无法确认已恢复，应停止写入并且不要保存该资产。

## 重要边界

- 旧名称映射与旧重置选择器只接受可唯一定位的 Global 参数。Layer 与 Blend 参数使用完整结构化身份。
- `SetInstanceParameters` 会根据父材质当前编译资源校验普通纹理参数类型；2D、Cube、2D/Cube Array、Volume 与 Virtual Texture 不能互相代填。独立的 `SparseVolumeTextureParameters` 映射读取和写入 `USparseVolumeTexture`，`ResetInstanceParameter` 使用 `ParameterType: "SparseVolumeTexture"` 重置。父材质没有可用资源或参数不在当前静态开关排列中时会拒绝写入。
- `SearchMaterialExpressions` 返回稳定的 `ClassPath`、`Creatable`、不可创建原因以及输入/输出索引。短类名发生碰撞时，`ApplyMaterialPatch` 会拒绝猜测并要求精确 `ClassPath`；同名 Pin 必须使用 `[index]` 寻址。
- `ApplyMaterialPatch` 不创建或删除需要专用编辑器结构管理的 Composite、PinBase、Function Input/Output、Named Reroute 等节点。
- 服务端会按工具输入 Schema 递归拒绝未知字段、缺失必填字段、错误类型和值域；原始 `tools/call` 也不能绕过该校验。`ApplyMaterialPatch` 的 Nodes、Connections、RemoveNodes、UpdateNodes 各最多 1000 项，四者合计最多 2000 次操作。分页、预览尺寸、图布局间距、连接索引和参数类型等已知边界会在执行前校验。
- 默认 HTTP 请求体上限为 1 MiB，JSON-RPC 响应体上限为 8 MiB，可在 Project Settings 的 MCP Material 设置中调整。`CapturePreview` 最大为 1024×1024，且压缩 PNG 不得超过 4 MiB。工具结果超限时会保留真实成功/失败终态并省略过大的内容；成功写工具不得仅因结果被省略而盲目重试。
- `GetMaterialDetail` 对节点使用 `NodeOffset`/`MaxNodes`、对连接使用 `ConnectionOffset`/`MaxConnections`；`GetMaterialParameters` 按 Scalar、Vector、Texture、SparseVolumeTexture、StaticSwitch 顺序使用统一 `Offset`/`MaxResults` 游标。响应会返回总数、当前返回数和下一游标，单页上限均为 1000。
- 高级参数类型使用结构化接口，并受上述引擎版本能力限制。Runtime Virtual Texture 的消费者需要启用虚拟纹理；Sparse Volume Texture 资产需要已初始化的帧数据。
- `SetMaterialProperties` 与 `ApplyMaterialPatch.Defaults` 会按最终属性组合拒绝当前被条件禁用的属性。创建的资产先处于内存 Dirty 状态，必须显式调用 `SaveAsset` 才会写入磁盘；底层保存失败会返回 MCP 错误终态，而不是成功响应中的警告。
- JSON-RPC 仅把缺少 `id` 字段的消息视为通知；显式 `id:null` 仍会收到带空 id 的响应。
- 超时不能强制终止已被 GameThread 认领的编辑器操作；收到超时错误后应先核对编辑器状态，再决定是否重试。

如有问题或反馈，请发送邮件至 [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com)。我看到后会处理。
