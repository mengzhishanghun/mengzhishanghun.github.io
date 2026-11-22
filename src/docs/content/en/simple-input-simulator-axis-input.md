---
title: Simulate Axis Input and Manage Input State
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
sourceHash: ab17ae8c6c001af8e66aff190b9ec392a93b811caeb8a82dd34761c004bbbcca
translationStatus: translated
generatedBodyHash: f7b39507975e7ef1b7764497e98e962eb9d6a32751e895bbbf1b93f0b3107267
docPage:
  work: simple-input-simulator
  group: workflows
  slug: axis-input
  order: 2
---

### 🕹️ Axis Input Simulation

| Node                 | Description                                    |
|---------------------|------------------------------------------------|
| `Simulate Axis Input` | Simulate analog input values (movement, mouse delta, gamepad sticks) |

**Parameters:**
- **Key**: Axis input key (Mouse X/Y, Gamepad Left Thumbstick X/Y, etc.)
- **Axis Value**: 3D vector for input values (typically use X component)
- **Player Index**: Target player controller (0 = first player)

![](/media-occurrence/doc%3Asimple-input-simulator%3Aaxis-input%3Amedia%3A1)

### 🧹 Input State Management

| Node               | Description                          |
|-------------------|--------------------------------------|
| `Flush Pressed Keys` | Clear all pressed keys and reset input state |

**Parameters:**
- **Player Index**: Target player controller (0 = first player)

---

### Axis Input Example
![](/media-occurrence/doc%3Asimple-input-simulator%3Aaxis-input%3Amedia%3A2)

Simulate mouse movement or gamepad stick input.

---

### Scenario 3: AI Behavior Debugging

Let AI control a character through the input system to verify the complete path from input to behavior:

```
// AI 决策：向右移动
SimulateAxisInput(Gamepad_LeftX, FVector(1.0, 0, 0))

// AI 决策：开火
SimulateKeyInput(Gamepad_RightTrigger, true)
```
This lets you inspect how simulated input is processed into character behavior.

### Scenario 6: Local Multiplayer Testing

Test a two-player game alone by controlling the second player with a script:

```
// 玩家1：手动操作
// 玩家2：脚本控制
SimulateKeyInput(W, true, 1)         // 玩家2 前进
SimulateAxisInput(MouseX, ..., 1)    // 玩家2 转向
```
* * *
