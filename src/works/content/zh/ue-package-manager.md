---
title: UEPackageManager
description: 无需打开 UE 编辑器，直接快速打包项目，支持图形界面与命令行操作。
type: work
slug: ue-package-manager
categoryId: open-source-tools
categoryName: 开源工具
categoryOrder: 1
order: 0
status: 正式文档
workInfo:
  channels:
    - kind: open-source
      href: https://github.com/MZSH-Tools/UEPackageManager
    - kind: docs
      href: /docs/zh/tools/ue-package-manager/
  compatibility:
    - platforms:
        - Windows
      requirements:
        - Win64 项目打包；Launcher 或源码引擎
featured: false
draft: false
sitePublish: false
tags:
  - UnrealEngine
  - 打包
  - 自动化
links:
  - label: GitHub
    href: https://github.com/MZSH-Tools/UEPackageManager
coverAlt: UE 项目打包工具功能示意封面
websiteCoverUrl: /media/imported/works/ue-package-manager-cover.png
lang: zh
translationKey: ue-package-manager
---

## 作品简介

UEPackageManager 是 Windows 上的 Unreal Engine 项目打包工具，无需打开 UE 编辑器即可快速打包项目，支持图形界面与命令行操作。

它调用 Unreal Automation Tool 完成 Build、Cook、Stage、Pak、Archive 等步骤，并在打包成功后按规则把附加文件部署到输出包内。项目识别、配置隔离和输出清理用于控制重复打包的过程。

## 背景与目标

UE 项目交付时，打包命令和附加文件整理常分散在不同操作中。不同项目的引擎、输出目录、构建类型和附带数据也可能各不相同，误用上一项目的配置会产生错误结果。

工具把这些选择集中到同一个流程：图形界面针对当前项目操作，命令行则供明确指定项目的自动化调用。

## 核心能力

### 项目识别与配置隔离

自动识别当前 UE 项目和关联引擎，按项目保存打包选项，避免混用其他工程的配置。

### UE 打包与结果查看

通过 UAT 组织项目打包，支持多种构建类型，并提供过程日志。图形界面和命令行都可作为打包入口，实际构建结果仍来自 UAT。

### 成功后的附加部署

支持按规则把文件或文件夹复制到包内，并过滤不需要交付的内容。

该阶段只在 UE 打包成功后执行，避免把附加内容误放入失败的输出。目标限制在包根目录内部，不能借规则写到任意外部路径。

### 旧包清理控制

可选择在打包前清理当前输出位置识别到的旧包，但实际清理仍需确认。切换输出路径不会追溯清理旧位置，防止一次任务波及其他目录。清理和附加部署都围绕当前打包对象执行。

## 适用场景

适用于需要反复生成 Win64 项目包，并随包部署数据、配置或辅助工具的团队。

图形界面方便核对当前工程与选项；命令行适合把相同流程纳入脚本，但仍应检查参数、输出目录和打包日志。

## 适用范围与边界

当前范围是 Windows 上的 Win64 项目打包，可使用 Launcher 引擎或手动指定源码引擎。

完整 Debug 构建、插件独立打包、自动关闭编辑器及项目版本控制操作不在该工具职责内。附加文件的内容、许可和部署位置仍需项目方确认。

## 效果展示

![](/media-occurrence/work%3Aue-package-manager%3Amedia%3A1)

*UEPackageManager 图形界面：配置项目、打包参数和附加文件复制规则。*

操作步骤和参数说明见 [使用教程](/zh/docs/tools/ue-package-manager/)。
