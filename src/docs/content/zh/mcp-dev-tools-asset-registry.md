---
title: 查询资产、引用与类型
type: doc
slug: mcp-dev-tools-asset-registry
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
  slug: asset-registry
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/mcp-dev-tools/docs/asset-registry/
lang: zh
translationKey: doc:mcp-dev-tools:asset-registry
---

## 资产注册信息与引用

| 类型 | 工具 | 用途与主要参数 |
|---|---|---|
| 通用查询 | `ListAssets`、`GetAssetInfo`、`GetAssetReferences`、`GetAssetTypeSchema` | 分页列出挂载内容目录的独立资产；按 `AssetPath` 读取注册信息、依赖或引用者；查询当前引擎支持的类型、工具、限制和可选 `ClassPath` 的字段、枚举与默认值。引用边不能证明资产可安全删除。 |

`AssetPath` 是包路径，例如 `/Game/Data/DA_Example`，不是短名、对象路径或子对象路径。`ClassPath` 是完整类对象路径，例如 `/Script/Engine.DataAsset` 或已编译的蓝图类路径 `/Game/Data/BP_Example.BP_Example_C`。

知道包路径时直接查详情；只知道资产大概在哪个内容目录时，先从列表定位。排查引用时，区分这项资产依赖了什么，以及有哪些资产反过来引用它。列表和分页读取默认返回 20 项，每页最多 100 项。如果 `bHasMore` 表示还有结果，用 `NextOffset` 读取下一页。

其他平台和原生 Manage/SearchableName 依赖边尚未验证。
