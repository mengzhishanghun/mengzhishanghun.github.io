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
      href: /zh/works/plugin-auto-packer/docs/setup/
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
docIds:
  - plugin-auto-packer-setup
  - plugin-auto-packer-package
  - plugin-auto-packer-output
  - plugin-auto-packer-updates-2026-08-08
  - plugin-auto-packer-updates-2026-06-19
  - plugin-auto-packer-updates-2026-04-17
  - plugin-auto-packer-updates-2026-02-26
  - plugin-auto-packer-updates-2025-06-22
  - plugin-auto-packer-updates-2025-06-18
  - plugin-auto-packer-updates-2025-06-10
  - plugin-auto-packer-updates-2025-04-21
coverAlt: UEPluginAutoPacker封面
websiteCoverUrl: /media/covers/works/plugin-auto-packer-20261101.webp
lang: zh
translationKey: plugin-auto-packer
---

## 作品简介

UEPluginAutoPacker 将 UE 插件打包为可分发的版本，可用于 Fab 提交和其他插件分发场景。在图形界面登记引擎、选择插件和目标版本，构建后按需整理发布文件。

若要从命令行打包，先在图形界面添加引擎，再在命令中指定插件和目标引擎。

## 背景与目标

同一插件在多个引擎版本上发布时，需要分别选择引擎、运行构建、检查失败日志，再整理每份交付目录。重复操作中很容易混淆版本和输出。

工具分别展示各引擎任务的结果，让开发者看清哪些版本已完成、失败或被取消，再检查对应的日志与产物。

## 核心能力

### 多引擎构建

工具可登记 Launcher 安装版或源码版引擎路径，并检测项目中的 .uplugin。选择插件后，针对多个已配置引擎分别执行构建。

命令行可调用这些引擎配置并限定目标版本，配置的增删仍由图形界面负责。

### 状态和日志

图形界面按引擎显示等待、打包中、成功、失败和取消状态。点击引擎可查看对应日志；如果某个版本打包失败，可在该版本的输出目录找到失败日志。

### 发布文件整理

构建后可按需要清理中间产物、复制文档、生成发布过滤配置或处理插件描述字段，输出按插件和引擎版本区分。

工具还提供从 .uplugin 作者信息生成源码版权声明的处理项；启用这类会改动内容的选项时应先核对目标文件。

## 适用场景

适合 UE 插件作者在发布前构建多个引擎版本，并逐版本检查兼容性与失败原因。需要整理 Fab 交付文件时，可把相应清理和过滤项纳入同一次任务，减少在多个输出目录中重复手工处理的工作。

## 适用范围与边界

当前构建目标是 Windows / Win64，插件目录需要有有效的 .uplugin。

多版本任务的成功状态仍需结合日志和目标引擎实测判断；文件整理选项也应按本次发布要求审查。该工具处理插件包，不承担 UE 项目整体打包。

操作步骤和参数说明见 [使用教程](/zh/works/plugin-auto-packer/docs/package/)。

## 许可证

本项目采用 [MIT License](<https://github.com/MZSH-Tools/UEPluginAutoPacker/blob/1a1e43b283fcb6deb561cba0636d1e28bc634f8a/LICENSE>) 协议开源，欢迎自由使用、修改和分发。

## 联系与支持

作者邮箱：**mengzhishanghun@outlook.com**  
如有定制功能或合作需求，欢迎联系！
