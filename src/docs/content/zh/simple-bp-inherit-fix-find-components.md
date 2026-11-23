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
  group: features
  slug: find-components
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-bp-inherit-fix/docs/find-components/
lang: zh
translationKey: doc:simple-bp-inherit-fix:find-components
---

## 可识别的异常

先打开出现异常的父、子 Actor 蓝图，对照同一组件。如果子蓝图里的操作影响了父蓝图，核对父级组件模板是否跟着变了，再决定是否运行修复。

下面两种表现值得检查：

-   **父蓝图中，组件的「剪切 / 删除」菜单变灰**：组件属于父类，却无法从这里删除。
-   **子蓝图修改组件属性后，改动写回父蓝图**：即使只是勾选一个 bool，也可能影响父模板，子类修改没有被正常隔离。

## 扫描范围

扫描整条继承链时，可以从两个方向收集蓝图：

-   **向上**：从锚点蓝图的 `ParentClass` 一层一层走到顶，收集所有作为父类的蓝图
-   **向下**：用 UE 的 `AssetRegistry.GetDerivedClassNames()` 拿到所有派生的蓝图类

合并这两个集合并去重后，就得到要检查的继承链范围。

## SCS 与 ICH 两处组件记录

蓝图的继承组件信息存在两个位置，必须都查：

-   **SCS 节点**（`SimpleConstructionScript.AllNodes`）：蓝图直接定义的组件
-   **ICH 记录**（`InheritableComponentHandler.CreateRecordIterator()`）：子蓝图对继承自父类的组件所做的 override 记录

对每个蓝图同时扫描这两处，定位 `CreationMethod == Instance` 的记录。

## CreationMethod 字段

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

## 异常的触发条件

具体触发操作未形成稳定复现路径，因此不能仅凭相似症状断定原因，仍需检查组件模板的 `CreationMethod` 字段状态。已出现的异常可能持续存在，保存后也不会自行恢复。
