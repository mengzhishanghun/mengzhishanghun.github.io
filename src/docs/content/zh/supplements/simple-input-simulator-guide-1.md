---
title: SimpleInputSimulator 使用指南
description: 在蓝图中模拟按键、轴输入，并清理残留的按键状态。
type: doc
slug: simple-input-simulator-guide
categoryId: ue-tools
categoryName: UE工具
categoryOrder: 0
order: 0
status: 正式文档
date: 2026-03-25
draft: false
sitePublish: false
tags:
  - SimpleInputSimulator
  - UE工具
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19770939
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/19770939
workIds:
  - simple-input-simulator
lang: zh
translationKey: doc:simple-input-simulator-guide:supplement:1
---

# SimpleInputSimulator 使用指南

使用蓝图节点模拟按键与轴输入，并在结束时清理状态。

## 功能与节点

### 输入节点

| 节点 | 功能 |
| --- | --- |
| **Simulate Key Input** | 模拟任意按键的按下/抬起（键盘、鼠标、手柄按钮） |
| **Simulate Axis Input** | 模拟摇杆、鼠标移动等轴输入 |
| **Flush Pressed Keys** | 一键清空所有按下状态 |

**参数与使用说明：**

-   支持**所有 FKey**：键盘、鼠标、手柄全覆盖
-   同时兼容 **Legacy Input** 和 **Enhanced Input**
-   支持 `PlayerIndex`，用于指定本地玩家
-   所有节点标记 `CallInEditor = true`，**编辑器中可直接测试**
-   轴输入**自动获取 DeltaTime**，无需手动传入

输入通过 `PlayerController::InputKey` 注入 UE 输入系统。

* * *

## 操作示例

### 场景1：自动化游戏测试

不用人坐在电脑前一遍遍点，写个脚本自动跑流程：

```
BeginPlay:
  Delay(1.0)                              // 等待初始化
  SimulateKeyInput(W, true)               // 前进
  Delay(2.0)
  SimulateKeyInput(W, false)              // 停止
  SimulateKeyInput(SpaceBar, true)        // 跳跃
  SimulateKeyInput(SpaceBar, false)
  SimulateKeyInput(LeftMouseButton, true) // 攻击
  SimulateKeyInput(LeftMouseButton, false)
  FlushPressedKeys()                      // 清理状态
```

可将这些操作序列用于冒烟测试和回归测试。

### 场景2：新手教程自动演示

在教程界面中，让角色自动执行操作，玩家只需要看：

```
1. 屏幕提示 "按 W 前进"
2. SimulateKeyInput(W, true)    → 角色自动走起来
3. 延迟 2 秒
4. SimulateKeyInput(W, false)   → 停下
5. 屏幕提示 "做得好！接下来试试跳跃"
```

演示使用游戏中的角色执行输入序列。

### 场景3：AI 行为调试

让 AI 通过输入系统控制角色，验证从输入到行为的完整链路：

```
// AI 决策：向右移动
SimulateAxisInput(Gamepad_LeftX, FVector(1.0, 0, 0))

// AI 决策：开火
SimulateKeyInput(Gamepad_RightTrigger, true)
```

这样可以检查从模拟输入到角色行为的处理过程。

### 场景4：输入录制与回放

配合录制系统，记录玩家的输入序列（Key + 时间戳），然后用 SimulateKeyInput 逐帧回放。可以用于：

-   Bug 复现（QA 录一段操作，程序直接回放定位问题）
-   性能分析（同一段操作在不同硬件上回放，对比帧率）
-   精彩操作回放

### 场景5：展会/Demo 自动展示

展会现场没人操作时，让游戏自动演示精彩片段：

```
// 循环播放预设的操作序列
while (bDemoMode):
  PlayDemoSequence()  // 内部用 SimulateKeyInput 驱动
  Delay(5.0)          // 每段演示间隔 5 秒
```

### 场景6：本地多人测试

一个人测试双人游戏，用脚本控制第二个玩家：

```
// 玩家1：手动操作
// 玩家2：脚本控制
SimulateKeyInput(W, true, 1)         // 玩家2 前进
SimulateAxisInput(MouseX, ..., 1)    // 玩家2 转向
```

* * *

## 安装与调用

### 安装

将插件文件夹复制到项目的 `Plugins` 目录，重启编辑器即可。

### 使用

在蓝图中搜索 `Simple Input Simulator` 分类，拖出节点直接用。

### 注意事项

-   模拟输入需要有效的 `PlayerController`，确保游戏已运行
-   按下后记得抬起，否则按键会一直处于按下状态
-   测试结束后调用 `FlushPressedKeys` 清理残留状态

---

原文于 2026-03-25 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/19770939)。
