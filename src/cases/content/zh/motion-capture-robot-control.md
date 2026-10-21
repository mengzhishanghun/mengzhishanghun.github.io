---
title: 将动捕骨骼重定向到 UE 机器人模型
description: 从 Kinect 骨骼滤波到机器人关节映射，处理结构比例、IK、平滑与转速限制。
type: case
slug: motion-capture-robot-control
categoryId: ue-projects
categoryName: UE项目
categoryOrder: 0
status: 归档
featured: false
draft: false
sitePublish: true
tags:
  - 动作捕捉
  - 机器人
coverAlt: 动捕机器人控制系统的流程图
websiteCoverUrl: /assets/cases/motion-capture-robot-control.png
lang: zh
translationKey: motion-capture-robot-control
---

## 人体动作与机器人结构的差异

人体骨骼的关节位置和比例，与机器人模型通常对不上。直接复制旋转，容易出现动作幅度不合适、关节抖动或姿态扭曲。我参与实现了从动捕输入到 UE 内机器人模型的重定向管线，让输入处理和模型关节映射分别调整。

## 两段重定向管线

KinectRetarget 读取 Kinect 骨骼数据，逐关节滤波，再把姿态写入 PN3 的 PoseableMesh。输入阶段先处理关节波动，为后续模型映射提供姿态数据。

机器人侧复用 URDFForge 的 RobotRetargetComponent，按结构比例映射动作。关节可以通过 IK 或直接角度驱动，并经过平滑和角速度限制，最后用 `SetRelativeRotation` 更新 UE 场景组件。

这使关节对应、比例和动作约束可以结合模型调整，而不必把动捕输入直接绑在某一套机器人结构上。

## 已实现范围与模型调整

目前案例覆盖的是 UE 内机器人模型的动作重定向。不同模型仍需要核对骨骼方向、关节比例和活动范围；Kinect 到 PN3 的特定姿态扭曲仍有待调整。

实体机器人的执行器通信、反馈与控制闭环，需要作为独立的设备接入范围评估。

## 相关需求

如果你希望让动捕数据驱动 UE 中的机器人或非标准骨骼模型，可以先提供输入设备、模型结构和目标动作。我可以协助梳理映射关系、关节约束及姿态处理。

欢迎[联系我聊聊](/zh/contact/)。
