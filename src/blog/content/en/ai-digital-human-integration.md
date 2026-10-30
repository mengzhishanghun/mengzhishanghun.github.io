---
title: Local Integration of an AI Digital Human Interaction Workflow
description: Integrating speech recognition, LLM responses, speech synthesis, and lip sync in Unreal Engine, with local, cloud, and hybrid deployments.
type: blog
slug: ai-digital-human-integration
categoryId: blog-5b81b3e117a9
categoryName: Unreal Engine
categoryOrder: 0
status: Published
featured: false
draft: false
sitePublish: true
tags:
  - AI
  - MetaHuman
  - Voice interaction
coverAlt: Flowchart of the local integration of an AI digital human interaction workflow
websiteCoverUrl: /assets/cases/ai-digital-human-integration.png
lang: en
translationKey: ai-digital-human-integration
date: 2026-10-29
publishedAt: 2026-10-29
sourceHash: 80adf253a4b436e40ada9da5a688da43fb4600810c5978dffae688947ac34300
translationStatus: translated
generatedBodyHash: 1c8793d43b71f71372ddf70c693953ea180de9347a29c92bc43c6c3e05ee6a2e
---

## Background

This project needed a digital human to receive the user's speech, generate a response, and reply through voice, lip movements, and facial expressions. Body sensing was also integrated so the character could look toward the user and trigger scene interactions based on their movements.

I integrated the services with the digital human presentation in UE, covering service communication, interaction flow, and integration testing across the deployment options.

## Reproduction Environment

The digital human uses Unreal Engine and MetaHuman, with interaction logic implemented in C++ and Blueprints. The project includes the following implementations, combined as needed for each deployment.

| Function | Local implementation | Cloud implementation |
|---|---|---|
| Speech recognition | sherpa-ncnn converts the user's speech to text. | Microsoft Azure Speech, integrated through AzSpeech. |
| AI conversation | ChatGLM, or DeepSeek running through Ollama. | Remote LLM services accessed through network APIs. |
| Speech synthesis | ChatTTS and VITS convert response text to speech. | Microsoft Azure Speech, integrated through AzSpeech. |
| Lip sync and facial animation | Ynnk Voice Lip-sync generates lip movements from audio and drives the character's animation. | Azure Speech provides Viseme and related animation data interfaces; UE receives and applies the data. |
| Body sensing and interaction | Azure Kinect captures body skeleton data, with UE and Control Rig handling character and scene interactions. | — |
| Digital human presentation | Unreal Engine and MetaHuman handle character rendering, audio playback, and animation. | — |

Local services use separate Python environments managed with Miniconda, with dependencies such as PyTorch and CUDA configured as needed. UE exchanges data with the backend through HTTP and UDP. A backend using WebSocket communication was integrated later for AI questions and answers.

Here, cloud deployment refers to AI services running remotely. UE still handles the digital human's rendering and scene interactions.

## Specific Problem

Voice interaction connects several independent stages: speech recognition produces text, the LLM generates a response from that text, speech synthesis converts the response into audio, and the character plays the audio and presents lip movements.

Body sensing provides a separate input path. The user's position and skeleton movements feed into character control and scene logic, working alongside voice conversation.

The project also needed to support different service locations: local services, remote services accessed over a network, and combinations of the two.

## Solution

The voice interaction follows this sequence:

**User speech → speech recognition → LLM response → speech synthesis → digital human audio playback, lip sync, and facial expressions.**

Speech recognition, conversation, speech synthesis, and character presentation are integrated as separate functional modules, with flow-control logic coordinating their execution. UE handles the scene and character, while the backend services perform their respective AI processing.

Three deployment options were completed:

- **Fully local:** All services run locally, including speech recognition, LLM responses, speech synthesis, and lip sync.
- **Cloud:** AI processing uses remote services over a network, and UE receives the results to present the digital human's response.
- **Hybrid:** Some services run locally and others are accessed over a network, within the same interaction flow.

Azure Kinect provides body skeleton data that connects user movements to scene interactions, such as controlling an elevator and making the digital human's gaze follow the user.

The original fixed linear sequence was later split into flow control and functional modules. C++ provides the supporting functions, while Blueprints organize the specific interactions, making it easier to adjust the flow and replace services.

## Project overview

[AI digital human interaction](/cases/digital-human-interaction/)
