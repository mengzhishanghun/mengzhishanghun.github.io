---
title: 集成 AI 数字人交互流程
description: 将数字人、语音识别、对话、语音合成与表情驱动串联为本地演示流程。
type: case
slug: ai-digital-human-integration
categoryId: ue-projects
categoryName: UE项目
categoryOrder: 0
status: 已完成
featured: false
draft: false
sitePublish: true
tags:
  - AI
  - MetaHuman
  - 语音交互
coverAlt: 集成 AI 数字人交互流程的流程图
websiteCoverUrl: /assets/cases/ai-digital-human-integration.png
lang: zh
translationKey: ai-digital-human-integration
---

## 背景介绍

在一个本地数字人演示场景中，我参与了语音交互、表情驱动与人体姿态输入的集成。目标是让数字人能够接收语音、生成回复并以声音和表情呈现，而不是只播放预先制作的角色动画。

这项工作涉及多个输入与输出环节，案例重点是如何把它们串成可演示的交互流程。

## 复现环境

演示使用 Unreal Engine 与 MetaHuman 构建数字人表现，结合 Kinect 和 ControlRig 处理人体姿态捕捉与眼动追踪。

语音链路包含语音识别、Chat 对话和 TTS 语音合成，角色端还需要接入表情驱动。

## 具体问题

数字人的交互效果需要各环节配合：语音输入需要转成对话内容，对话回复需要转成声音，角色表现还要配合表情与姿态输入。

如果只完成其中一个环节，仍无法展示从用户输入到数字人回应的完整过程。集成工作因此需要同时关注数据流转和角色端的呈现。

## 解决方案

以 MetaHuman 为角色基础，接入语音识别、Chat 与 TTS，把语音输入、回复生成和语音输出连接起来，再加入表情驱动，让回复能够通过数字人呈现。

人体姿态与眼动输入通过 Kinect 和 ControlRig 相关流程处理，与语音交互共同组成本地演示。两类输入分别服务于对话与角色表现，最终在同一场景中展示。

## 最终总结

形成了可演示的本地 AI 数字人交互流程，包含语音对话、表情驱动以及姿态和眼动相关交互。

演示把语音输入与角色回应连接起来，也纳入姿态和眼动输入，展示了多个交互环节在同一场景中的协作。
