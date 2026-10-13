---
title: SimpleBPInheritFix
description: 针对 Actor 蓝图继承链中组件状态污染的问题，扫描继承链并执行修复。
type: work
slug: simple-bp-inherit-fix
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
order: 13
status: 正式文档
featured: false
draft: false
sitePublish: false
tags:
  - 蓝图
  - 继承链
links:
  - label: GitHub
    href: https://github.com/MZSH-UEPlugins/SimpleBPInheritFix
lang: zh
translationKey: simple-bp-inherit-fix
---

## 作品简介

SimpleBPInheritFix 是处理 Actor 蓝图继承链中组件状态异常的编辑器插件。

当组件的创建方式被错误标记为 Instance 时，父类组件可能失去正常的剪切、删除入口，也可能出现子类修改影响父类的现象。插件以受影响蓝图为入口，检查其所在继承链，定位这一类污染并修正组件的创建方式。

## 背景与目标

这类问题发生在多个有继承关系的蓝图之间，单看当前蓝图难以确定异常源头。只修复正在打开的资产，也可能遗漏祖先或后代中的同类状态。

因此，工具沿完整继承链扫描、签出和修复，使用者可在日志中核对需要处理的组件与资产范围。它针对的是明确的组件状态问题，不承担一般蓝图错误排查。

## 核心能力

### 继承链扫描与定位

从链中的受影响 Actor 蓝图出发，覆盖祖先、当前蓝图和后代，检查其中的组件状态。日志会列出检查阶段、发现的异常组件及其所属蓝图，便于判断实际命中范围。

未发现目标状态时，不应把其他组件故障解释为已经修复。

### 定向修复与资产保存

对命中的组件，修正 CreationMethod 中的 Instance 状态，使其回到 SimpleConstructionScript。修复前会尝试处理版本控制签出，修复后将相关蓝图标为待保存；保存动作仍需在编辑器中完成。

签出失败时，内存中的修复并不等于磁盘资产已更新，应先解决可写状态并核对保存结果。

## 适用场景

适合排查 Actor 蓝图继承后组件无法正常编辑，或子类操作牵连父类的情况。

对有多级父子蓝图的项目，链式扫描有助于确认问题所在的资产，日志和待保存列表也为修改前后的版本控制检查提供线索。

## 适用范围与边界

插件只处理 CreationMethod 被标为 Instance 的这类组件污染；Construction Script 动态创建的组件和非 Actor 蓝图不在扫描范围。

修复可能涉及多份蓝图资产，使用者需要检查日志、签出状态和最终保存内容。其他类型的继承、编译或组件问题，仍需分别诊断。
