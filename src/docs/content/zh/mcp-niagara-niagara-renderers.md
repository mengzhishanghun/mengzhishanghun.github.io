---
title: 更换与配置 Niagara 渲染器
type: doc
slug: mcp-niagara-niagara-renderers
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-niagara
docPage:
  work: mcp-niagara
  group: features
  slug: niagara-renderers
  order: 5
documentKind: product-manual
websiteRoute: /zh/works/mcp-niagara/docs/niagara-renderers/
lang: zh
translationKey: doc:mcp-niagara:niagara-renderers
---

## 渲染器类型与属性

先检查目标 System，确认发射器名称唯一，并看清目前有哪些渲染器。要换类型时，`SetRendererType` 会用一次可撤销的操作替换该发射器上至多 64 个 Renderer。新 Renderer 会先成功创建再移除旧项，因此创建失败不会破坏现有配置。UE 5.2+ 的公共交集类型为 Sprite、Mesh、Ribbon、Light、Decal 和 Component；仅新版本提供的 Volume 不会无条件暴露。

`SetRendererProperties` 每次原子写入 1–64 个属性：所有名称和值先在临时 Renderer 上完成预校验，再一次性提交并逐项发送 PostEditChange，以触发绑定重建和必要的编译失效。仅允许可编辑的标量、枚举、字符串、名称、结构体及类型兼容的材质引用；容器、委托、非材质对象引用、临时、弃用和非编辑属性会被拒绝。只改某个 Renderer 的属性时，按当前列表确认它的 `RendererIndex`，该索引必须非负。若刚替换了类型，先重新读取 System 再定位。枚举、数量和类型限制可在工具输入 Schema 中查看。
