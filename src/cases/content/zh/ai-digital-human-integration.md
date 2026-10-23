---
title: 本地集成 AI 数字人交互流程
description: 在 Unreal Engine 中接入语音识别、大模型问答、语音合成和嘴型驱动，完成纯本地、纯云端和混合三种部署方式。
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
coverAlt: 本地集成 AI 数字人交互流程的流程图
websiteCoverUrl: /assets/cases/ai-digital-human-integration.png
lang: zh
translationKey: ai-digital-human-integration
---

## 背景介绍

这个项目需要让数字人接收用户的语音、生成回答，再通过声音、嘴型和表情作出回应。同时接入人体感知，让角色能够跟随用户的方向看过去，并根据用户动作触发场景交互。

我负责相关服务与 UE 数字人表现的集成，包括服务通信、交互流程组织，以及不同部署方式下的联调。

## 复现环境

数字人使用 Unreal Engine 和 MetaHuman，交互逻辑结合 C++ 与蓝图实现。工程中的相关实现方案如下，不同部署方式按需组合。

| 功能 | 本地方案 | 云端方案 |
|---|---|---|
| 语音识别 | sherpa-ncnn，将用户语音转换为文本。 | Microsoft Azure Speech，通过 AzSpeech 接入。 |
| AI 对话 | ChatGLM，或通过 Ollama 运行 DeepSeek。 | 通过网络接口调用远端大模型服务。 |
| 语音合成 | ChatTTS、VITS，将回答文本转换为语音。 | Microsoft Azure Speech，通过 AzSpeech 接入。 |
| 嘴型与表情驱动 | Ynnk Voice Lip-sync，根据音频生成嘴型并驱动角色表现。 | Azure Speech 提供 Viseme 嘴型及相关动画数据接口，由 UE 端接收并应用。 |
| 人体感知与交互 | Azure Kinect 采集人体骨骼数据，结合 UE 和 Control Rig 处理角色与场景交互。 | — |
| 数字人表现 | Unreal Engine、MetaHuman，负责角色渲染、语音播放和动画表现。 | — |

本地服务使用 Miniconda 分别管理 Python 环境，并处理 PyTorch、CUDA 等依赖。UE 与后端通过 HTTP、UDP 等方式交换数据，后续也接入了使用 WebSocket 通信的 AI 问答后端。

这里的“云端部署”指 AI 服务运行在远端，数字人的渲染和场景交互仍由 UE 端完成。

## 具体问题

语音交互需要串联多个独立环节：语音识别先输出文本，大模型根据文本生成回答，语音合成再将回答转换为音频，最后由角色端播放声音并呈现嘴型。

人体感知是另一条输入链路。角色控制与场景逻辑处理用户的位置和骨骼动作，与语音对话配合完成交互。

同时，项目需要适配不同的服务部署方式，既能连接本地服务，也能接入远端服务，或将两者组合使用。

## 解决方案

语音交互按以下流程组织：

**用户说话 → 语音识别 → 大模型生成回答 → 语音合成 → 数字人播放声音并呈现嘴型、表情。**

语音识别、对话、语音合成和角色表现以独立功能模块接入，由流程控制逻辑组织执行。UE 端负责场景与角色，后端服务负责对应的 AI 处理。

部署上完成了三种方式：

- **纯本地部署：** 所有服务运行在本地，包括语音识别、大模型问答、语音合成和嘴型驱动。
- **纯云端部署：** AI 处理通过网络调用远端服务，UE 接收结果并呈现数字人的回应。
- **混合部署：** 部分服务运行在本地，其余通过网络调用，接入同一套交互流程。

人体交互通过 Azure Kinect 读取骨骼数据，实现用户动作与场景的联动，例如控制电梯升降，以及让数字人的视线跟随用户。

后续还将原先固定的线性流程拆分为流程控制与功能模块。C++ 提供基础支持，蓝图组织具体交互，方便调整流程和替换服务。

## 相关需求

如果你正在开发数字人接待、语音问答或展厅互动项目，我可以协助接入语音识别、大模型对话、语音合成和嘴型驱动，也可以为已有 UE 项目补充人体感知与场景交互。

部署方式可以根据现场网络、设备配置和数据处理要求，选择纯本地、云端或混合方案。

有相关需求，欢迎[联系我聊聊](https://mzsh.me/zh/contact/)。
