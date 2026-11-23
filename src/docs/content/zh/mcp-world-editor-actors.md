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
  group: features
  slug: actors
  order: 6
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/actors/
lang: zh
translationKey: doc:mcp-world-editor:actors
---

## 确认 Actor 身份

`ListActors` 与 `GetSelectedActors` 返回 `ActorPath`、`FName`、`Label` 和 `LevelPath`。所有通过 `ActorName/ActorNames` 寻址现有 Actor 的工具都优先接受完整 `ActorPath`；旧的 Label/FName 只有在当前 World 中唯一命中时才会执行，多命中会拒绝操作并返回排序后的候选路径，避免对错误 Actor 进行选择、移动、属性修改或删除。例如，两个关卡各有一个同名 Actor 时，先根据 `LevelPath` 找到目标，再把该行的 `ActorPath` 传给编辑工具。Actor 重命名或移入其他关卡后，重新查询路径。

## 摆放模式

`PlaceActors` 用 `Mode=Ground`、`Surface`、`Grid`、`Bounds` 或 `Vertex` 与 `ActorNames`（最多 100 个精确路径或唯一名称）移动现有 Actor。Ground、Surface 向下射线探测，并将变换后包围盒底部落在命中面；`bAlignNormal` 可让 Surface 的局部 +Z 对齐法线。Grid 用 `GridSize` 对世界坐标枢轴取整。Bounds 以 `ReferenceActor` 为参照，按 `Axis`、`Side`、`Gap` 依次放置。Vertex 在 `SearchRadius` 和 `MaxVertices` 范围内，寻找 `ReferenceActor` 的指定静态网格 `ReferenceComponent`、`LOD` 上最近的顶点。`Mode=Array` 则复制 `SourceActor` `Count` 次（1–100），用 `Spacing`、各轴扰动和 `Seed` 控制世界变换。保存前查看返回的最终变换。

想挪动地图上的现有对象时，先选定位依据：落到表面、吸附网格、靠参照物排列，或者贴到指定网格的顶点。需要按间距复制时才选阵列；检查最终变换时，也在关卡里确认哪些是新副本。
