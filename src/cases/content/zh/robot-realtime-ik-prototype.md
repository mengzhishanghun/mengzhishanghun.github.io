---
title: 机器人实时数据与三轴 IK 原型
description: 开发中的 UDP JSON 数据接入与三关节位置 IK 原型，真实机构与真实数据测试待完成。
type: case
slug: robot-realtime-ik-prototype
categoryId: ue-projects
categoryName: UE项目
categoryOrder: 0
status: 开发中
featured: false
draft: false
sitePublish: true
tags:
  - 机器人
  - UDP
  - 原型
lang: zh
translationKey: robot-realtime-ik-prototype
---

## 原型目标

RoBoBuilder 正在开发机器人实时数据接入和三轴位置 IK。我把数据传输、调度和求解拆开，先建立可调整的 UE 侧原型；真实机构 URDF 与真实数据测试仍待完成。

## 数据接入与失联处理

RoboUdpTransport 通过 UDP 收发 JSON。RoboRealtimeSubsystem 按配置的目标周期调度，输入超时后将输出归零，收到连续有效数据包后恢复。这样可以明确区分持续更新、输入中断和恢复阶段。

调度频率中的 120 Hz 是配置目标，实际执行受运行环境与帧调度影响，不能当作硬实时保证。

## 三关节位置求解

RoboThreeAxisIkSolver 复用 URDFForge，处理米到厘米、左右手坐标系，以及旋转轴作为伪向量时的转换，再求解三关节的位置 IK。

当前求解目标只有位置。末端姿态约束不在这套三轴原型的范围内，机构定义和关节参数还需要用真实模型核对。

## 开发状态

目前已有传输、调度和位置求解的软件原型。真实机构 URDF、真实数据链路和设备上的表现仍需测试，本案例按开发中展示。

如果要评估类似需求，可以先提供机构结构、关节范围、数据格式和目标位置约束，再判断原型中哪些部分可以复用。

欢迎[联系我聊聊](/zh/contact/)。
