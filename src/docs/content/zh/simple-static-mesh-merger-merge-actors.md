---
title: 筛选并合并静态网格 Actor
type: doc
slug: simple-static-mesh-merger-merge-actors
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
  slug: merge-actors
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-static-mesh-merger/docs/merge-actors/
lang: zh
translationKey: doc:simple-static-mesh-merger:merge-actors
---

本指南介绍如何使用 SimpleStaticMeshMerger 插件合并静态网格体实例，优化场景性能。

## 兼容性

- Unreal Engine 5.2–5.8
- 版本 1.1.0（Version 2）

---

## 🛠️ 打开工具窗口

启用插件后，在编辑器菜单中找到工具入口：

### 步骤：

1. 打开 Unreal Engine 编辑器
2. 点击顶部菜单 `Window > Static Mesh Merger`
3. 工具窗口将作为可停靠面板打开

---

## 🎨 界面概览

工具窗口由三个主要区域组成：

### 1. 工具栏（顶部）

- **Break Level Instances**：递归拆分场景中所有 LevelInstance（包括嵌套的）
- **Refresh**：手动刷新合并预览
- **Type Dropdown**：选择合并类型（HISM 或 ISM，默认 HISM）
- **Merge Selected**：合并选中的分组

### 2. 配置选项（工具栏下方）

#### Mobility 过滤器（Filter）
- ☑ **Static**：包含静态对象
- ☑ **Stationary**：包含固定对象
- ☐ **Movable**：包含可移动对象
- 默认：勾选 Static + Stationary

#### Min Instance Count
- 范围：0 - 1000
- 默认：2（仅显示至少 2 个实例的分组，合并至少需要 2 个可勾选实例）
- 目的：过滤掉实例过少、优化收益极小的分组

### 3. 双面板布局

#### 左面板：合并分组预览
显示所有符合条件的合并分组，每个包含：
- ☑ **复选框**：选择参与合并的分组
- **分组名称**：使用第一个未排除实例的名称（动态更新）
- **实例详情**：显示"实例数 • 类型 • Mobility"（如 `5 Instances • HISM • Static`）

顶部功能：
- **搜索框**：按实例名称模糊搜索（分词 + 顺序匹配）
- **Select All**：批量勾选/取消当前显示的分组

#### 右面板：包含的 Actor
显示左面板选中分组中的所有实例：
- ☑ **复选框**：勾选表示包含在合并中，取消勾选表示排除
- **Actor 名称**：实例在场景中的标签
- **[⊙] 定位按钮**：点击跳转到场景中的 Actor 并在 Outliner 中选中

顶部功能：
- **Toggle All**：批量勾选/取消所有实例

---

## 🔍 搜索功能

### 搜索规则

支持**分词模糊搜索**，关键词必须按顺序出现：

**示例**：搜索 `SM 02`
- ✅ 匹配：`SM_Rock_02`（"SM" 在 "02" 前面）
- ✅ 匹配：`SM_000002`（"SM" 在 "02" 前面）
- ❌ 不匹配：`02_SM_Rock`（顺序错误）
- ❌ 不匹配：`Rock_02`（缺少 "SM"）

### 搜索行为

- **仅影响显示**：不修改数据，清空搜索框恢复所有分组
- **分组级过滤**：如果分组中有任意实例匹配，整个分组显示（包含所有实例）
- **合并限制**：仅合并当前显示且已勾选的分组

---

## ⚙️ 分组规则

插件自动将**属性完全相同**的 Actor 归入同一分组，包括：

1. **静态网格体**：使用的静态网格体资产
2. **Mobility**：Mobility 类型（Static/Stationary/Movable）
3. **完整碰撞设置**：
   - 碰撞启用类型（NoCollision/QueryOnly/PhysicsOnly 等）
   - 碰撞配置文件名
   - 碰撞对象类型
   - 所有 32 个碰撞通道的响应
4. **材质**：材质列表

**只有所有属性完全相同的 Actor 才会被合并到一个分组。**

---

## 🚀 使用工作流

### 基本合并流程

1. **打开工具**：`Window > Static Mesh Merger`
2. **（可选）拆分 LevelInstance**：点击 `Break Level Instances` 按钮
3. **配置过滤器**：
   - 勾选需要的 Mobility 类型
   - 设置最小实例数阈值
