---
title: 拆分 Level Instance
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
  group: workflows
  slug: split-level-instance
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/simple-static-mesh-merger/docs/split-level-instance/
lang: zh
translationKey: doc:simple-static-mesh-merger:split-level-instance
---

## 🏗️ 拆分 LevelInstance

### 功能

点击 `Break Level Instances` 递归拆分场景中所有 LevelInstance：

- ✅ 自动处理嵌套 LevelInstance
- ✅ 智能去重（相同路径的重复实例被删除）
- ✅ 实时进度通知（滚动显示当前项目）
- ✅ 每轮迭代后 UI 自动刷新

### 处理策略

| 场景 | 处理方式 | 结果 |
|------|---------|------|
| 首次遇到路径 | 加入缓存 → 拆分 | 内容移至主场景 |
| 同级重复 | 检测 → 删除 | 避免重复内容 |
| 嵌套重复 | 检测 → 删除 | 避免循环引用 |

---
