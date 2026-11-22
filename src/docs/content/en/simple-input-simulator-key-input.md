---
title: Simulate Key Input
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
sourceHash: 994dc1c1a32b5e38cea04dbe65273ea87638bfa2d8706733b00caddcad677968
translationStatus: translated
generatedBodyHash: 4bc90f5de827eac46cea4e963c242da9fef666160da00f4a712bbae19fe46ba8
docPage:
  work: simple-input-simulator
  group: input
  slug: key-input
  order: 1
---

## Press and Release Node

| Node                | Description                                    |
|--------------------|------------------------------------------------|
| `Simulate Key Input` | Simulate press/release events for any input key |

**Parameters:**
- **Key**: UE FKey input key to simulate (Space Bar, Left Mouse Button, Gamepad buttons, etc.)
- **Pressed**: `true` for press, `false` for release
- **Player Index**: Target player controller (0 = first player)

![](/media-occurrence/doc%3Asimple-input-simulator%3Akey-input%3Amedia%3A1)

## Space Bar Example

![](/media-occurrence/doc%3Asimple-input-simulator%3Akey-input%3Amedia%3A2)

Simulate pressing Space Bar for Player 0.

## Automated Game Testing

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

## Automatic Beginner Tutorial Demonstrations

Let the character perform actions automatically in the tutorial interface while the player watches:

```
1. Show the on-screen prompt "Press W to move forward"
2. SimulateKeyInput(W, true)    → The character starts walking automatically
3. Wait 2 seconds
4. SimulateKeyInput(W, false)   → Stop
5. Show the on-screen prompt "Well done! Next, try jumping"
```

The demonstration uses the in-game character to execute an input sequence.

## Input Recording and Playback

Combine the plugin with a recording system to capture a player's input sequence (Key + timestamp), then replay it frame by frame with SimulateKeyInput. Uses include:

- Bug reproduction: QA records actions and programmers replay them to locate the problem
- Performance analysis: Replay identical actions on different hardware to compare frame rates
- Highlight replays

## Unattended Exhibition or Demo

When nobody is operating the game at an exhibition, let it demonstrate highlights automatically:

```
// 循环播放预设的操作序列
while (bDemoMode):
  PlayDemoSequence()  // 内部用 SimulateKeyInput 驱动
  Delay(5.0)          // 每段演示间隔 5 秒
```
