---
title: 插件开发到发布的工具链
description: 围绕插件管理与多版本打包，把开发中分散的操作整理成专用工具。
type: case
slug: plugin-release-workflow
categoryId: desktop-automation
categoryName: 桌面与自动化
categoryOrder: 1
status: 已完成
featured: true
draft: false
sitePublish: true
tags:
  - UnrealEngine
  - 插件
  - 自动化
productIds:
  - plugin-auto-packer
  - plugin-manager
coverAlt: 插件开发到发布的工具链的流程图
websiteCoverUrl: /assets/cases/plugin-release-workflow.png
lang: zh
translationKey: plugin-release-workflow
---

## 背景介绍

在 UE 插件开发与发布过程中，我把插件查找、依赖梳理和多版本打包中重复的操作整理成了两款专用工具：UEPluginManager 与 UEPluginAutoPacker。

开发和发布时，可以先用插件管理工具查看项目环境，再用打包工具按配置的引擎版本构建并整理输出。

## 复现环境

流程面向 UE 插件开发，插件可能位于项目、商城下载目录或引擎目录。发布时则需要按不同引擎版本分别构建和检查输出。

UEPluginAutoPacker 当前构建目标为 Windows / Win64，使用有效的 .uplugin 与已配置的引擎路径。

## 具体问题

插件分散在多个位置，同名插件和依赖关系会影响判断：只查看一个目录，容易遗漏真正需要检查的对象。

多版本发布又需要反复选择引擎、执行构建、查看日志和整理文件。如果版本与输出混在一起，失败原因和待交付目录都更难核对。

## 解决方案

UEPluginManager 汇总项目、商城与引擎插件，支持检索、查看依赖与被依赖关系，并提示同名冲突。先确定插件来源和关系，再按需处理插件状态或目录。

UEPluginAutoPacker 对已配置的多个引擎分别执行插件构建，展示各版本的状态和日志，并按选项整理发布文件。各引擎的成功、失败或取消结果独立呈现，便于针对具体版本检查。


两款工具可以独立使用：插件管理工具检查环境，多版本打包工具执行构建并整理文件。

构建成功仍需结合日志和目标引擎实测判断兼容性；打包工具处理插件包，发布上架和 UE 项目整体打包另有对应流程。

## 相关需求

如果你在 UE 插件管理、多引擎版本打包或发布文件整理上有重复操作，可以先查看本案例关联的工具；已有工具无法覆盖的部分，也可以联系我讨论定制。

说明插件类型、目标引擎版本和交付要求，会更方便判断需要补充哪些流程。

有相关需求，欢迎[联系我聊聊](https://mzsh.me/zh/contact/)。
