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
featured: false
draft: false
sitePublish: false
tags:
  - 动画
  - 动作捕捉
  - 滤波
links:
  - label: GitHub
    href: https://github.com/MZSH-UEPlugins/SimpleLevelSeqSmooth
lang: zh
translationKey: simple-level-seq-smooth
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/listings/b8acac2b-913d-47ce-8596-b4e2d7d6753a
    - kind: docs
      href: /docs/zh/guides/ue-tools/simple-level-seq-smooth-guide/
  compatibility:
    - platforms:
        - Windows (Win64)
        - macOS
        - Linux
      requirements:
        - UE 5.2–5.8
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

它们处理尖峰、连续噪声和响应速度的方式不同，使用者可依据原始曲线与目标动作选择；算法种类较多，并不代表一组参数就能适配所有素材。

### 序列与参数段处理

可从内容浏览器中的 Level Sequence 打开处理入口，覆盖 ControlRig 的 Transform 与 Scalar 参数段。

工具支持批量选择序列，并检查帧率相关信息，方便在多份素材上执行同类处理和核对输入条件。

### 输出方式

处理结果可写回原序列，也可创建新序列。保留新序列适合对比处理前后的动作；选择覆盖时则需确认原数据的可恢复性。输出仍是供 UE 项目使用的序列资产，实际效果应在目标镜头中查看。

## 适用场景

适用于动作捕捉曲线清理、姿态估计结果后处理，以及多个 Level Sequence 需要采用一致滤波方式的制作流程。

对于既要减少抖动又要保留快速动作变化的素材，可以先比较不同算法和参数的处理结果，再决定最终输出。

## 适用范围与边界

工具面向 Level Sequence 数据及所支持的 ControlRig 参数段。

滤波可能同时削弱真实的快速动作，跳帧也未必只由曲线噪声引起。算法、参数与是否覆盖原资产都应依据具体序列判断，不能把处理后的曲线直接视为已完成动作质量检查。
