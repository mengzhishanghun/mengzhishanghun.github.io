---
title: 模拟按键
type: doc
slug: simple-input-simulator-key-input
draft: false
sitePublish: true
tags:
  - 蓝图
  - 输入模拟
workIds:
  - simple-input-simulator
docPage:
  work: simple-input-simulator
  group: input
  slug: key-input
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-input-simulator/docs/key-input/
lang: zh
translationKey: doc:simple-input-simulator:key-input
---

## 按下和释放节点

| 节点                | 说明                                    |
|--------------------|----------------------------------------|
| `Simulate Key Input` | 模拟任意输入按键的按下/释放事件            |

**参数：**
- **Key**：UE 的 FKey 输入按键（空格键、鼠标左键、手柄按钮等）
- **Pressed**：`true` 为按下，`false` 为释放
- **Player Index**：目标玩家控制器（0 = 第一个玩家）

![](/media-occurrence/doc%3Asimple-input-simulator%3Akey-input%3Amedia%3A1)

## 空格键示例

![](/media-occurrence/doc%3Asimple-input-simulator%3Akey-input%3Amedia%3A2)

为 Player 0 模拟按下空格键。

## 自动化游戏测试

用脚本自动执行流程，减少反复手动操作：

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

## 新手教程自动演示

在教程界面中，让角色自动执行操作，玩家只需要看：

```
1. 屏幕提示 "按 W 前进"
2. SimulateKeyInput(W, true)    → 角色自动走起来
3. 延迟 2 秒
4. SimulateKeyInput(W, false)   → 停下
5. 屏幕提示 "做得好！接下来试试跳跃"
```

演示使用游戏中的角色执行输入序列。

## 输入录制与回放

配合录制系统，记录玩家的输入序列（Key + 时间戳），然后用 SimulateKeyInput 逐帧回放。可以用于：

-   Bug 复现（QA 录一段操作，程序直接回放定位问题）
-   性能分析（同一段操作在不同硬件上回放，对比帧率）
-   精彩操作回放

## 展会或 Demo 自动展示

展会现场没人操作时，让游戏自动演示精彩片段：

```
// 循环播放预设的操作序列
while (bDemoMode):
  PlayDemoSequence()  // 内部用 SimulateKeyInput 驱动
  Delay(5.0)          // 每段演示间隔 5 秒
```
