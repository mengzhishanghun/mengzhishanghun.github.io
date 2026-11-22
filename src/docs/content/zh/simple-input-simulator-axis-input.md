---
title: 模拟轴输入并管理输入状态
type: doc
slug: simple-input-simulator-axis-input
draft: false
sitePublish: true
tags:
  - 蓝图
  - 输入模拟
workIds:
  - simple-input-simulator
docPage:
  work: simple-input-simulator
  group: workflows
  slug: axis-input
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/simple-input-simulator/docs/axis-input/
lang: zh
translationKey: doc:simple-input-simulator:axis-input
---

### 🕹️ 轴输入模拟

| 节点                 | 说明                                    |
|---------------------|----------------------------------------|
| `Simulate Axis Input` | 模拟模拟量输入值（移动、鼠标增量、手柄摇杆） |

**参数：**
- **Key**：轴输入按键（Mouse X/Y、Gamepad Left Thumbstick X/Y 等）
- **Axis Value**：输入值的 3D 向量（通常使用 X 分量）
- **Player Index**：目标玩家控制器（0 = 第一个玩家）

![](/media-occurrence/doc%3Asimple-input-simulator%3Aaxis-input%3Amedia%3A1)

### 🧹 输入状态管理

| 节点               | 说明                          |
|-------------------|-------------------------------|
| `Flush Pressed Keys` | 清除所有已按下的按键并重置输入状态 |

**参数：**
- **Player Index**：目标玩家控制器（0 = 第一个玩家）

---

### 轴输入示例
![](/media-occurrence/doc%3Asimple-input-simulator%3Aaxis-input%3Amedia%3A2)

模拟鼠标移动或手柄摇杆输入。

---

### 场景3：AI 行为调试

让 AI 通过输入系统控制角色，验证从输入到行为的完整链路：

```
// AI 决策：向右移动
SimulateAxisInput(Gamepad_LeftX, FVector(1.0, 0, 0))

// AI 决策：开火
SimulateKeyInput(Gamepad_RightTrigger, true)
```

这样可以检查从模拟输入到角色行为的处理过程。

### 场景6：本地多人测试

一个人测试双人游戏，用脚本控制第二个玩家：

```
// 玩家1：手动操作
// 玩家2：脚本控制
SimulateKeyInput(W, true, 1)         // 玩家2 前进
SimulateAxisInput(MouseX, ..., 1)    // 玩家2 转向
```

* * *
