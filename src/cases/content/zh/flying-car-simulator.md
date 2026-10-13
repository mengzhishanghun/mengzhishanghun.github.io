---
title: 飞行汽车模拟器
description: 面向未来出行的飞行汽车仿真系统。
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

## 背景介绍

我参与了一个飞行汽车仿真项目，场景需要兼顾地面行驶与飞行两种状态，并通过座舱交互和 HUD 仪表呈现车辆信息。

案例记录的是项目中的仿真与交互方案。双模态控制、飞行姿态和仪表显示共同构成体验，不能只用单一驾驶模式描述整个场景。

## 复现环境

项目采用 Unreal Engine 构建飞行汽车仿真场景，包含座舱交互与 HUD 仪表系统。飞行部分以物理模型驱动姿态和动力学模拟。

座舱和 HUD 面向操作与信息展示，物理模拟负责飞行状态下的运动表现。

## 具体问题

场景需要同时呈现地面行驶与飞行状态，并支持两种模式之间的切换。控制状态变化后，飞行姿态和座舱信息也需要在同一仿真体验中表达。

这使工作跨越了控制、物理模拟与界面呈现几个部分，单独完成 HUD 或单一模式控制都不足以覆盖需求。

## 解决方案

围绕飞行与地面行驶建立双模态切换控制，让两类行驶状态纳入同一场景。

飞行状态采用物理模型驱动姿态与动力学模拟；座舱交互和 HUD 仪表则承担操作入口与信息展示，使控制和状态表现有对应的界面。

## 最终总结

项目围绕双模态控制、物理模拟与座舱交互组织了仿真系统，让地面行驶和飞行状态能够在同一体验中呈现。
