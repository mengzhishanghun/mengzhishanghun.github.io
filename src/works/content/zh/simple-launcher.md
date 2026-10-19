---
title: SimpleLauncher
description: 通过预设管理外部程序的启动、停止、多实例和退出通知。
type: work
slug: simple-launcher
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
order: 12
status: 正式文档
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/listings/58d6403a-a2fe-4b49-9b27-536e12beace3
    - kind: docs
      href: /docs/zh/guides/ue-tools/simple-launcher-guide/
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
  - 进程管理
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19770928
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/19770928
docIds:
  - simple-launcher-guide
sourceDate: 2026-03-25
lang: zh
translationKey: simple-launcher
---

## 作品简介

SimpleLauncher 在 UE 游戏中以命名预设管理外部程序。项目可以为外部服务或工具配置启动命令、工作目录和运行方式，再按预设启动、查询或停止进程。

同一预设支持多个实例，游戏逻辑可通过实例标识和退出通知，区分各实例的生命周期。

## 背景与目标

有些 UE 项目运行时依赖本地服务、后台处理程序或随游戏启动的辅助工具。把可执行路径和启动参数散落在多处蓝图或代码中，后续调整与清理都不方便。

插件集中管理进程配置，并提供从启动到退出的接口，让调用方知道自己启动了哪些进程。

## 核心能力

### 命名预设

预设保存命令行、工作目录、是否隐藏窗口及是否分离运行等选项。游戏可按名称调用，运行时也可以查询、更新或删除配置。

配置描述的是如何启动外部程序，目标程序本身及其参数仍由项目提供和维护。

### 多实例生命周期

同一预设可以启动多个进程，每个实例由 FProcessId 区分。调用方可针对单一实例查询或停止，也可按预设停止一组实例，避免只能用程序名笼统管理。

退出后还可接收实例级或预设级通知，用于更新界面、清理状态或执行项目自己的后续逻辑。

### 退出时清理

默认的非分离运行方式会在游戏退出时清理受管理进程；选择分离运行时，外部进程可继续存活。这一差异让短期辅助进程与需要独立运行的服务可以采用不同生命周期策略。

## 适用场景

适合随游戏启动本地服务、在流程中调用后台处理程序，或在测试中并行启动多个同类实例。

退出通知可以帮助项目判断外部任务是否结束；如果需要失败重试或自动重启，触发条件和策略仍应由项目逻辑决定。

## 适用范围与边界

插件负责启动和跟踪由其管理的外部进程，不保证目标程序自身运行成功或输出正确。

分离进程不会随游戏结束自动关闭，配置时必须明确谁负责终止它。命令行和工作目录应指向实际存在且有权限访问的资源。

操作步骤和参数说明见 [使用教程](/zh/docs/guides/ue-tools/simple-launcher-guide/)。
