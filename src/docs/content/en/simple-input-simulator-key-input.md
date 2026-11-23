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
sourceHash: 4e0b17450932ab25816baadea34cb3c90caec3e491d4bc02ed69bed472b58baa
translationStatus: translated
generatedBodyHash: f185c8444408f9c551e9558e5f5aaf3ee8255711c8d8e5bcdf27c0119e30cab2
docPage:
  work: simple-input-simulator
  group: features
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

The graph holds W for one second, then releases it. Both nodes target the first local player. To try Space Bar, change Key on both nodes and keep the first call as a press and the second as a release.

![](/media-occurrence/doc%3Asimple-input-simulator%3Akey-input%3Amedia%3A2)

If Space Bar is bound to an action for that player, run the example and check whether the action fires.

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
