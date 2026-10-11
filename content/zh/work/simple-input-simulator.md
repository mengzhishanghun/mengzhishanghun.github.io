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
featured: false
draft: false
sitePublish: false
tags:
  - 蓝图
  - 输入模拟
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19770939
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/19770939
docIds:
  - simple-input-simulator-guide
sourceDate: 2026-03-25
lang: zh
translationKey: simple-input-simulator
---

## 作品简介

SimpleInputSimulator 为 UE 蓝图提供按键和轴输入模拟节点，让游戏逻辑沿已有输入链路接收指定操作。

它可以模拟键盘、鼠标和手柄按键的按下与抬起，也能模拟鼠标移动、摇杆等轴值，并提供清理按下状态的入口。

## 背景与目标

自动演示、输入流程调试或本地多人测试时，开发者常需要重现一段操作。如果直接调用角色行为，可能绕过项目实际使用的输入绑定与控制器逻辑。

这个插件通过 PlayerController 的输入接口注入事件，使脚本化操作尽量沿常规输入处理链路执行。输入序列由使用者自行组织，插件提供的是单次输入与状态管理节点。

## 核心能力

### 按键事件模拟

Simulate Key Input 接收 UE 的 FKey，处理按下或抬起事件，覆盖键盘键、鼠标按钮与手柄按钮。

使用者可以明确构造连续操作；按下状态需要对应的抬起事件结束，否则后续逻辑可能继续认为该键被按住。

### 轴输入与玩家选择

Simulate Axis Input 用于鼠标移动、摇杆等轴输入，节点会取得所需 DeltaTime。PlayerIndex 可指定本地玩家，使模拟操作落到对应的 PlayerController。

节点兼容 Legacy Input 与 Enhanced Input，仍需项目本身具备有效的输入映射与控制器。

### 状态清理

Flush Pressed Keys 清空残留的按下状态，可在测试、演示或回放结束后恢复输入环境。

节点可在编辑器调用，方便验证输入链路，但调用时仍要满足有效 PlayerController 等运行条件。

## 适用场景

适合冒烟测试中重复执行前进、跳跃等操作，或在教程、展会演示中驱动已有角色输入。也可配合项目自己的录制系统重放事件，以及在本地多人测试中指定第二位玩家。

录制、时间调度和完整测试断言需要由上层逻辑提供。

## 适用范围与边界

插件模拟输入事件，不保证目标动作一定发生；角色状态、输入映射和游戏阶段仍会影响结果。

按下与抬起要配对，测试结束要清理状态。没有有效 PlayerController 时无法按预期注入输入，自动化流程应检查这一前提。
