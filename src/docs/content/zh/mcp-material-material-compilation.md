---
title: 编译材质并检查诊断
type: doc
slug: mcp-material-material-compilation
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-material
docPage:
  work: mcp-material
  group: features
  slug: material-compilation
  order: 5
documentKind: product-manual
websiteRoute: /zh/works/mcp-material/docs/material-compilation/
lang: zh
translationKey: doc:mcp-material:material-compilation
---

## 编译结果

`CompileMaterial` 的 `AssetPath` 接受 Material 或 MaterialInstanceConstant。保存前检查 `CompileStatus`（`Success` 或 `Error`）和 `Errors` 数组。

| 返回字段 | 含义 |
| --- | --- |
| `AssetPath` | 保留请求中传入的路径。 |
| `AssetType` | 请求资产的类型，值为 `Material` 或 `MaterialInstanceConstant`。 |
| `ResourceOwnerPath` | 实际编译资源所属资产的完整对象路径，例如 `/Game/Materials/MI_Example.MI_Example`。 |

有静态置换的实例编译自身资源；没有静态置换的实例使用父链中的有效资源，其所属资产可能是父材质，也可能是祖先实例。`ResourceOwnerPath` 返回实际所属资产。编译前，请关闭请求资产和资源所属资产的编辑器。资源缺失时，返回 `CompileStatus: "Error"`、非空 `Errors` 和空字符串 `ResourceOwnerPath`；实例没有完整 shader map 时也返回编译错误。

如果编译报错，先用错误数组排查；实例出错时，也要看返回的资源所属路径是否指向父级。处理错误并重新编译后，再按[材质资产保存说明](/zh/works/mcp-material/docs/material-assets/)操作。
