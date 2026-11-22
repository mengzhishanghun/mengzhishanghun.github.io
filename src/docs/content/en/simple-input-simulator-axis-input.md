---
title: Simulate Axis Input
type: doc
slug: simple-input-simulator-axis-input
draft: false
sitePublish: true
tags:
  - Blueprints
  - Input simulation
workIds:
  - simple-input-simulator
documentKind: product-manual
websiteRoute: /en/works/simple-input-simulator/docs/axis-input/
lang: en
translationKey: doc:simple-input-simulator:axis-input
sourceHash: 76a0b1c73a40151158ad0a8767019a2e2b536d1e5657de323acf6637aa70f566
translationStatus: translated
generatedBodyHash: 6a3166e58bddfc4e2e819db9a8204936aca8976ee65e6cde3df8dea5671e4e5f
docPage:
  work: simple-input-simulator
  group: input
  slug: axis-input
  order: 2
---

## Axis Input Node

| Node                 | Description                                    |
|---------------------|------------------------------------------------|
| `Simulate Axis Input` | Simulate analog input values (movement, mouse delta, gamepad sticks) |

**Parameters:**
- **Key**: Axis input key (Mouse X/Y, Gamepad Left Thumbstick X/Y, etc.)
- **Axis Value**: 3D vector for input values (typically use X component)
- **Player Index**: Target player controller (0 = first player)

![](/media-occurrence/doc%3Asimple-input-simulator%3Aaxis-input%3Amedia%3A1)

The node reads the current frame’s `DeltaTime`; callers do not pass it in.

## Mouse and Stick Example

![](/media-occurrence/doc%3Asimple-input-simulator%3Aaxis-input%3Amedia%3A2)

Simulate mouse movement or gamepad stick input.

## AI Behavior Debugging

Let AI control a character through the input system to verify the complete path from input to behavior:

```
// AI 决策：向右移动
SimulateAxisInput(Gamepad_LeftX, FVector(1.0, 0, 0))

// AI 决策：开火
SimulateKeyInput(Gamepad_RightTrigger, true)
```
This lets you inspect how simulated input is processed into character behavior.

## Local Multiplayer Testing

Test a two-player game alone by controlling the second player with a script:

```
// 玩家1：手动操作
// 玩家2：脚本控制
SimulateKeyInput(W, true, 1)         // 玩家2 前进
SimulateAxisInput(MouseX, ..., 1)    // 玩家2 转向
```
