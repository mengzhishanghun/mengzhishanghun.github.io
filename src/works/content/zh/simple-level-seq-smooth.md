---
title: SimpleLevelSeqSmooth
description: 对 Level Sequence 数据进行滤波和平滑，支持批量处理与 ControlRig 参数段。
type: work
slug: simple-level-seq-smooth
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
order: 15
status: 正式文档
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/listings/b8acac2b-913d-47ce-8596-b4e2d7d6753a
    - kind: docs
      href: /zh/works/simple-level-seq-smooth/docs/setup/
  compatibility:
    - platforms:
        - Windows (Win64)
        - macOS
        - Linux
      requirements:
        - UE 5.2–5.8
featured: false
draft: false
sitePublish: false
tags:
  - 动画
  - 动作捕捉
  - 滤波
  - Simple 系列
links:
  - label: GitHub
    href: https://github.com/MZSH-UEPlugins/SimpleLevelSeqSmooth
docIds:
  - simple-level-seq-smooth-setup
  - simple-level-seq-smooth-smooth-curves
coverAlt: SimpleLevelSeqSmooth封面
websiteCoverUrl: /media/covers/works/simple-level-seq-smooth-20261101.webp
lang: zh
translationKey: simple-level-seq-smooth
---

## 作品简介

SimpleLevelSeqSmooth 为 Unreal Engine 的 Level Sequence 提供数据滤波与平滑入口，面向动作捕捉、姿态估计和动画后处理中的曲线抖动、跳帧等问题。

它支持在内容浏览器中选择序列，按所需算法处理数据，并可覆盖原序列或生成新序列。

## 背景与目标

采集或生成的动画数据可能包含不需要的高频变化。逐条曲线手工调整费时，也难以在一批序列上保持一致的处理方式。

插件把算法选择、参数调整和批量处理放进同一流程，让使用者先按数据特征决定平滑策略，再检查结果是否保留了必要的动作细节。

## 核心能力

### 多种滤波方式

提供移动平均、高斯、中值、Butterworth、Kalman、One Euro 等共 12 种算法。

先看曲线是偶发尖峰还是持续抖动，再按需要保留的动作细节选择算法与参数。不同素材需要分别调整参数。

### 序列与参数段处理

支持批量处理 Level Sequence 中的 ControlRig Transform 与 Scalar 参数段，并读取序列帧率。

### 输出方式

处理结果可写回原序列，也可创建新序列。生成新序列可以对比处理前后的动作。覆盖前请确认能恢复原序列。输出仍是供 UE 项目使用的序列资产，实际效果应在目标镜头中查看。

## 适用场景

适用于动作捕捉曲线清理、姿态估计结果后处理，以及多个 Level Sequence 需要采用一致滤波方式的制作流程。

对于既要减少抖动又要保留快速动作变化的素材，可以先比较不同算法和参数的处理结果，再决定最终输出。

## 使用流程

1. [安装插件并确认启用 ControlRig](/zh/works/simple-level-seq-smooth/docs/setup/)。在内容浏览器中选中一个或多个 Level Sequence，右键选择 **Smooth**。
2. 选择算法并调整参数。例如，动作捕捉曲线偶尔出现尖峰时，可以先试中值滤波。
3. 先生成新序列，在目标镜头中对比尖峰是否减少、快速动作是否保留。批量生成的新序列使用统一的命名后缀。

## 适用范围与边界

工具面向 Level Sequence 数据及所支持的 ControlRig 参数段。

滤波可能同时削弱真实的快速动作，跳帧也未必只由曲线噪声引起。算法、参数与是否覆盖原资产都应依据具体序列判断，不能把处理后的曲线直接视为已完成动作质量检查。

操作步骤和参数说明见 [使用教程](/zh/works/simple-level-seq-smooth/docs/smooth-curves/)。

## 兼容性

- Unreal Engine 5.2–5.8
- 版本 1.1.0（Version 2）

## 联系与支持

如有使用问题或合作需求，请前往联系页面。

- **联系入口：** [联系与合作](https://mzsh.me/contact/)
