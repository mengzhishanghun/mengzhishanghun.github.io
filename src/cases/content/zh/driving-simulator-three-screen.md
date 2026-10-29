---
title: 驾驶仿真
description: 面向驾驶训练的三屏仿真项目，结合显示适配、驾驶过程采集、成绩统计与场景回放。
type: case
slug: driving-simulation
categoryId: ue-projects
categoryName: UE项目
categoryOrder: 0
order: 0
status: 已完成
featured: true
draft: false
sitePublish: true
tags:
  - 仿真
  - 驾驶记录
  - 多屏显示
coverAlt: 驾驶仿真的 AI 概念封面，非项目实拍
websiteCoverUrl: /assets/cases/driving-simulation-cover.png
translationKey: driving-simulator-three-screen
lang: zh
---

## 项目介绍

这是一个用于驾驶训练与模拟考试的 UE 项目。三块屏幕共同呈现驾驶环境，训练过程同时保留操作数据、成绩和可查看的场景回放，方便在结束后回顾驾驶表现。

## 我负责的工作

- 处理三屏场景中的 Lumen 光照异常和曝光不一致，调整引擎多视角支持与视图数据关联。
- 接入驾驶操作和车辆状态采集，按时间组织方向盘、刹车、油门、速度与位置等过程数据。
- 整理成绩记录与查询，并接入 UE Network Replay 的录制、播放和文件管理。

## 实现与成果

显示适配让三屏环境中的光照与曝光表现得到统一。数据侧分别保存连续过程曲线、离散操作事件和成绩统计；场景回看复用引擎回放机制，三类记录各自承担不同职责。

三屏适配基于当时的 UE 5.3 / 5.3.2 源码实现。过程数据采用后台保存，结束与退出时的最后一批数据仍需要完成通知配合；这里不把发起保存等同于已经写入完成。

## 相关技术记录

- [驾驶过程记录与 UE 回放管理](/blog/driving-session-replay/)
- [多视角 GI 丢失问题的解决办法](/blog/ue53-multiview-gi/)
- [多屏幕如何设置曝光同步](/blog/cnblogs-19165561/)
