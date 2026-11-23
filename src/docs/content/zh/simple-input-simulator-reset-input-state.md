---
title: 清理模拟输入状态
type: doc
slug: simple-input-simulator-reset-input-state
draft: false
sitePublish: true
tags:
  - 蓝图
  - 输入模拟
workIds:
  - simple-input-simulator
docPage:
  work: simple-input-simulator
  group: features
  slug: reset-input-state
  order: 3
documentKind: product-manual
websiteRoute: /zh/works/simple-input-simulator/docs/reset-input-state/
lang: zh
translationKey: doc:simple-input-simulator:reset-input-state
---

## 清除按下状态的节点

| 节点               | 说明                          |
|-------------------|-------------------------------|
| `Flush Pressed Keys` | 清除所有已按下的按键并重置输入状态 |

**参数：**
- **Player Index**：目标玩家控制器（0 = 第一个玩家）

## 测试和回放后的清理

用同一个玩家索引成对发送按下和释放事件。测试、演示或回放结束或中断时，调用 `FlushPressedKeys` 清除该玩家控制器上的残留状态，避免按键一直处于按下状态。本地多人测试时，先核对要清理的是哪位玩家。
