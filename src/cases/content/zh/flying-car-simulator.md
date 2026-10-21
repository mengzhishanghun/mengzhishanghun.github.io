---
title: UE 飞行仿真中的 AirSim 控制适配
description: 处理逐帧飞行指令、偏航控制与坐标换算，并适配 UE 5.6 接口。
type: case
slug: flying-car-simulator
categoryId: ue-projects
categoryName: UE项目
categoryOrder: 0
status: 归档
featured: false
draft: false
sitePublish: true
tags:
  - 仿真
  - 交通
coverAlt: 飞行汽车模拟器的流程图
websiteCoverUrl: /assets/cases/flying-car-simulator.png
lang: zh
translationKey: flying-car-simulator
---

## 飞行输入与场景更新

飞行汽车仿真需要把操作输入持续送进 AirSim，同时让 UE 场景继续更新。我参与的工作集中在飞行控制接入、偏航处理和引擎版本适配，后续也做过六轴平台联动、VR 体验与相机配置精简。

### 避免控制指令阻塞游戏线程

带持续时间参数的旧控制接口会让调用等待，影响游戏线程更新。我在 Pawn 的 Tick 中改用非阻塞的 `setVelocityCommandBodyFrame`，按帧提交机体坐标系速度。输入变化可以继续传入，场景也能继续处理交互和画面更新。

### 平移与朝向分别处理

斜向移动时，速度方向和机体朝向容易互相干扰。实现中单独维护 `TargetYaw`，并使用角度模式控制偏航，减少平移输入引起的额外转向。UE 与 AirSim 的数据交换还需要换算速度单位，并处理 NED 坐标中 Z 轴的方向。

## 版本适配与联动范围

我处理了 AirSim 在 UE 5.6 下的接口和初始化适配。项目还涉及六轴联动测试、VR 与相机调整；平台侧的软件处理见[六自由度运动平台案例](/zh/cases/six-dof-motion-platform/)。

这里展示的是控制与集成实现。飞行动力学取决于所用仿真模型，模型精度、设备响应和具体体验仍需结合项目测试。

## 相关需求

已有 AirSim 或 UE 飞行场景，需要接入操作设备、调整移动与偏航关系，或迁移引擎版本，可以先提供当前版本、控制接口和遇到的表现，再确定适配范围。

欢迎[联系我聊聊](/zh/contact/)。
