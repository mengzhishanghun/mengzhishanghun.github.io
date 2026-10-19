---
title: UEQuickStart
description: 识别项目和引擎，显示编译日志，并在编译成功后启动项目。
type: work
slug: ue-quick-start
categoryId: open-source-tools
categoryName: 开源工具
categoryOrder: 1
order: 3
status: 正式文档
workInfo:
  channels:
    - kind: docs
      href: /docs/zh/tools/ue-quick-start/
  compatibility:
    - platforms:
        - UE 项目工具（操作系统待核实）
      requirements: []
featured: false
draft: false
sitePublish: false
tags:
  - UnrealEngine
  - 编译
  - 启动工具
links:
  - label: GitHub
    href: https://github.com/MZSH-Tools/UEQuickStart
lang: zh
translationKey: ue-quick-start
---

## 作品简介

UEQuickStart 为已有 Unreal Engine 项目提供图形化的编译与启动入口。工具自动识别项目及其关联引擎，显示实时编译日志，并在编译成功后允许启动项目。

它面向需要更新本地工程但不熟悉命令行构建流程的项目成员。

## 背景与目标

美术、策划等成员拿到新的资源或代码后，有时也需要让本地项目完成编译。若每次都依赖程序同事代为操作，或等待已经编好的 Binaries 同步，项目验证会受到流程限制。

工具在同一窗口中提供项目识别、编译进度和启动入口，让使用者看到构建是否成功，并查看失败日志。

## 核心能力

### 项目与引擎识别

工具从当前项目环境检测 UE 工程和关联引擎，减少手工选择错误项目或引擎的机会。识别的结果仍应与实际工作目录一致；这一能力针对已经存在的 UE 项目，不负责创建工程。

### 编译前处理

编译前可整理跨平台协作带来的源码换行符差异。这会修改相关文本文件，但不能替项目解决源码错误或依赖缺失。

### 日志与启动

编译过程中实时显示日志，使用者可据此判断当前进度并查找失败原因。成功后可从工具启动项目，把编译与打开工程衔接起来；编译失败时仍需根据日志修复实际问题，不能直接视为可运行状态。

## 适用场景

适合环境已经配置好的项目成员，在资源或代码更新后自行完成一次本地编译并打开编辑器。团队也可借助日志把具体错误反馈给负责构建的同事，而不必只转述“项目打不开”。

## 适用范围与边界

当前仅支持 Windows。使用前提是本机已配置编译环境，并曾成功运行过该项目。工具不安装 UE、编译器或项目依赖，也不保证新的源码一定能通过构建。遇到实际代码、模块或环境错误时，仍需按日志定位并修复。

操作步骤和参数说明见 [使用教程](/zh/docs/tools/ue-quick-start/)。
