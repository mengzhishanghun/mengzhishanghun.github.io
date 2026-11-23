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
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/listings/320c7471-92b8-4a3e-a88a-2a5fcb98d620
    - kind: docs
      href: /zh/works/simple-bp-inherit-fix/docs/quickstart/
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
  - 蓝图
  - 继承链
  - Simple 系列
links:
  - label: GitHub
    href: https://github.com/MZSH-UEPlugins/SimpleBPInheritFix
docIds:
  - simple-bp-inherit-fix-quickstart
  - simple-bp-inherit-fix-find-components
  - simple-bp-inherit-fix-repair-components
coverAlt: SimpleBPInheritFix封面
websiteCoverUrl: /media/covers/works/simple-bp-inherit-fix-20261101.webp
lang: zh
translationKey: simple-bp-inherit-fix
---

## 作品简介

SimpleBPInheritFix 是处理 Actor 蓝图继承链中组件状态异常的编辑器插件。

当组件的创建方式被错误标记为 Instance 时，父蓝图中的剪切、删除菜单可能变灰，子蓝图的修改也可能写回父蓝图。插件以受影响蓝图为入口，检查其所在继承链，定位这一类污染并修正组件的创建方式。

## 背景与目标

这类问题发生在多个有继承关系的蓝图之间，单看当前蓝图难以确定异常源头。只修复正在打开的资产，也可能遗漏祖先或后代中的同类状态。

工具沿完整继承链扫描、签出和修复，使用者可以通过日志核对涉及的组件和资产。它只处理这一类组件状态异常，不负责一般蓝图错误排查。

## 核心能力

### 继承链扫描与定位

从受影响的 Actor 蓝图出发，检查祖先、当前蓝图和后代的组件状态。日志会列出检查阶段、异常组件及其所属蓝图，便于核对实际受影响的范围。

如果没有找到异常标记，请继续排查组件问题。

### 定向修复与资产保存

对检查出的异常组件，将 CreationMethod 从 Instance 改回 SimpleConstructionScript。修复前会尝试签出相关资产，修复后把蓝图标为待保存；仍需在编辑器中手动保存。

签出失败时，内存中的修复并不等于磁盘资产已更新，应先解决可写状态并核对保存结果。

## 适用场景

适合排查 Actor 蓝图继承后组件无法正常编辑，或子类操作牵连父类的情况。

项目包含多级父子蓝图时，可以先通过继承链扫描确认涉及哪些资产，再对照日志和待保存列表检查版本控制差异。

## 使用流程

例如，子蓝图修改网格组件后，父蓝图的组件也变了。可以从子蓝图运行修复，再在日志里确认问题是否出在父级组件模板。

1. 安装插件并确认编译成功。在内容浏览器中右键单击受影响的 Actor 蓝图，选择 **Component Repair → Fix Inheritance Pollution**。
2. 在输出日志中筛选 `LogSBIF`，查看发现了哪些异常、涉及哪些蓝图，以及签出和修复是否成功。
3. 核对待保存的蓝图后手动保存；如果签出失败，先解决文件的写入权限。

## 适用范围与边界

插件只处理 CreationMethod 被标为 Instance 的这类组件污染；Construction Script 动态创建的组件和非 Actor 蓝图不在扫描范围。

修复可能涉及多份蓝图资产，使用者需要检查日志、签出状态和最终保存内容。其他类型的继承、编译或组件问题，仍需分别诊断。

操作步骤和签出处理见[修复继承组件](/zh/works/simple-bp-inherit-fix/docs/repair-components/)。

## 技术说明

CreationMethod、继承链与 SCS / ICH 的排查和修复原理见[使用文档](/zh/works/simple-bp-inherit-fix/docs/find-components/)。

## 联系与支持

如有使用问题或合作需求，请前往联系页面。

- **联系入口：** [联系与合作](https://mzsh.me/contact/)

## 兼容性

支持 Unreal Engine 5.2–5.8。
