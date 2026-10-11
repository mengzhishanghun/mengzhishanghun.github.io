---
title: SimpleStaticMeshMerger 使用指南
description: 预览并筛选 StaticMeshActor 分组，将选中的对象组织为 ISM/HISM 实例。
type: doc
slug: simple-static-mesh-merger-guide
categoryId: ue-tools
categoryName: UE工具
categoryOrder: 0
order: 0
status: 正式文档
date: 2025-11-09
draft: false
sitePublish: false
tags:
  - SimpleStaticMeshMerger
  - UE工具
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19204715
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/19204715
workIds:
  - simple-static-mesh-merger
lang: zh
translationKey: doc:simple-static-mesh-merger-guide:supplement:1
---

# SimpleStaticMeshMerger 使用指南

通过窗口预览 StaticMeshActor 分组，筛选需要合并的对象，再生成实例化网格。

## 功能与筛选项

**1\. 处理 LevelInstance**

点击 `Break Level Instances` 按钮：

-   自动递归破除所有嵌套LevelInstance
-   实时显示处理进度（Breaking: \[名称\]）
-   完成后自动刷新合并预览

**2\. 分组预览**

插件会自动将场景中的StaticMeshActor按以下属性**严格分组**：

-   Mesh（相同模型）
-   Mobility（Static/Stationary/Movable）
-   完整碰撞配置（Profile + ObjectType + 32通道响应）
-   Materials（所有槽位材质）

**3\. 实时过滤与排除**

-   **Mobility筛选**：只显示Static/Stationary/Movable的Actor
-   **最小实例数**：过滤掉实例数过少的组（默认2，即至少3个才合并）
-   **Actor排除**：右侧列表可取消勾选不需要合并的Actor

**4\. 合并选中对象**

点击 `Merge Selected` 按钮：

-   自动创建HISM/ISM Actor
-   复制碰撞、材质与移动性设置
-   删除原始Actor
-   自动选中并跳转到新创建的Actor

## 操作步骤

```
工作流程：
1. Window → Static Mesh Merger（打开插件窗口）
2. 点击 Break Level Instances（如果场景中有LevelInstance）
3. 配置筛选条件：
   ☑ Static  ☑ Stationary  ☐ Movable
   Min Instance Count: 2
4. 左侧勾选要合并的组
5. 右侧排除不需要的Actor（可选）
6. 点击 Merge Selected
7. 完成！自动跳转到新创建的HISM Actor
```

**合并前：**

```
Scene Outliner
├── TreeActor_1
├── TreeActor_2
├── TreeActor_3
├── ...
└── TreeActor_125  (125个独立Actor)
```

**合并后：**

```
Scene Outliner
└── MergedActor_SM_Tree_01 (1个HISM Actor，包含125个实例)
```

## 操作前后检查

- 保留可恢复的场景版本；合并会替换原 Actor。
- 检查各组的模型、材质、移动性和碰撞设置。
- 合并后查看实例数量，并检查场景表现。
- 实际加载时间和帧率需要在目标项目中测量。

---

原文于 2025-11-09 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/19204715)。
