---
title: 模拟按键和增强输入
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
  group: workflows
  slug: key-input
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-input-simulator/docs/key-input/
lang: zh
translationKey: doc:simple-input-simulator:key-input
---

**支持的虚幻引擎版本**：5.2–5.8

**Simple Input Simulator** 是 Unreal Engine 的轻量级输入模拟插件。
提供**三个蓝图函数**，可以通过程序模拟键盘、鼠标和手柄输入。

---

## 🔧 插件使用

插件启用后立即生效。
所有函数在蓝图的 **Simple Input Simulator** 分类下可用。

---

## 🧠 蓝图节点接口

![](/media-occurrence/doc%3Asimple-input-simulator%3Akey-input%3Amedia%3A1)

### 🎮 按键输入模拟

| 节点                | 说明                                    |
|--------------------|----------------------------------------|
| `Simulate Key Input` | 模拟任意输入按键的按下/释放事件            |

**参数：**
- **Key**：UE 的 FKey 输入按键（空格键、鼠标左键、手柄按钮等）
- **Pressed**：`true` 为按下，`false` 为释放
- **Player Index**：目标玩家控制器（0 = 第一个玩家）

![](/media-occurrence/doc%3Asimple-input-simulator%3Akey-input%3Amedia%3A2)

## 🔁 增强输入兼容性

| 输入系统     | 兼容性                                  |
|-------------|----------------------------------------|
| Legacy Input | ✅ 完全支持                             |
| Enhanced Input | ✅ 完全支持 - 自动触发 Input Actions     |

插件在原始输入层工作，因此两种输入系统都会自动接收模拟事件。

---

## 🧪 蓝图示例（图片）

### 按键输入示例
![](/media-occurrence/doc%3Asimple-input-simulator%3Akey-input%3Amedia%3A3)

为 Player 0 模拟按下空格键。

## ✅ 提示与注意事项

- 所有函数返回 `bool` 表示成功/失败
- Player Index 0 指向第一个玩家控制器
- 按下与抬起事件要配对；测试、演示或回放结束后，可使用 Flush Pressed Keys 清除残留状态，防止按键“卡住”
- 节点也可在编辑器调用，但必须有有效的 PlayerController；没有有效控制器时，无法按预期注入输入
- 轴输入自动适应当前帧率
- 查看输出日志获取详细模拟信息（LogSimpleInputSimulator）

---

## 版本历史



打开 **编辑 → 项目设置**，进入 SimpleInputSimulator 设置页，将 **Language** 设置为 **English** 或 **中文**。默认语言为英文。面向用户的界面、提示、通知和功能日志会立即更新，无需重启编辑器；公开 API 名称以及模块启动/关闭日志始终保持英文。

## 支持

如有使用问题或合作需求，请前往联系页面。

- **联系入口：** [联系与合作](https://mzsh.me/contact/)

## SimpleInputSimulator 使用指南

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
