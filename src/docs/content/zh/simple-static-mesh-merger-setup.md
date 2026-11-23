---
title: 打开工具并认识窗口
type: doc
slug: simple-static-mesh-merger-setup
draft: false
sitePublish: true
tags:
  - StaticMesh
  - 实例化
workIds:
  - simple-static-mesh-merger
docPage:
  work: simple-static-mesh-merger
  group: getting-started
  slug: setup
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-static-mesh-merger/docs/setup/
lang: zh
translationKey: doc:simple-static-mesh-merger:setup
---

## 打开 Static Mesh Merger

1. 打开 Unreal Engine 编辑器
2. 点击顶部菜单 `Window > Static Mesh Merger`
3. 编辑器会打开一个可停靠的工具面板。

## 识别工具栏按钮

如果只合并主关卡中的对象，先点 **Refresh** 查看分组。需要处理嵌套关卡时，先确认拆分范围，再用 **Break Level Instances**；想保留 LevelInstance 时可直接跳过拆分。

**Break Level Instances** 用于拆分场景中的 LevelInstance；**Refresh** 手动刷新预览；类型下拉框在 HISM 和 ISM 之间切换，默认为 HISM；**Merge Selected** 合并当前选中的分组。

![SimpleStaticMeshMerger 分组预览与实例列表](/media-occurrence/doc%3Asimple-static-mesh-merger%3Asetup%3Amedia%3A1)

左侧显示候选分组，右侧显示选中分组包含的 Actor。先检查筛选、实例数和勾选范围，再执行 Merge Selected。
