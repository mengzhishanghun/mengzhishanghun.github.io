---
title: SimpleStaticMeshMerger
description: 预览并筛选 StaticMeshActor 分组，将选中的对象组织为 ISM/HISM 实例。
type: work
slug: simple-static-mesh-merger
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
order: 9
status: 正式文档
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/zh-cn/listings/bc2a9439-c5d4-4815-9694-8920661f10b5
    - kind: docs
      href: /docs/zh/guides/ue-tools/simple-static-mesh-merger-guide/
  compatibility:
    - platforms:
        - Windows (Win64)
        - macOS
        - Linux
      requirements:
        - UE 5.2–5.8
featured: false
draft: false
sitePublish: false
tags:
  - StaticMesh
  - 实例化
  - Simple 系列
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19204715
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/19204715
docIds:
  - simple-static-mesh-merger-guide
websiteCoverUrl: /assets/covers/simple-static-mesh-merger.png
sourceDate: 2025-11-09
lang: zh
translationKey: simple-static-mesh-merger
---

## 作品简介

SimpleStaticMeshMerger 用于整理关卡中重复出现的 StaticMeshActor。它先把可合并对象按网格、材质、移动性和碰撞配置分组，供开发者预览与筛选，再将选中的对象组织为 ISM/HISM 实例。

工具针对关卡中的实际 Actor 分组，方便在修改场景前核对结果，避免只按网格名称批量替换。

## 背景与目标

一个场景可能摆放大量使用相同模型的独立 Actor。是否能放进同一实例组，还取决于材质槽、移动性和碰撞行为。这个工具把这些条件放到同一预览里，帮助关卡制作人员找出需要合并的重复对象，并保留人工排除个别 Actor 的机会。

实例化后应以目标项目中的加载与帧率测量评估效果；对象数量减少本身不等于性能按固定比例提升。

## 核心能力

### 处理嵌套场景并刷新预览

支持递归拆分嵌套 LevelInstance，并刷新场景对象的合并预览。

### 严格分组与人工筛选

按网格、材质、移动性和完整碰撞设置分组。可通过预览筛选分组，并排除不应合并的个别 Actor。

### 生成实例化对象

执行合并后，工具创建 ISM/HISM Actor，复制相关材质、移动性和碰撞设置，删除参与合并的原 Actor，并选中新生成的对象供检查。

可从场景层级和实例数量确认结果，再检查视觉表现和碰撞是否符合预期。

## 适用场景

适用于同一关卡中大量重复放置静态网格、希望先按实际属性筛选再进行实例化整理的场景。对混有不同材质或碰撞设置的对象，预览分组与逐项排除比直接按模型名称处理更容易核对范围。

## 适用范围与边界

合并会替换场景中的原 Actor，应先保留可恢复的关卡版本，并在结果中检查材质、移动性、碰撞和实例数量。

是否改善加载或运行表现取决于具体场景与目标设备，需要实测；工具的分组预览不能替代合并后的项目验收。

场景分组、合并步骤与加载开销说明见 [使用教程](/zh/docs/guides/ue-tools/simple-static-mesh-merger-guide/)。
