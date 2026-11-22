---
title: 检查继承组件异常
type: doc
slug: simple-bp-inherit-fix-find-components
draft: false
sitePublish: true
tags:
  - 蓝图
  - 继承链
workIds:
  - simple-bp-inherit-fix
docPage:
  work: simple-bp-inherit-fix
  group: workflows
  slug: find-components
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-bp-inherit-fix/docs/find-components/
lang: zh
translationKey: doc:simple-bp-inherit-fix:find-components
---

**支持的虚幻引擎版本**：5.2–5.8

一键修复 Actor 蓝图继承链组件污染 Bug。

> ⚠️ 此插件会修改继承链上的多个蓝图。修改是保守的，但在提交到版本控制前，请确认自动签出的文件是否符合预期。

---

## SimpleBPInheritFix 使用指南

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