4. **查看预览**：左面板显示所有合并分组
5. **（可选）搜索过滤**：在搜索框输入关键词
6. **勾选分组**：
   - 点击 `Select All` 批量勾选
   - 或手动勾选要合并的分组
7. **（可选）排除实例**：
   - 点击左面板分组查看右侧实例列表
   - 取消勾选不想合并的实例
8. **执行合并**：点击 `Merge Selected` 按钮
9. **查看结果**：合并完成后自动选中新创建的 ISM/HISM Actor

### 进阶技巧

#### 精确控制合并对象
1. 使用搜索框缩小范围（如搜索 `Tree` 仅显示树相关分组）
2. 取消勾选不需要的分组
3. 进入右面板排除个别实例
4. 点击合并仅处理当前显示且已勾选的分组

#### 定位场景对象
- 点击右侧实例列表中的 `[⊙]` 按钮
- 编辑器视口跳转到该 Actor
- Outliner 同步选中

#### 自动取消勾选
排除实例导致可勾选数量 < 最小实例数时，分组自动取消勾选

---

## 📊 实例数规则

### 显示规则
- Actor 总数 >= 最小实例数

### 可勾选规则
- 可勾选 Actor 数 >= 最小实例数

### 合并执行
- 实际参与合并的 Actor 数 >= 最小实例数

**示例**（最小实例数 = 2）：
- 分组有 5 个实例
- 取消勾选 3 个实例
- 剩余 2 个可勾选实例
- **可以合并**（2 >= 2）

---

## ✅ 注意事项

### 合并规则
- 仅合并**主场景（PersistentLevel）**中的 Actor
- 不包含 LevelInstance 内部的 Actor（需先拆分）
- 所有属性必须相同才会归为一组

### 碰撞保留
- 完整复制碰撞配置文件
- 精确复制对象类型和所有 32 个通道响应
- 合并后碰撞行为与原始 Actor 一致

### 最小实例数
- 默认 2：至少需要 2 个实例才能合并
- 过滤掉实例过少的分组（优化收益极小）
- 可按需调整（范围 0-1000）

### 场景监控
- 自动监控 Actor 添加/删除（500ms 延迟后刷新）
- 切换地图时清空列表（需手动点击 Refresh）

### 状态缓存机制
- **排除列表持久化**：取消勾选的实例记录在排除列表中
- **刷新时保持状态**：点击 Refresh 或场景变化自动刷新**保留**排除状态
- **窗口级生命周期**：仅关闭并重新打开窗口时所有实例重置为默认勾选状态
- **使用场景**：可逐步调整排除实例，多次刷新验证结果而无需重复操作

### 合并后
- 自动选中所有新创建的 ISM/HISM Actor
- 视口跳转到第一个新创建的 Actor
- 原始 Actor 被销毁

---

## 🎯 性能优化建议

### 合并策略

1. **优先合并大量重复**：实例越多，优化效果越好
2. **分批合并**：使用搜索按类别合并（如先合并树，再合并石头）
3. **保留必要分组**：不要合并需要单独控制的对象

### HISM vs ISM

- **HISM**（默认推荐）：
  - 支持 LOD
  - 支持遮挡剔除
  - 大规模实例性能更好

- **ISM**：
  - 更简单轻量
  - 小规模实例开销更低

---

## 版本历史



打开 **编辑 → 项目设置**，进入 SimpleStaticMeshMerger 设置页，将 **Language** 设置为 **English** 或 **中文**。默认语言为英文。面向用户的界面、提示、通知和功能日志会立即更新，无需重启编辑器；公开 API 名称以及模块启动/关闭日志始终保持英文。

## 支持

如有使用问题或合作需求，请前往联系页面。

