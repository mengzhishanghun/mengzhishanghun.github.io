---
title: 创建、编译与管理蓝图资产
type: doc
slug: mcp-blueprint-asset-lifecycle
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-blueprint
docPage:
  work: mcp-blueprint
  group: assets-graphs
  slug: asset-lifecycle
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-blueprint/docs/asset-lifecycle/
lang: zh
translationKey: doc:mcp-blueprint:asset-lifecycle
---

## 资产的创建、复制与保存

| 工具 | 用途 | 注意事项 |
| --- | --- | --- |
| `ListBlueprints` | 分页查找项目中的 Blueprint 资产。 | 大型项目请用 `PathFilter` 和分页缩小范围。 |
| `GetBlueprintOverview` | 查看蓝图的父类、图、变量、组件和接口概览。 | 需要提供准确的 `BlueprintPath`。 |
| `CreateBlueprint` | 创建受支持类型的 Blueprint 资产。 | 指定资产路径和父类等定义；创建后不会自动保存。 |
| `DuplicateAsset` | 复制资产。 | 指定源路径和目标路径。 |
| `RenameAsset` | 重命名或移动资产。 | 指定源路径和目标路径。 |
| `SaveAsset` | 将资产的当前改动明确保存到磁盘。 | 普通编辑不会自动保存。 |
| `OpenAsset` | 打开资产编辑器。 | 截图前必须先打开资产。 |
| `CloseAsset` | 关闭资产编辑器。 | 关闭前请先保存需要保留的改动。 |

大型资产列表支持有界分页。请使用读取结果中的资产路径；普通编辑只标记资产有改动，`SaveAsset` 才把这些改动写入磁盘。

## 编译与诊断

| 工具 | 用途 | 注意事项 |
| --- | --- | --- |
| `GetCompileErrors` | 获取蓝图当前的编译诊断。 | 用于处理编辑器报告的错误或警告。 |
| `CompileBlueprint` | 编译指定蓝图并返回诊断。 | 用于处理编辑器报告的错误或警告。 |

获取编译诊断，根据真实蓝图错误修复后再保存。

## 重载磁盘版本与删除资产

| 工具 | 用途 | 注意事项 |
| --- | --- | --- |
| `ReloadBlueprintFromDisk` | 用磁盘版本替换当前内存中的 Blueprint。 | 默认 dry-run；丢弃未保存改动必须显式批准。 |
| `DeleteAsset` | 删除资产。 | 删除具有更严格的引用和恢复安全检查。 |

- 磁盘重载默认 dry-run，丢弃内存状态前必须显式批准。
- 破坏性删除比普通图修改具有更严格的 Undo/Redo 和 Package 安全要求。
