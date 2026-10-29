---
title: 飞行仿真
description: 基于 UE 与 AirSim 的飞行仿真项目，涉及操作输入、飞行控制、观察视角和引擎版本适配。
type: case
slug: flight-simulation
categoryId: ue-projects
categoryName: UE项目
categoryOrder: 0
order: 1
status: 归档
featured: false
draft: false
sitePublish: true
tags:
  - 仿真
  - 飞行控制
coverAlt: 飞行仿真的 AI 概念封面，非项目实拍
websiteCoverUrl: /assets/cases/flight-simulation-cover.png
translationKey: flying-car-simulator
lang: zh
---

## 项目介绍

项目在 UE 场景中接入飞行操作，通过 AirSim 驱动飞行器，并协调输入、运动状态与观察视角。我参与的工作集中在控制接入和版本适配。

## 我负责的工作

- 将前后、左右、升降与转向输入转换为飞行控制指令。
- 分开处理平移与偏航，让移动方向和机头朝向能够独立控制。
- 调整控制接口的调用方式，减少持续指令对游戏线程更新的阻塞。
- 处理 UE 5.6 接口与初始化适配，以及项目相机和 AirSim 相机管理之间的关系。

## 实现与成果

飞行控制以逐帧输入更新目标，单位和坐标转换集中在 UE 与仿真接口的边界。非阻塞调用后，游戏线程可以继续处理场景、界面和相机。

项目还涉及六轴联动测试以及 VR、相机配置调整。这里展示的是控制接入与适配工作，飞行动力学精度和设备响应需结合实际模型与运行环境验证。

## 相关技术记录

- [UE 飞行仿真中的 AirSim 控制适配](/blog/flying-car-simulator/)
- [六轴平台与虚拟拍摄](/cases/motion-platform-filming/)
