---
title: UEPluginManager
description: 统一浏览项目与引擎插件，修正乱码目录名，并在项目与引擎的 Marketplace 目录之间移动插件。
type: work
slug: plugin-manager
categoryId: open-source-tools
categoryName: 开源工具
categoryOrder: 1
order: 2
status: 正式文档
workInfo:
  channels:
    - kind: docs
      href: /docs/zh/tools/plugin-manager/
  compatibility:
    - platforms:
        - UE 插件管理工具（操作系统待核实）
      requirements: []
featured: false
draft: false
sitePublish: false
tags:
  - UnrealEngine
  - 插件
  - 依赖分析
links:
  - label: GitHub
    href: https://github.com/MZSH-Tools/UEPluginManager
lang: zh
translationKey: plugin-manager
---

## 作品简介

UEPluginManager 是浏览和管理本地 UE 插件的桌面工具。它统一展示项目与引擎插件，支持修正乱码目录名，并在项目与引擎的 Marketplace 目录之间移动插件。引擎自带插件只供浏览和状态判断，不能移动或删除。

对于可操作的项目和商城插件，还提供移动、移至回收站及目录名修正功能。

## 背景与目标

插件可能安装在项目、商城或引擎的不同位置。遇到同名插件、启用失败或依赖不清时，仅检查一个目录容易漏掉真正生效的版本。

工具先展示插件来源和关系，再提供修改 .uproject 或整理插件目录的入口，帮助使用者在变更前看清影响范围。

## 核心能力

### 来源汇总与检索

汇总项目、商城和引擎插件，支持按名称、作者、依赖等信息检索，并提示同名冲突。可识别安装版与源码版引擎。

### 依赖与状态管理

可查看某插件依赖哪些插件，以及哪些插件依赖它。启用或禁用操作会修改项目的 .uproject 配置；涉及依赖连锁变化时，界面提供确认。

恢复默认时，工具会移除项目中的显式设置，让插件回到默认状态，适合检查临时开关留下的配置。

### 目录整理

项目插件与商城插件可在允许的位置之间移动，也可移至回收站，乱码目录名有修正入口。工具提供打开目录和重新加载列表的辅助操作，便于对照磁盘状态。

引擎自带插件只供浏览和状态判断，不作为移动或删除对象。

## 适用场景

适合排查项目中某插件为何没有生效、同名插件来自哪里，或某次启用变更会牵连哪些依赖。维护插件安装位置时，也可先通过来源和关系视图确认对象，再执行目录调整。

## 适用范围与边界

工具需要在目标 UE 项目目录中运行。移动、删除和目录修正前应关闭编辑器，避免打开中的项目与磁盘状态不一致。

启用状态修改、只读属性处理和目录操作都会影响本地项目，完成后仍需检查 .uproject、插件目录和项目启动结果。

操作步骤和参数说明见 [使用教程](/zh/docs/tools/plugin-manager/)。
