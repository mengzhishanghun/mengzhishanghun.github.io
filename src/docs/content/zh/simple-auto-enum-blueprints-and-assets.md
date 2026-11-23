---
title: 在蓝图和数据资产中使用枚举
type: doc
slug: simple-auto-enum-blueprints-and-assets
draft: false
sitePublish: true
tags:
  - 配置管理
  - 枚举
workIds:
  - simple-auto-enum
docPage:
  work: simple-auto-enum
  group: features
  slug: blueprints-and-assets
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/simple-auto-enum/docs/blueprints-and-assets/
lang: zh
translationKey: doc:simple-auto-enum:blueprints-and-assets
---

## 蓝图函数中的限制

- **问题**：蓝图函数将枚举值存储为 `FString`，因此更改枚举名称或位置可能不会自动更新
- **解决方案**：右键蓝图函数并选择 **Refresh** 以同步当前枚举值

## 数据资产中的默认值

追加后，打开使用该枚举的蓝图与数据资产，确认已有选择仍指向原条目，再试选新增项。如果已经调整过顺序，逐个检查受影响的默认值，确认它们仍对应预期的枚举项。

- **行为**：数据资产使用枚举索引，名称更改时自动同步
- **警告**：重新排序枚举值会导致数据资产值偏移（例如交换位置 1 和 2，存储值 1 的数据资产将引用位置 2）
- **建议**：在生产环境中，需要增加枚举值时，在现有条目后追加，避免重排已有条目。
