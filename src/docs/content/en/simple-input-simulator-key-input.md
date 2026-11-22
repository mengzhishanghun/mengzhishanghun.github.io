---
title: Simulate Keys and Enhanced Input
type: doc
slug: simple-input-simulator-key-input
draft: false
sitePublish: true
tags:
  - Blueprints
  - Input simulation
workIds:
  - simple-input-simulator
documentKind: product-manual
websiteRoute: /en/works/simple-input-simulator/docs/key-input/
lang: en
translationKey: doc:simple-input-simulator:key-input
sourceHash: da4af39049fe018559024a3ea9358b723aa1db96c46b93f71cd4b628de963296
translationStatus: translated
generatedBodyHash: f223c3cdfa8a8f1e17c3e833f6f5e9450e16854e2f8a97735ca005808d84968f
docPage:
  work: simple-input-simulator
  group: workflows
  slug: key-input
  order: 1
---

**Supported Unreal Engine Versions**: 5.2–5.8

**Simple Input Simulator** is a lightweight input simulation plugin for Unreal Engine.
It provides **three Blueprint functions** to simulate keyboard, mouse, and gamepad inputs programmatically.

---

## 🔧 Plugin Usage

The plugin works immediately after enabling.
All functions are available in the **Simple Input Simulator** category in Blueprint.

---

## 🧠 Blueprint Node Interface

![](/media-occurrence/doc%3Asimple-input-simulator%3Akey-input%3Amedia%3A1)

### 🎮 Key Input Simulation

| Node                | Description                                    |
|--------------------|------------------------------------------------|
| `Simulate Key Input` | Simulate press/release events for any input key |

**Parameters:**
- **Key**: UE FKey input key to simulate (Space Bar, Left Mouse Button, Gamepad buttons, etc.)
- **Pressed**: `true` for press, `false` for release
- **Player Index**: Target player controller (0 = first player)

![](/media-occurrence/doc%3Asimple-input-simulator%3Akey-input%3Amedia%3A2)

## 🔁 Enhanced Input Compatibility

| Input System     | Compatibility                                  |
|-----------------|------------------------------------------------|
| Legacy Input     | ✅ Full support                                |
| Enhanced Input   | ✅ Full support - triggers Input Actions automatically |

The plugin works at the raw input level, so both input systems receive simulated events automatically.

---

## 🧪 Blueprint Examples (Images)

### Key Input Example
![](/media-occurrence/doc%3Asimple-input-simulator%3Akey-input%3Amedia%3A3)

Simulate pressing Space Bar for Player 0.

## ✅ Tips & Notes

- All functions return `bool` indicating success/failure
- Player Index 0 targets the first player controller
- Pair press events with releases. After a test, demonstration, or replay, use Flush Pressed Keys to clear remaining state and prevent stuck keys
- Nodes can also be called in the editor, but require a valid PlayerController; without one, input cannot be injected as intended
- Axis inputs automatically adapt to current frame rate
- Check Output Log for detailed simulation messages (LogSimpleInputSimulator)

---

## Version History


Open **Edit → Project Settings**, select the SimpleInputSimulator settings page, and set **Language** to **English** or **Chinese**. English is the default. Available user-facing UI, tooltips, notifications, and functional logs update immediately without restarting the editor. Public API names and module startup/shutdown logs remain in English.

## Support

For usage questions or collaboration, please visit the contact page.

- **Contact:** [Contact and collaboration](https://mzsh.me/contact/)

## SimpleInputSimulator User Guide

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
