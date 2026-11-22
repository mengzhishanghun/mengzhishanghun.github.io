---
title: 读取与修改蓝图类默认值
type: doc
slug: mcp-blueprint-class-defaults
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-blueprint
docPage:
  work: mcp-blueprint
  group: class-structure
  slug: class-defaults
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/mcp-blueprint/docs/class-defaults/
lang: zh
translationKey: doc:mcp-blueprint:class-defaults
---

## 找到可编辑的类属性

| 工具 | 用途 | 注意事项 |
| --- | --- | --- |
| `GetClassDefaults` | 分页查看可编辑的 CDO 默认值。 | 大型属性集请使用分页。 |
| `SetClassDefaults` | 修改蓝图 CDO（含继承属性）的默认值。 | 属性名区分大小写，值使用 UE 文本格式。 |

## 编辑类默认对象与继承属性

使用 `GetClassDefaults` 找到可编辑且**大小写敏感**的反射属性名。传入 `Properties` 的 UE 文本映射，如 `bReplicates: "True"` 或 `JumpMaxCount: "2"`。它改的是该 Blueprint CDO，作用于以后放置/生成且未覆写的实例；不会追溯改变已存在实例。工具还能访问父 C++/父 Blueprint 的属性，这是 `ModifyVariable` 做不到的。按需使用 `SaveAsset` 保存。

蓝图 CDO 默认值与 `ModifyVariable` 管理的变量声明元数据是不同的编辑对象。
