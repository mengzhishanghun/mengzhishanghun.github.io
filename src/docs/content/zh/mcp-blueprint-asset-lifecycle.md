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
  group: features
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

项目资产多时，先按目录缩小查找范围，必要时继续翻页。将列表返回的资产路径用于后续操作。普通编辑不会写入磁盘；需要保留改动时调用 `SaveAsset`。

## 编译与诊断

| 工具 | 用途 | 注意事项 |
| --- | --- | --- |
| `GetCompileErrors` | 获取蓝图当前的编译诊断。 | 用于处理编辑器报告的错误或警告。 |
| `CompileBlueprint` | 编译指定蓝图并返回诊断。 | 用于处理编辑器报告的错误或警告。 |

要查看已有的编译消息，用 `GetCompileErrors`。要编译当前改动，用 `CompileBlueprint`。处理报告的问题后，再保存要保留的版本。

## 重载磁盘版本与删除资产

| 工具 | 用途 | 注意事项 |
| --- | --- | --- |
| `ReloadBlueprintFromDisk` | 用磁盘版本替换当前内存中的 Blueprint。 | 默认 dry-run；丢弃未保存改动必须显式批准。 |
| `DeleteAsset` | 删除资产。 | 删除具有更严格的引用和恢复安全检查。 |

- 想放弃未保存的改动时，先预检磁盘重载；确认可以丢弃内存状态后，再明确批准。
- 破坏性删除比普通图修改具有更严格的 Undo/Redo 和 Package 安全要求。
