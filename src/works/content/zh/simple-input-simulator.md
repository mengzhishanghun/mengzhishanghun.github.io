---
title: SimpleInputSimulator
description: 在蓝图中模拟按键、轴输入，并清理残留的按键状态。
type: work
slug: simple-input-simulator
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
order: 6
status: 正式文档
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/listings/dd1ee0a8-f450-4a3d-adc4-4a96f5dec3dd
    - kind: docs
      href: /zh/works/simple-input-simulator/docs/setup/
featured: false
draft: false
sitePublish: false
tags:
  - 蓝图
  - 输入模拟
  - Simple 系列
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19770939
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/19770939
docIds:
  - simple-input-simulator-setup
  - simple-input-simulator-key-input
  - simple-input-simulator-axis-input
  - simple-input-simulator-reset-input-state
coverAlt: SimpleInputSimulator封面
websiteCoverUrl: /media/covers/works/simple-input-simulator-20261101.webp
sourceDate: 2026-03-25
lang: zh
translationKey: simple-input-simulator
---

## 作品简介

SimpleInputSimulator 为 UE 蓝图提供按键和轴输入模拟节点，让游戏逻辑沿已有输入链路接收指定操作。

它可以模拟键盘、鼠标和手柄按键的按下与释放，也能模拟鼠标移动和摇杆轴值。测试结束后可以清除按下状态。

## 背景与目标

自动演示、输入流程调试或本地多人测试时，开发者常需要重现一段操作。如果直接调用角色行为，可能绕过项目实际使用的输入绑定与控制器逻辑。

这个插件通过 PlayerController 的输入接口注入事件，使脚本化操作尽量沿常规输入处理链路执行。输入序列由使用者自行组织，插件提供的是单次输入与状态管理节点。

## 核心能力

### 按键事件模拟

支持键盘、鼠标和手柄的按下与释放事件，可用于组织重复操作。按下后仍需配对释放，避免留下按住状态。

### 轴输入与玩家选择

支持鼠标移动、摇杆等轴输入，自动取得所需 DeltaTime，并可指定本地玩家。

节点兼容 Legacy Input 与 Enhanced Input，仍需项目本身具备有效的输入映射与控制器。

### 状态清理

测试、演示或回放结束后，可用 `Flush Pressed Keys` 清除按下状态。

## 适用场景

适合冒烟测试中重复执行前进、跳跃等操作，或在教程、展会演示中驱动已有角色输入。也可配合项目自己的录制系统重放事件，以及在本地多人测试中指定第二位玩家。

录制、时间调度和完整测试断言需要由上层逻辑提供。

## 使用流程

1. [安装插件](/zh/works/simple-input-simulator/docs/setup/)后，在蓝图的 **Simple Input Simulator** 分类下找到节点。先确认目标玩家有可用的 `PlayerController`；`PlayerIndex` 为 `0` 时指向第一个本地玩家。
2. 以测试前进为例：项目先把 `W` 绑定到前进，再用 `Simulate Key Input` 模拟按下 `W`。将 `Pressed` 设为 `true`，延迟一秒后用 `false` 释放。
3. 如需模拟摇杆或鼠标移动，改用 [Simulate Axis Input](/zh/works/simple-input-simulator/docs/axis-input/)。测试结束后[清理按下状态](/zh/works/simple-input-simulator/docs/reset-input-state/)。

![](/media-occurrence/work%3Asimple-input-simulator%3Amedia%3A1)

## 适用范围与边界

插件模拟输入事件，不保证目标动作一定发生；角色状态、输入映射和游戏阶段仍会影响结果。

按下与释放要配对，测试结束要清理状态。没有有效 PlayerController 时无法按预期注入输入，自动化流程应检查这一前提。

操作步骤和参数说明见 [使用教程](/zh/works/simple-input-simulator/docs/key-input/)。

## 联系与支持

如有使用问题或合作需求，请前往联系页面。

- **联系入口：** [联系与合作](https://mzsh.me/contact/)

## 原文来源

原文于 2026-03-25 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/19770939)。

## 兼容性

支持 Unreal Engine 5.2–5.8。
