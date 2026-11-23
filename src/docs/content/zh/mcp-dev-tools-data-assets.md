---
title: 创建 DataAsset 并修改属性
type: doc
slug: mcp-dev-tools-data-assets
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-dev-tools
docPage:
  work: mcp-dev-tools
  group: features
  slug: data-assets
  order: 4
documentKind: product-manual
websiteRoute: /zh/works/mcp-dev-tools/docs/data-assets/
lang: zh
translationKey: doc:mcp-dev-tools:data-assets
---

## 读取与写入

| 类型 | 工具 | 用途与主要参数 |
|---|---|---|
| DataAsset | `ListDataAssets`、`GetDataAsset`、`CreateDataAsset`、`SetDataAssetProperties` | 按 `/Game` 文件夹分页查找，读取反射属性；以 `AssetPath`、`ClassPath` 创建；用 `Properties` 与对应的 `ExpectedValues` 修改。 |

`AssetPath` 是包路径，例如 `/Game/Data/DA_Example`，不是短名、对象路径或子对象路径。`ClassPath` 是完整类对象路径，例如 `/Script/Engine.DataAsset` 或已编译的蓝图类路径 `/Game/Data/BP_Example.BP_Example_C`。

## 类型与值的校验

- 支持可写的布尔、有限且在类型范围内的数值、合法枚举名、字符串、名称、值类型结构体、数组、集合、字符串或名称键的 Map，以及硬/软对象和类引用。超出 JSON 精确整数范围的 64 位整数用十进制字符串读写。结构体可省略未改字段；数组、Set 和 Map 整体替换。
- `FText` 以身份对象读写：`{"InvariantText":"内容"}`、`{"StringTableId":"...","StringTableKey":"..."}`，或本地化的 `{"Namespace":"...","Key":"...","Source":"..."}`；UE 5.8 本地化形态还包含 `DevNotes`。格式化、数值等不能无损表示的文本只读。
- 字段名区分大小写；JSON 对象不得含重复键或仅大小写不同的键。属性名、枚举名、`FName` 值和键、路径不接受内嵌 NUL；普通字符串值按完整长度比较。Set 重复值和 Map 键归一化冲突会被拒绝。
- 普通属性引用使用存在且类型匹配的完整对象路径，或用 JSON `null` 清空。DataAsset 通用属性编辑不接受内联子对象、委托、Transient、只读字段或不支持的类型。
- `ListDataAssets` 的 `ClassPath` 按继承关系过滤，可使用抽象 DataAsset 基类（如 `DataAsset`、`PrimaryDataAsset`）；类路径和 Blueprint 当前成功编译要求仍适用。`CreateDataAsset` 要求非抽象具体类，使用通用 DataAsset 工厂，需专用工厂的类型使用相应创建工具。`SaveAsset` 只保存支持的单资产包；只读文件会拒绝保存。

## 修改属性示例

下面只改一个属性。先用 `GetDataAsset` 读到 `Title` 为 `"Old"`，再把读到的旧值和要写入的新值一起交给 `SetDataAssetProperties` 预检：

```json
{
  "AssetPath": "/Game/Data/DA_Example",
  "Properties": { "Title": "New" },
  "ExpectedValues": { "Title": "Old" },
  "bDryRun": true
}
```

预检通过后，按下方规则重发实际写入请求。再次读取并确认目标值后，单独保存资产；见[预览和保存规则](/zh/works/mcp-dev-tools/docs/connect/)。
