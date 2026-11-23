---
title: 安装与接入
type: doc
slug: simple-input-simulator-setup
draft: false
sitePublish: true
tags:
  - 蓝图
  - 输入模拟
workIds:
  - simple-input-simulator
docPage:
  work: simple-input-simulator
  group: getting-started
  slug: setup
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-input-simulator/docs/setup/
lang: zh
translationKey: doc:simple-input-simulator:setup
---

## 安装插件

将插件文件夹复制到项目的 `Plugins` 目录，重启编辑器即可。

## 在蓝图中使用

启用后，在蓝图的 **Simple Input Simulator** 分类中添加节点。节点返回 `bool` 表示调用成功或失败。请为 `PlayerIndex` 选择有效的 `PlayerController`；`0` 对应第一个本地玩家。节点标记为 `CallInEditor = true`，在编辑器里调用时也需要可用的控制器。需要排查时，在输出日志中筛选 `LogSimpleInputSimulator`。

## 可用节点

图中列出了三个节点的输入和返回值：从左上到右上分别是按键与轴输入，左下是清理按下状态。

![](/media-occurrence/doc%3Asimple-input-simulator%3Asetup%3Amedia%3A1)

| 节点 | 功能 |
| --- | --- |
| **Simulate Key Input** | 模拟任意按键的按下/抬起（键盘、鼠标、手柄按钮） |
| **Simulate Axis Input** | 模拟摇杆、鼠标移动等轴输入 |
| **Flush Pressed Keys** | 一键清空所有按下状态 |

## 输入系统兼容性

| 输入系统     | 兼容性                                  |
|-------------|----------------------------------------|
| Legacy Input | ✅ 完全支持                             |
| Enhanced Input | ✅ 完全支持 - 自动触发 Input Actions     |

插件在原始输入层工作，两种输入系统都能接收模拟事件。若节点返回成功但游戏动作没有触发，检查目标玩家的输入绑定。

模拟事件通过 `PlayerController::InputKey` 注入。

## 界面语言

打开 **编辑 → 项目设置**，进入 SimpleInputSimulator 设置页，将 **Language** 设置为 **English** 或 **中文**。默认语言为英文。面向用户的界面、提示、通知和功能日志会立即更新，无需重启编辑器；公开 API 名称以及模块启动/关闭日志始终保持英文。
