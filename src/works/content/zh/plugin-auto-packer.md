---
title: UEPluginAutoPacker
description: 主要用于 Fab 提交流程，将插件打包为可发布版本，也适合其他插件分发场景。
type: work
slug: plugin-auto-packer
categoryId: open-source-tools
categoryName: 开源工具
categoryOrder: 1
order: 1
status: 正式文档
workInfo:
  channels:
    - kind: open-source
      href: https://github.com/MZSH-Tools/UEPluginAutoPacker
    - kind: docs
      href: /docs/zh/tools/plugin-auto-packer/
  compatibility:
    - platforms:
        - Windows
      requirements:
        - 仅构建 Win64 插件
featured: false
draft: false
sitePublish: false
tags:
  - UnrealEngine
  - 插件
  - 打包
links:
  - label: GitHub
    href: https://github.com/MZSH-Tools/UEPluginAutoPacker
lang: zh
translationKey: plugin-auto-packer
---

## 作品简介

UEPluginAutoPacker 主要用于 Fab 提交流程，将 UE 插件打包为可发布版本，也适合其他插件分发场景。工具把多引擎配置、插件构建、状态查看和发布文件整理放在同一个界面中。

图形界面适合逐个观察各引擎任务，命令行则能对已配置的引擎执行指定插件构建。

## 背景与目标

同一插件在多个引擎版本上发布时，需要分别选择引擎、运行构建、检查失败日志，再整理每份交付目录。重复操作中很容易混淆版本和输出。

工具分别展示各引擎任务的结果，让开发者看清哪些版本已完成、失败或被取消，再检查对应的日志与产物。

## 核心能力

### 多引擎构建

工具可登记 Launcher 安装版或源码版引擎路径，并检测项目中的 .uplugin。选择插件后，针对多个已配置引擎分别执行构建。

命令行可调用这些引擎配置并限定目标版本，配置的增删仍由图形界面负责。

### 状态和日志

图形界面显示每个引擎的等待、打包中、成功、失败与取消状态，并可切换查看对应日志。失败结果会保留日志文件，方便把问题定位到具体引擎版本，而不是只得到整批任务的单一成败结论。

### 发布文件整理

构建后可按需要清理中间产物、复制文档、生成发布过滤配置或处理插件描述字段，输出按插件和引擎版本区分。

工具还提供从 .uplugin 作者信息生成源码版权声明的处理项；启用这类会改动内容的选项时应先核对目标文件。

## 适用场景

适合 UE 插件作者在发布前构建多个引擎版本，并逐版本检查兼容性与失败原因。需要整理 Fab 交付文件时，可把相应清理和过滤项纳入同一次任务，减少在多个输出目录中重复手工处理的工作。

## 适用范围与边界

当前构建目标是 Windows / Win64，插件目录需要有有效的 .uplugin。

多版本任务的成功状态仍需结合日志和目标引擎实测判断；文件整理选项也应按本次发布要求审查。该工具处理插件包，不承担 UE 项目整体打包。

操作步骤和参数说明见 [使用教程](/zh/docs/tools/plugin-auto-packer/)。
