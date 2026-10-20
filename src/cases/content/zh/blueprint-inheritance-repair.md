---
title: 修复蓝图继承中的组件状态污染
description: 沿继承链检查组件模板的 CreationMethod，处理子类属性修改影响父类的问题。
type: case
slug: blueprint-inheritance-repair
categoryId: ue-projects
categoryName: UE项目
categoryOrder: 0
order: 7
status: 已完成
featured: false
draft: false
sitePublish: true
tags:
  - 蓝图
  - 继承链
  - 组件修复
coverAlt: 父子蓝图组件模板的继承扫描与 CreationMethod 修正流程
websiteCoverUrl: /assets/cases/blueprint-inheritance-repair.png
lang: zh
translationKey: blueprint-inheritance-repair
---

## 背景介绍

在 Actor 蓝图继承的排障中，我记录了一类组件状态异常：父蓝图中的组件无法正常删除，子蓝图修改组件属性后，改动还会影响父蓝图。

这项工作从组件模板和继承关系入手，找出异常记录并修正创建方式，避免只处理当前看到的一个蓝图。

## 复现环境

问题涉及 Unreal Engine 的 Actor 蓝图、SimpleConstructionScript（SCS）与 InheritableComponentHandler（ICH）。前者保存蓝图直接定义的组件，后者保存子蓝图对继承组件的覆盖记录。

蓝图资产也可能处于源码控制下，修复时需要确认相关 .uasset 是否可写。

## 具体问题

父蓝图里，原本属于自身的组件出现剪切或删除菜单不可用；子蓝图里，即使只是修改一个属性，也可能写回父模板，失去预期的覆盖隔离。

## 解决方案

`CreationMethod` 的四种值对应不同创建来源：

| 值 | 创建来源 |
| --- | --- |
| `Native` | C++ 原生创建的组件 |
| `SimpleConstructionScript` | 蓝图 Components 面板定义的组件 |
| `UserConstructionScript` | Construction Script 中创建的组件 |
| `Instance` | 添加到具体 Actor 实例的组件 |

这里检查的是蓝图组件模板被错误标成 `Instance` 的特定异常。手动修复的难点在于同一继承关系可能同时涉及 SCS 节点和 ICH 覆盖记录，多层父子蓝图也可能有异常，而属性面板不能直接修改这个字段；源码控制下还需要逐份处理资产可写性。

扫描向上沿 `ParentClass` 收集父蓝图，向下用 Asset Registry 的 `GetDerivedClassNames()` 查找派生类。组件检查覆盖 SCS 的 `AllNodes` 和 ICH 的 `CreateRecordIterator()`，不能只改当前打开的模板。

排查发现，这类异常与组件模板的 `CreationMethod` 被设为 `Instance` 有关。具体触发操作未形成稳定复现路径，因此不能仅凭相似症状断定原因，仍需检查字段状态。

以受影响蓝图为锚点，向上收集父蓝图，向下收集派生蓝图，合并去重后形成检查范围。这样可以同时检查父模板和子类覆盖记录。

对每个蓝图分别扫描 SCS 与 ICH，定位 `CreationMethod == Instance` 的异常组件模板。确认发现项后，再签出涉及的资产，将对应字段恢复为 `SimpleConstructionScript`。

修改完成后，把受影响蓝图标记为脏，交由使用者核对并保存。Construction Script 动态创建的组件需要单独判断，不直接套用同样的修复规则。

## 最终总结

整理出的处理流程包括继承链收集、双位置扫描、资产签出、字段修正与待保存标记，明确了这类问题的检查和修复范围。

这套流程针对组件模板创建方式异常。处理相似症状时，应先核对组件记录，再决定是否采用相同修复。
