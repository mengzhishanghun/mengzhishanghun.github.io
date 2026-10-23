---
title: 解决驾考模拟器三屏显示不一致问题
description: 围绕三屏 Lumen GI 光反射失效与曝光不一致，定位并改写引擎相关实现。
type: case
slug: driving-simulator-three-screen
categoryId: ue-projects
categoryName: UE项目
categoryOrder: 0
status: 已完成
featured: false
draft: false
sitePublish: true
tags:
  - Lumen
  - 多屏显示
  - 仿真
coverAlt: 解决驾考模拟器三屏显示不一致问题的流程图
websiteCoverUrl: /assets/cases/driving-simulator-three-screen.png
lang: zh
translationKey: driving-simulator-three-screen
---

## 背景介绍

一个驾驶训练场景采用三屏显示，需要在不同视角下呈现一致的训练画面。各块屏幕共同构成驾驶场景，光照与曝光的差异会直接影响画面的整体观感。

我参与处理了三屏场景中 Lumen 间接光照与曝光不一致的问题，工作集中在引擎多视角支持和视图曝光数据关联，两部分分别定位、分别修改。

## 复现环境

场景使用 Unreal Engine、Lumen 和三屏显示。Lumen 多视角问题的原始处理记录以 UE 5.3 为例，需要使用能够修改和重新构建引擎的源码版本。

曝光同步的实现记录以 UE 5.3.2 为例，涉及 LocalPlayer、FSceneView 和视图的 StereoPass 设置。具体版本用于标明当时核对的引擎实现位置。

## 具体问题

**三屏中的 Lumen 光照异常**

三屏显示中出现 Lumen GI 光反射失效，影响不同视角下的光照表现。原始排障记录指出，引擎相关实现中的最大视角数量固定为 2，与项目需要的三个视角不一致。

**不同视角的曝光不一致**

多个视角还存在曝光不同步的问题，各屏幕的亮度表现不一致。曝光数据的关联需要单独处理，扩展 Lumen 的视角数量后，仍要处理各视图如何共享曝光计算数据。

## 解决方案

**扩展 Lumen 的多视角支持**

将引擎相关实现中固定的最大视角数量从 2 调整为 3。记录中的七处修改相互关联，需要作为一组改动处理。

这部分修改落在引擎源码中，需要重新构建修改后的引擎。现有记录明确说明，非源码版本中的同类修改不能达到这一处理效果。具体修改记录与源码截图，可[查看多视角 GI 丢失问题的解决办法](https://mzsh.me/blog/ue53-multiview-gi/)。

**关联多个视图的曝光数据**

曝光同步通过自定义 LocalPlayer 的视图构建逻辑处理，将非主玩家视图的 `StereoPass` 设置为 `eSSP_SECONDARY`。

该处理利用引擎对主、次视图的关联，使相关视图复用曝光计算所需的数据。UE 5.3.2 的记录将对应判断定位到 `FSceneView` 的构造函数中。具体代码与判断位置，可[查看曝光同步的实现详情](https://mzsh.me/blog/cnblogs-19165561/)。

Lumen 视角容量与曝光数据关联解决的是两类问题。维护时需要保留各自的修改依据，引擎版本变化后也要重新核对实现位置。


根据现有项目记录，三屏场景中的光照与曝光不一致问题得到处理，项目继续用于模拟考试教学场景。

这套处理针对原始记录中的 UE 5.3 / 5.3.2 三屏场景。引擎升级时应重新核对多视角限制与曝光数据关联，不能只按旧文件位置套用修改。

## 相关需求

如果你的 UE 多屏项目出现视角之间亮度不同、Lumen 光照或反射异常，我可以协助核对视图配置与引擎实现，定位问题，并根据项目版本评估调整方案。

沟通时可以附上引擎版本、多屏组织方式，以及能看出差异的截图或视频。

有相关需求，欢迎[联系我聊聊](https://mzsh.me/zh/contact/)。
