---
title: SimpleBPInheritFix 使用指南
description: 使用 Actor 蓝图右键入口检查组件继承异常，并处理签出、日志与保存。
type: doc
slug: simple-bp-inherit-fix-guide
categoryId: ue-tools
categoryName: UE工具
categoryOrder: 0
order: 0
status: 正式文档
date: 2026-05-13
draft: false
sitePublish: false
tags:
  - SimpleBPInheritFix
  - UE工具
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/20030737
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/20030737
workIds:
  - simple-bp-inherit-fix
lang: zh
translationKey: doc:simple-bp-inherit-fix-guide:supplement:1
---

# SimpleBPInheritFix 使用指南

SimpleBPInheritFix 用于处理 Actor 蓝图继承链中特定的组件状态异常。

插件的用途与适用场景见 [SimpleBPInheritFix 作品页](/zh/works/simple-bp-inherit-fix/)。

## 适合检查的组件异常

在 UE 的 Actor 蓝图继承中，有时会出现这样的组件异常：

-   **父蓝图中，组件的「剪切 / 删除」菜单变灰**：组件属于父类，却无法从这里删除。
-   **子蓝图修改组件属性后，改动写回父蓝图**：即使只是勾选一个 bool，也可能影响父模板，子类修改没有被正常隔离。

## 组件模板为什么会异常

### 1.1 根本原因

UE 的 `UActorComponent` 用 `CreationMethod` 字段记录组件的创建方式：

| 枚举值 | 含义 |
| --- | --- |
| `Native` | 在 C++ 构造函数里创建的组件 |
| `SimpleConstructionScript` | 通过蓝图编辑器的 Components 面板添加的组件（**正常的蓝图组件**） |
| `UserConstructionScript` | 在 ConstructionScript 节点里动态创建的 |
| `Instance` | 运行时添加到具体 Actor 实例上的组件（**不应该出现在蓝图模板里**） |

**Bug 的本质**：某些未知操作会让蓝图的组件模板（`ComponentTemplate`）的 `CreationMethod` 被错误设为 `Instance`。一旦变成 `Instance`，UE 编辑器就认为它不是"蓝图自己定义的组件"，于是：

-   父蓝图里的 Cut / Delete 菜单项走不同分支而被灰
-   子类的属性修改被当作"实例级修改"写回父模板（而不是在子类里产生 override）

### 1.2 为什么会触发

具体触发操作未形成稳定复现路径，因此不能仅凭相似症状断定原因，仍需检查组件模板的 `CreationMethod` 字段状态。已出现的异常可能持续存在，保存后也不会自行恢复。

### 1.3 手动修复的麻烦

修复需要把异常的 `CreationMethod` 改回 `SimpleConstructionScript`，但还要检查以下几处：

1.  **组件可能同时出现在 SCS 节点和 ICH 记录里**（下文分别说明），两个位置都要改
2.  **继承链上多层蓝图可能同时中招**，只改一个没用
3.  **子类蓝图**（用当前蓝图做父类的那些）也可能被污染，需要一起修
4.  **源码控制下的文件默认只读**，需要逐个签出

属性面板无法直接修改这个字段，需要通过脚本处理，并了解组件在蓝图内部的存放位置。

## 操作步骤

1.  安装插件，编译通过
2.  Content Browser 里右键任意受影响的 Actor 蓝图
3.  选择 **Component Repair → Fix Inheritance Pollution**
4.  打开 Output Log，过滤 `LogSBIF`，查看执行情况
5.  编辑器弹出保存对话框，**保存被标脏的蓝图** 即完成

## 扫描继承链与组件记录

### 继承链扫描范围

扫描整条继承链时，可以从两个方向收集蓝图：

-   **向上**：从锚点蓝图的 `ParentClass` 一层一层走到顶，收集所有作为父类的蓝图
-   **向下**：用 UE 的 `AssetRegistry.GetDerivedClassNames()` 拿到所有派生的蓝图类

合并这两个集合并去重后，就得到要检查的继承链范围。

### SCS 与 ICH 两处组件记录

蓝图的继承组件信息存在两个位置，必须都查：