- **联系入口：** [联系与合作](https://mzsh.me/contact/)

## SimpleStaticMeshMerger 使用指南

通过窗口预览 StaticMeshActor 分组，筛选需要合并的对象，再生成实例化网格。

## 独立 Actor 与实例化组件的加载开销

大型场景首次加载时，大量独立 StaticMeshActor 的序列化、组件初始化和场景注册都可能产生开销。以下以重复树木比较两种组织方式。

### 1.1 独立Actor的加载开销

假设场景中有500棵相同的树，传统方式：

```cpp
// 场景中：500个AStaticMeshActor
for (int i = 0; i < 500; i++)
{
    AStaticMeshActor* Tree = SpawnActor<AStaticMeshActor>();
    Tree->SetStaticMesh(TreeMesh);
    Tree->SetActorLocation(Locations[i]);
}
```

**加载时引擎需要：**

1.  **反序列化500个UObject**（每个AStaticMeshActor + 每个UStaticMeshComponent）
2.  **创建500个Component**（每个都要初始化、注册到场景）
3.  **构建500次碰撞体**（即使碰撞配置相同，每个Component独立构建）
4.  **注册500次到渲染系统**（每个Component独立提交渲染数据）

**核心开销：**

-   独立 Actor 和组件的增加会带来更多序列化工作
-   Component初始化需要大量虚函数调用和场景注册
-   碰撞体重复构建（即使使用相同配置）
-   内存不连续，缓存命中率低

### 1.2 ISM/HISM的加载优势

使用HISM合并后：

```cpp
// 合并后：1个AStaticMeshActor + 1个UHierarchicalInstancedStaticMeshComponent
UHierarchicalInstancedStaticMeshComponent* HISM = CreateDefaultSubobject<UHierarchicalInstancedStaticMeshComponent>();
HISM->SetStaticMesh(TreeMesh);

for (int i = 0; i < 500; i++)
{
    HISM->AddInstance(FTransform(Locations[i])); // 只添加Transform数据
}
```

**加载时引擎需要：**

1.  **反序列化1个UObject**（1个AStaticMeshActor）
2.  **反序列化1个HISM Component + 500个Transform矩阵**（TArray形式）
3.  **处理实例组件的碰撞数据**
4.  **注册1次到渲染系统**（批量提交实例数据）
5.  **构建实例空间组织数据**（用于实例剔除）

**关键优化点：**

-   ✅ **UObject数量极大减少**：500个Actor → 1个Actor（序列化开销显著降低）
-   ✅ **Component数量极大减少**：500个Component → 1个Component（初始化开销显著降低）
-   ✅ **Transform数组序列化**：内存连续，加载效率高
-   ✅ **集中管理实例**：由实例化组件组织模型和变换数据
-   ✅ **批量组织渲染数据**：由实例化组件管理多个实例

这里的 500 棵树用于比较组织方式，代码是概念示例，包含依赖上下文的调用。序列化数量应分别看 Actor、组件和实例变换，不能把文中的数字当成整个场景的精确 UObject 总数；碰撞、剔除和内存收益还取决于配置与引擎版本。

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

## 手动合并的流程与属性风险

### 操作流程与属性处理

理论上，你可以手动创建ISM/HISM来优化场景：

1.  创建一个Actor，添加 `InstancedStaticMeshComponent` 或 `HierarchicalInstancedStaticMeshComponent`
2.  将场景中相同的StaticMeshActor的Transform一个个添加到ISM/HISM中
3.  删除原始的独立Actor

**直接用代码维护实例数组时，会遇到以下问题：**

**🔴 工作流程被破坏**

-   美术无法再自由摆放物体（必须通过代码添加实例）
-   调整位置需要修改Transform数组，效率极低
-   无法使用编辑器的标准工具（移动、旋转、复制）

**🔴 属性复制容易出错**

-   必须手动复制：Mobility、碰撞配置、材质、渲染设置等
-   遗漏任何一项都会导致合并后行为异常（如碰撞失效）
-   碰撞配置包括32个通道响应，极易出错

**🔴 场景复杂时工作量巨大**

-   假设场景有100种不同的Mesh，每种有几十到几百个实例
-   需要创建100个ISM/HISM Actor，手动分类数千个物体
-   每次场景调整都要重新手动合并

**🔴 LevelInstance无法处理**

-   场景中如果有嵌套的LevelInstance，手动拆分很费时
-   破开一个发现内部还有嵌套，需要反复操作

上面关于摆放与编辑的困难，针对直接用代码维护实例数组的工作方式，并不意味着所有实例化对象都无法在编辑器中调整。SimpleStaticMeshMerger 先按实际属性生成分组预览，允许人工筛选和排除，再执行合并；合并后仍需核对结果。

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

实例化可以减少独立 Actor 和组件数量，但数量变化不能直接换算成相同比例的性能提升。加载时间、内存占用和运行时帧率应在目标场景中测量。

- 保留可恢复的场景版本；合并会替换原 Actor。
- 检查各组的模型、材质、移动性和碰撞设置。
- 合并后查看实例数量，并检查场景表现。
- 实际加载时间、内存占用和帧率需要在目标项目中测量。

---

原文于 2025-11-09 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/19204715)。
