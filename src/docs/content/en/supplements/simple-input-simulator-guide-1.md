---
title: SimpleInputSimulator User Guide
description: Simulate keys and axis input in Blueprints and clear remaining pressed-key states.
type: doc
slug: simple-input-simulator-guide
categoryId: ue-tools
categoryName: UE tools
categoryOrder: 0
order: 0
status: Official documentation
date: 2026-03-25
draft: false
sitePublish: false
tags:
  - SimpleInputSimulator
  - UE tools
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19770939
links:
  - label: Original Cnblogs article
    href: https://www.cnblogs.com/mengzhishanghun/p/19770939
workIds:
  - simple-input-simulator
lang: en
translationKey: doc:simple-input-simulator-guide:supplement:1
sourceHash: 10c4a516b628f9db6a2a7962eda99bac531c8fc528e5ab8bb6cce63e1c0cf1e7
translationStatus: translated
generatedBodyHash: cf71739d6c1cff8610d1fac59ae2c2b97b7f8cbb65d43e44a806951ae72e387f
---

# SimpleInputSimulator User Guide

Use Blueprint nodes to simulate keys and axis input, then clear the state when finished.

## Features and Nodes

### Input Nodes

| Node | Function |
| --- | --- |
| **Simulate Key Input** | Simulate pressing/releasing any key (keyboard, mouse, gamepad buttons) |
| **Simulate Axis Input** | Simulate axis input such as joystick movement or mouse motion |
| **Flush Pressed Keys** | Clear all pressed states with one call |

**Parameters and usage notes:**

- Supports **all FKey values**, covering keyboard, mouse, and gamepad
- Compatible with both **Legacy Input** and **Enhanced Input**
- Supports `PlayerIndex` to specify a local player
- All nodes are marked `CallInEditor = true`, allowing **direct testing in the editor**
- Axis input **automatically obtains DeltaTime**, so you do not need to pass it manually

Input is injected into the UE input system through `PlayerController::InputKey`.

* * *

## Usage Examples

### Scenario 1: Automated Game Testing

Instead of sitting at the computer and repeating clicks, write a script to run the sequence automatically:

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
These action sequences can be used for smoke testing and regression testing.

### Scenario 2: Automatic Demonstrations in a Beginner Tutorial

Let the character perform actions automatically in the tutorial interface while the player watches:

```
1. Show the on-screen prompt "Press W to move forward"
2. SimulateKeyInput(W, true)    → The character starts walking automatically
3. Wait 2 seconds
4. SimulateKeyInput(W, false)   → Stop
5. Show the on-screen prompt "Well done! Next, try jumping"
```

The demonstration uses the in-game character to execute an input sequence.

### Scenario 3: AI Behavior Debugging

Let AI control a character through the input system to verify the complete path from input to behavior:

```
// AI 决策：向右移动
SimulateAxisInput(Gamepad_LeftX, FVector(1.0, 0, 0))

// AI 决策：开火
SimulateKeyInput(Gamepad_RightTrigger, true)
```
This lets you inspect how simulated input is processed into character behavior.

### Scenario 4: Input Recording and Playback

Combine the plugin with a recording system to capture a player's input sequence (Key + timestamp), then replay it frame by frame with SimulateKeyInput. Uses include:

- Bug reproduction: QA records actions and programmers replay them to locate the problem
- Performance analysis: Replay identical actions on different hardware to compare frame rates
- Highlight replays

### Scenario 5: Automatic Exhibition/Demo Presentations

When nobody is operating the game at an exhibition, let it demonstrate highlights automatically:

```
// 循环播放预设的操作序列
while (bDemoMode):
  PlayDemoSequence()  // 内部用 SimulateKeyInput 驱动
  Delay(5.0)          // 每段演示间隔 5 秒
```
### Scenario 6: Local Multiplayer Testing

Test a two-player game alone by controlling the second player with a script:

```
// 玩家1：手动操作
// 玩家2：脚本控制
SimulateKeyInput(W, true, 1)         // 玩家2 前进
SimulateAxisInput(MouseX, ..., 1)    // 玩家2 转向
```
* * *

## Installation and Calls

### Installation

Copy the plugin folder into the project's `Plugins` directory and restart the editor.

### Usage

Search for the `Simple Input Simulator` category in Blueprints and drag out the nodes to use them directly.

### Notes

- Simulated input requires a valid `PlayerController`; ensure the game is running
- Release keys after pressing them, otherwise they remain pressed
- Call `FlushPressedKeys` after testing to clear remaining state

---

Originally published on 2026-03-25 on [Cnblogs](https://www.cnblogs.com/mengzhishanghun/p/19770939).
