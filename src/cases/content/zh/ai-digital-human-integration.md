---
title: AI 数字人交互
description: 将语音识别、AI 对话、语音合成、口型和人体感知接入 UE 数字人，支持本地、云端及混合部署。
type: case
slug: digital-human-interaction
categoryId: ue-projects
categoryName: UE项目
categoryOrder: 0
order: 3
status: 已完成
featured: true
draft: false
sitePublish: true
tags:
  - AI
  - 数字人
  - 语音交互
coverAlt: AI 数字人交互封面
websiteCoverUrl: /assets/cases/digital-human-interaction-cover.png
lang: zh
translationKey: ai-digital-human-integration
---

## 项目介绍

项目让数字人接收用户语音、生成回答，再通过声音、口型和表情回应。人体感知提供另一条输入，让角色视线与场景交互能够跟随用户。

## 我负责的工作

- 集成语音识别、大模型对话、语音合成与数字人表现之间的服务通信。
- 组织声音播放、嘴型和表情驱动，串联完整对话流程。
- 接入 Kinect 骨骼数据，用于视线跟随与动作触发的场景交互。
- 联调本地、云端和混合三种服务部署方式，并将流程控制与功能模块拆开。

## 实现与成果

UE 与 MetaHuman 承担角色渲染和场景表现，后端承担对应的 AI 处理。C++ 提供基础支持，蓝图组织具体交互，服务可以按部署条件组合。

本地、云端与混合方案使用同一套交互流程。云端方案指 AI 服务运行在远端，数字人的渲染与场景交互仍在 UE 端完成。

## 相关技术记录

- [本地集成 AI 数字人交互流程](/blog/ai-digital-human-integration/)
