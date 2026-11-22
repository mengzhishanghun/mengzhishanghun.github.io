---
title: 修改材质实例参数
type: doc
slug: mcp-material-instance-parameters
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-material
docPage:
  work: mcp-material
  group: workflows
  slug: instance-parameters
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/mcp-material/docs/instance-parameters/
lang: zh
translationKey: doc:mcp-material:instance-parameters
---

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
