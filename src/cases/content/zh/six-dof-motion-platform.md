---
title: 六轴平台与虚拟拍摄
description: 围绕六轴平台的软件运动解算、信号处理、海洋场景参数联动和编辑器虚拟拍摄录制。
type: case
slug: motion-platform-filming
categoryId: ue-projects
categoryName: UE项目
categoryOrder: 0
order: 2
status: 归档
featured: false
draft: false
sitePublish: true
tags:
  - 仿真
  - 虚拟拍摄
coverAlt: 六轴平台与虚拟拍摄的 AI 概念封面，非项目实拍
websiteCoverUrl: /assets/cases/motion-platform-filming-cover.png
lang: zh
translationKey: six-dof-motion-platform
---

## 项目介绍

项目将 UE 场景中的姿态变化转换为六轴平台可使用的运动数据，并为海洋场景与虚拟拍摄提供参数联动和录制支持。我的工作覆盖运动处理与场景录制的软件部分。

## 我负责的工作

- 实现六轴机构的正、逆运动学解算与单位转换。
- 处理零位、滤波、限幅、限速和倾斜协调，整理运动输出。
- 接入可动画的海浪与时间参数，让环境变化能够参与录制。
- 适配编辑器中的 Take Recorder 与 Sequence，组织原场景和新录制内容的时间关系。
- 通过 LiveLink 发送 Transform 数据，供下游系统接入。

## 实现与成果

运动链路把机构定义、姿态解算和信号处理分开；录制链路将场景参数与 Actor 记录组织到编辑器序列中，便于后续查看和调整。

这里的成果是软件解算、处理、编辑器录制和数据发送。设备控制、实机标定与安全保护仍由具体设备系统验证；编辑器录制也不等同于打包程序中的通用录像能力。

## 相关技术记录

- [六轴平台运动解算与海洋虚拍录制适配](/blog/six-dof-motion-platform/)
