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
  - 数字人
  - AI交互
  - 语音交互
  - 人体感知
coverAlt: AI 数字人交互封面
websiteCoverUrl: /assets/cases/digital-human-interaction-cover.png
lang: zh
translationKey: ai-digital-human-integration
---

## 项目介绍

这是一个结合语音对话与人体感知的 UE 数字人交互项目。用户说话后，系统识别语音、生成回答并合成音频，再由数字人通过声音、嘴型和表情回应。人体感知还可以获取用户的方向和动作，让角色看向用户，或通过动作触发场景交互。

我负责后端服务与 UE 数字人的集成，包括服务通信、对话流程、嘴型和表情驱动、Kinect 数据接入，以及本地、云端和混合部署下的联调。

## 系统组成

| 环节 | 本地接入方案 | 云端接入方案 |
| --- | --- | --- |
| 语音识别 | sherpa-ncnn | Azure Speech，通过 AzSpeech 接入 |
| AI 对话 | ChatGLM，或通过 Ollama 运行 DeepSeek | 网络接口调用远端大模型服务 |
| 语音合成 | ChatTTS、VITS | Azure Speech，通过 AzSpeech 接入 |
| 嘴型与表情 | Ynnk Voice Lip-sync 等音频驱动方案 | UE 接收并应用 Azure Speech 的 Viseme 等动画数据 |
| 人体感知 | Azure Kinect 骨骼数据，结合 UE 与 Control Rig | 在 UE 侧接入与处理 |
| 数字人表现 | UE、MetaHuman 的角色渲染、声音播放与动画 | 角色仍由 UE 端呈现 |

这些服务可以按部署需求组合。云端部署指 AI 服务在远端运行，数字人的渲染和场景交互仍由 UE 端完成。

## 功能实现与技术难点

### 语音对话流程集成

#### 负责的实现

将语音识别、AI 问答、语音合成与角色回应连成完整流程，处理文本、音频和动画数据的传递。UE 与后端通过 HTTP、UDP 等方式交换数据，后续也接入了使用 WebSocket 的 AI 问答后端。

对话从用户语音开始，依次经过语音识别、模型回答、音频合成，最后由角色播放。每一步的输出都需要交给下一步处理。

#### 难点与处理

语音识别、问答和语音合成各自处理不同任务，返回的数据也不一样。即使每项服务都能单独调用，仍需要将它们与角色表现配合起来，才能完成一次对话。

我按对话顺序安排服务调用，明确识别文本、回答和音频如何传到下一步，再在 UE 端配合声音播放驱动嘴型与表情。排查问题时，可以分别检查服务处理与角色回应，区分问题出在数据传递还是动画表现。

#### 相关技术记录

- [本地集成 AI 数字人交互流程](</zh/blog/ai-digital-human-integration/>)

### 数字人声音、嘴型与表情

让音频播放与嘴型、表情配合。不同服务提供的数据形式不同，UE 端除了播放声音，还需要用相应的数据驱动角色动画。

本地方案使用音频驱动嘴型和表情；云端方案则接收语音服务返回的嘴型及相关动画数据，由 UE 端应用到角色。

### 人体感知与场景互动

通过 Azure Kinect 读取骨骼数据，结合角色与场景逻辑实现视线跟随和动作触发，例如让数字人看向用户，或通过用户动作控制场景中的电梯升降。

人体感知与语音对话分别接入，前者提供位置和动作信息，后者提供对话内容，共同用于场景交互。

### 部署与流程模块化

完成纯本地、纯云端和混合三种部署方式的联调。本地服务使用 Miniconda 分别管理 Python 环境，并处理 PyTorch、CUDA 等依赖；UE 端连接相应服务，实现具体交互。

后续将原先固定的线性逻辑拆分为流程控制与功能模块。C++ 提供基础支持，蓝图实现具体交互，方便替换服务或调整流程，减少对整套角色表现逻辑的改动。
