---
title: 定位与摆放 Actor
type: doc
slug: mcp-world-editor-actors
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
docPage:
  work: mcp-world-editor
  group: actors
  slug: actors
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/actors/
lang: zh
translationKey: doc:mcp-world-editor:actors
---

## 确认 Actor 身份

`ListActors` 与 `GetSelectedActors` 返回 `ActorPath`、`FName`、`Label` 和 `LevelPath`。所有通过 `ActorName/ActorNames` 寻址现有 Actor 的工具都优先接受完整 `ActorPath`；旧的 Label/FName 只有在当前 World 中唯一命中时才会执行，多命中会拒绝操作并返回排序后的候选路径，避免对错误 Actor 进行选择、移动、属性修改或删除。Actor 被重命名或移入其他关卡后路径会变化，调用方应重新查询。

## 摆放模式

`PlaceActors` 用 `Mode=Ground`、`Surface`、`Grid`、`Bounds` 或 `Vertex` 与 `ActorNames`（最多 100 个精确路径或唯一名称）移动现有 Actor。Ground、Surface 向下射线探测，并将变换后包围盒底部落在命中面；`bAlignNormal` 可让 Surface 的局部 +Z 对齐法线。Grid 用 `GridSize` 对世界坐标枢轴取整。Bounds 以 `ReferenceActor` 为参照，按 `Axis`、`Side`、`Gap` 依次放置。Vertex 在 `SearchRadius` 和 `MaxVertices` 范围内，寻找 `ReferenceActor` 的指定静态网格 `ReferenceComponent`、`LOD` 上最近的顶点。`Mode=Array` 则复制 `SourceActor` `Count` 次（1–100），用 `Spacing`、各轴扰动和 `Seed` 控制世界变换。保存前查看返回的最终变换。
