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
      href: /zh/works/simple-launcher/docs/setup/
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
  - Simple 系列
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19770928
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/19770928
docIds:
  - simple-launcher-setup
  - simple-launcher-presets
  - simple-launcher-processes
coverAlt: SimpleLauncher封面
websiteCoverUrl: /media/covers/works/simple-launcher-20261101.webp
sourceDate: 2026-03-25
lang: zh
translationKey: simple-launcher
---

## 作品简介

SimpleLauncher 在 UE 游戏中以命名预设管理外部程序。项目可以为外部服务或工具配置启动命令、工作目录和运行方式，再按预设启动、查询或停止进程。

同一预设可以启动多个实例。每个实例都有自己的标识，游戏逻辑可据此跟踪进程退出。

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

默认的非分离运行方式会在游戏退出时清理受管理进程；选择分离运行时，外部进程可继续存活。临时工具可以随游戏关闭；需要独立运行的服务可设为分离进程。

## 适用场景

适合随游戏启动本地服务、在流程中调用后台处理程序，或在测试中并行启动多个同类实例。

退出通知可以帮助项目判断外部任务是否结束；如果需要失败重试或自动重启，触发条件和策略仍应由项目逻辑决定。

## 使用流程

以随游戏启动本地服务为例，在项目设置里创建 `LocalServer` 预设，填写启动命令和工作目录。若服务应随游戏退出，保留非分离运行。

1. 从蓝图或 C++ 调用 `StartProcess`，传入预设名称，保存返回的进程标识。
2. 用 `IsProcessRunning` 查询该实例，或用 `BindProcessExited` 监听它在游戏运行期间退出。
3. 如需提前结束该实例，用同一标识调用 `StopProcess`。游戏退出时的清理不会触发退出回调。

具体接口见[启动和管理进程](/zh/works/simple-launcher/docs/processes/)。

## 适用范围与边界

插件负责启动和跟踪由其管理的外部进程，不保证目标程序自身运行成功或输出正确。

分离进程不会随游戏结束自动关闭，配置时必须明确谁负责终止它。命令行和工作目录应指向实际存在且有权限访问的资源。

操作步骤和参数说明见 [使用教程](/zh/works/simple-launcher/docs/presets/)。

## 兼容性

- Unreal Engine 5.2–5.8
- 版本 1.1.0（Version 2）

## 支持的平台

插件支持 Windows、Linux 和 macOS。底层使用 UE 的 `FPlatformProcess::CreateProc`，因此操作系统能执行的任何程序都可以启动——没有文件类型限制。

## 联系与支持

如有使用问题或合作需求，请前往联系页面。

- **联系入口：** [联系与合作](https://mzsh.me/contact/)

## 原文来源

原文于 2026-03-25 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/19770928)。
