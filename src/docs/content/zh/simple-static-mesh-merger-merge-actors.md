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
  group: features
  slug: merge-actors
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-static-mesh-merger/docs/merge-actors/
lang: zh
translationKey: doc:simple-static-mesh-merger:merge-actors
---

## 合并范围与分组条件

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

工具只合并主关卡 `PersistentLevel` 中的 Actor。若要合并 LevelInstance 内的对象，先按拆分章节展开。

## 按移动性和实例数筛选

- ☑ **Static**：包含静态对象
- ☑ **Stationary**：包含固定对象
- ☐ **Movable**：包含可移动对象
- 默认：勾选 Static + Stationary

在 `Min Instance Count` 中设置阈值，范围为 0–1000，默认 2。组内总数影响分组是否显示，可参与合并的实例数影响是否可勾选，执行时还会检查实际参与数。恰好等于阈值时能否合并，以当前发布版本的预览和执行结果为准。

## 预览分组、搜索和定位实例

显示所有符合条件的合并分组，每个包含：

- ☑ **复选框**：选择参与合并的分组
- **分组名称**：使用第一个未排除实例的名称（动态更新）
- **实例详情**：显示"实例数 • 类型 • Mobility"（如 `5 Instances • HISM • Static`）

顶部功能：

- **搜索框**：按实例名称模糊搜索（分词 + 顺序匹配）
- **Select All**：批量勾选/取消当前显示的分组

显示左面板选中分组中的所有实例：

- ☑ **复选框**：勾选表示包含在合并中，取消勾选表示排除
- **Actor 名称**：实例在场景中的标签
- **[⊙] 定位按钮**：点击跳转到场景中的 Actor 并在 Outliner 中选中

- **Toggle All**：批量勾选/取消所有实例

支持**分词模糊搜索**，关键词必须按顺序出现：

**示例**：搜索 `SM 02`

- ✅ 匹配：`SM_Rock_02`（"SM" 在 "02" 前面）
- ✅ 匹配：`SM_000002`（"SM" 在 "02" 前面）
- ❌ 不匹配：`02_SM_Rock`（顺序错误）
- ❌ 不匹配：`Rock_02`（缺少 "SM"）

- **仅影响显示**：不修改数据，清空搜索框恢复所有分组
- **分组级过滤**：如果分组中有任意实例匹配，整个分组显示（包含所有实例）
- **合并限制**：仅合并当前显示且已勾选的分组

排除实例后，若可参与数量低于阈值，分组会自动取消勾选。

## 刷新与保留排除状态

- 自动监控 Actor 添加/删除（500ms 延迟后刷新）
- 切换地图时清空列表（需手动点击 Refresh）

- **排除列表持久化**：取消勾选的实例记录在排除列表中
- **刷新时保持状态**：点击 Refresh 或场景变化自动刷新**保留**排除状态
- **窗口级生命周期**：仅关闭并重新打开窗口时所有实例重置为默认勾选状态
- **使用场景**：可逐步调整排除实例，多次刷新验证结果而无需重复操作

## 执行合并与检查结果

点击 **Merge Selected** 前再看一遍右侧实例列表。搜索命中一个 Actor 就会显示整组；如果只想合并其中几项，在右侧逐一排除要保留的 Actor。

合并会替换原 Actor，先保留可恢复的场景版本。核对分组的模型、材质、移动性和碰撞，再按下方示例完成筛选与勾选，点击 **Merge Selected**。插件会复制整套碰撞设置，包括对象类型和 32 个通道响应。完成后，编辑器会选中新 Actor 并跳到第一个。检查实例数、材质、碰撞和场景表现，再保存关卡。

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

## 选择 ISM 或 HISM

1. **优先合并大量重复**：实例越多，优化效果越好
2. **分批合并**：使用搜索按类别合并（如先合并树，再合并石头）
3. **保留必要分组**：不要合并需要单独控制的对象

- **HISM**（默认推荐）：
  - 支持 LOD
  - 支持遮挡剔除
  - 大规模实例性能更好

- **ISM**：
  - 更简单轻量
  - 小规模实例开销更低

## 加载开销与实测指标

大型场景首次加载时，大量独立 StaticMeshActor 的序列化、组件初始化和场景注册都可能产生开销。以下以重复树木比较两种组织方式。

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

1.  **反序列化 500 组 Actor 和组件**（每棵树分别有一个 AStaticMeshActor 和一个 UStaticMeshComponent）
2.  **创建500个Component**（每个都要初始化、注册到场景）
3.  **构建500次碰撞体**（即使碰撞配置相同，每个Component独立构建）
4.  **注册500次到渲染系统**（每个Component独立提交渲染数据）

**核心开销：**

-   独立 Actor 和组件的增加会带来更多序列化工作
-   Component初始化需要大量虚函数调用和场景注册
-   碰撞体重复构建（即使使用相同配置）
-   内存不连续，缓存命中率低

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

Actor 数量减少并不代表性能按同样比例提升。请在目标场景中测量加载时间、内存占用和帧率。

## 手动合并的属性检查

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
