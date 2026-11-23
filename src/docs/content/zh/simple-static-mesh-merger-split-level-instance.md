---
title: 拆分 LevelInstance
type: doc
slug: simple-static-mesh-merger-split-level-instance
draft: false
sitePublish: true
tags:
  - StaticMesh
  - 实例化
workIds:
  - simple-static-mesh-merger
docPage:
  work: simple-static-mesh-merger
  group: features
  slug: split-level-instance
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/simple-static-mesh-merger/docs/split-level-instance/
lang: zh
translationKey: doc:simple-static-mesh-merger:split-level-instance
---

## 递归拆分与刷新预览

拆分会改动整个场景，操作前先保留一份可恢复的关卡版本。进度结束后，先在 Outliner 检查拆出的 Actor 和被移除的重复项，再查看合并预览。

点击 `Break Level Instances` 递归拆分场景中所有 LevelInstance：

- ✅ 自动处理嵌套 LevelInstance
- ✅ 智能去重（相同路径的重复实例被删除）
- ✅ 显示拆分进度和当前处理的对象
- ✅ 每轮迭代后 UI 自动刷新

## 首次拆分和重复路径的处理

| 场景 | 处理方式 | 结果 |
|------|---------|------|
| 首次遇到路径 | 加入缓存 → 拆分 | 内容移至主场景 |
| 同级重复 | 检测 → 删除 | 避免重复内容 |
| 嵌套重复 | 检测 → 删除 | 避免循环引用 |