-   **SCS 节点**（`SimpleConstructionScript.AllNodes`）：蓝图直接定义的组件
-   **ICH 记录**（`InheritableComponentHandler.CreateRecordIterator()`）：子蓝图对继承自父类的组件所做的 override 记录

对每个蓝图同时扫描这两处，定位 `CreationMethod == Instance` 的记录。

## 修复阶段

修复前先收集继承链并确认受影响组件，再处理版本控制签出、字段修改和保存。

| 阶段 | 动作 |
| --- | --- |
| 1\. **GatherChain** | 收集继承链（父类 + 自身 + 子类） |
| 2\. **ScanChain** | 扫描每个蓝图的 SCS + ICH，找出所有 `CreationMethod=Instance` 的记录 |
| 3\. **CheckOutFindings** | 通过源码控制签出涉及的 uasset |
| 4\. **ApplyFindings** | 将 `CreationMethod` 从 `Instance` 翻转为 `SimpleConstructionScript` |
| 5\. **MarkDirty** | 将改动过的蓝图标记为脏，提示用户手动保存 |

完整日志大致长这样：

```
[SBIF] ==============================================
[SBIF]  Fix Inheritance Pollution started (anchor: BP_MyActor)
[SBIF] ==============================================
[SBIF] -------- Stage 1 / Gather Inheritance Chain --------
[SBIF]   Self: BP_MyActor
[SBIF]   Ancestor: BP_BaseActor
[SBIF]   Descendant: BP_MyActorExt
[SBIF]   Total 3 blueprints (ancestors+self 2 / descendants 1)
[SBIF] -------- Stage 2 / Scan Instance-corrupted Nodes --------
[SBIF]   [BP_BaseActor / SCS] 'MeshComp'  (Template=MeshComp_GEN_VARIABLE)
[SBIF]   Scan complete: 1 Instance-corrupted nodes total
[SBIF] -------- Stage 3 / SourceControl CheckOut --------
[SBIF]   ✅ [BP_BaseActor]  /Content/BP_BaseActor.uasset
[SBIF] -------- Stage 4 / Repair CreationMethod --------
[SBIF]   [BP_BaseActor / SCS] 'MeshComp'  Instance -> SimpleConstructionScript
[SBIF] -------- Stage 5 / Mark Blueprints Dirty --------
[SBIF]   Dirty: BP_BaseActor
[SBIF]   1 blueprints marked dirty, manual save required
```

## 常见问题

### 扫描结果 0 条但确有污染？

扫描结果为 0 时，需要结合 `LogSBIF` 日志判断是否属于此工具处理的组件状态异常。

### CheckOut 失败怎么办？

插件仍会完成内存修复，但保存前需要手动处理签出。常见原因：

-   文件被他人锁定
-   源控制服务器不通
-   Workspace mapping 不包含该文件

先手动解决签出，再回 UE 保存。

### 会不会把正常组件改坏？

工具的修复范围是：**只翻转 `CreationMethod` 这一个字段**（`Instance → SimpleConstructionScript`），其他任何属性都不动。保存前仍需检查受影响蓝图的组件状态。

### 锚点蓝图选错会有影响吗？

入口蓝图用于定位继承链；扫描会覆盖祖先、当前蓝图与后代。

### 非 Perforce 能用吗？

-   **Git**：签出基本是空操作，文件本就可写
-   **Git LFS**：会自动请求 LFS lock
-   **SVN**：执行 `svn lock`
-   **无源码控制**：签出阶段整个跳过，直接进入修复

## 使用范围

这里讨论的是 Actor 蓝图组件模板的 CreationMethod 异常，不涵盖其他蓝图故障。Construction Script 中动态创建的组件需要单独判断，不能直接套用相同修复逻辑。

-   只处理本插件覆盖的那种组件异常（`CreationMethod=Instance` 污染），其他类型的蓝图问题不在范围内
-   Construction Script 里动态生成的组件不在扫描范围（那些本就不走 SCS/ICH）
-   仅支持 Actor 蓝图（非 Actor 的蓝图不存在此问题）

---

原文于 2026-05-13 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/20030737)。
