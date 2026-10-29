---
title: 动捕与机器人控制
description: 将人体动捕、机器人模型重定向、实时数据通信与三轴 IK 整理到同一个 UE 项目，部分能力仍处于原型阶段。
type: case
slug: motion-capture-robot
categoryId: ue-projects
categoryName: UE项目
categoryOrder: 0
order: 4
status: 开发中
featured: false
draft: false
sitePublish: true
tags:
  - 动作捕捉
  - 机器人
  - 原型
coverAlt: 动捕与机器人控制的 AI 概念封面，非项目实拍
websiteCoverUrl: /assets/cases/motion-capture-robot-cover.png
translationKey: motion-capture-robot-control
lang: zh
---

## 项目介绍

这个项目围绕人体动作与机器人机构之间的映射展开：从动捕设备或实时数据获得输入，在 UE 中处理骨骼、姿态和目标位置，再根据机器人结构形成模型动作或关节值。

动捕重定向与实时通信、三轴 IK 属于同一个项目的不同部分，分别处理输入动作、数据状态与机构求解。

## 我负责的工作

- 接入 Kinect 骨骼数据，处理缺失关节、位置与角度滤波，形成中间骨架。
- 按机器人骨段比例、关节轴与限制完成重定向，结合 IK 和直接角度映射驱动 UE 模型。
- 开发 UDP JSON 最新帧交接、超时与恢复处理，以及自适应滤波的软件原型。
- 接入三关节位置 IK，分别表达输入有效与求解有效状态。

## 实现与成果

现有管线已经覆盖动捕输入、中间骨架和 UE 机器人组件的动作映射。实时链路与三轴 IK 则已有软件原型，可分别检查收包、调度、滤波与求解状态。

项目仍有模型姿态调整、真实机构 URDF 和真实数据测试待完成。UE 模型动作与协议输出不能直接代表实体机器人已经完成通信、反馈和控制闭环；三轴原型目前只处理目标位置。

## 相关技术记录

- [将动捕骨骼重定向到 UE 机器人模型](/blog/motion-capture-robot-control/)
- [机器人实时数据与三轴 IK 原型](/blog/robot-realtime-ik-prototype/)
