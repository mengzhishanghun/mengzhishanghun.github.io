---
title: AI digital human interaction
description: An Unreal Engine digital human integrating speech recognition, AI conversation, voice, lip sync and body sensing across local and cloud services.
type: case
slug: digital-human-interaction
categoryId: ue-projects
categoryName: Unreal Engine Projects
categoryOrder: 0
order: 3
status: Completed
featured: true
draft: false
sitePublish: true
tags:
  - AI
  - Digital humans
  - Voice interaction
coverAlt: AI concept cover for AI digital human interaction, not a project screenshot
websiteCoverUrl: /assets/cases/digital-human-interaction-cover.png
translationKey: ai-digital-human-integration
lang: en
sourceHash: 823683128e8f1cc14f647f26695a4fc053634332ddd0bb72e9fb964e193744e8
translationStatus: translated
generatedBodyHash: 0b11264f50dc8a1fc68cc72ee01ec3ba7bdba5bb0269fe92810b9d4a443d2561
---

## Project overview

The digital human receives speech, generates an answer and responds through voice, lip movements and expressions. Body sensing provides a second input for gaze following and gesture-driven scene interaction.

## My contribution

- Integrated service communication between speech recognition, language models, speech synthesis and the UE character.
- Coordinated audio playback, lip sync and expressions within the conversation flow.
- Connected Kinect skeleton data to gaze following and gesture-driven scene interaction.
- Integrated local, cloud and hybrid service deployments and separated flow control from functional modules.

## Implementation and results

Unreal Engine and MetaHuman handle character rendering and scene presentation, while backend services provide AI processing. C++ supports the integration and Blueprints organize specific interactions.

Local, cloud and hybrid configurations share the interaction flow. Cloud deployment refers to remote AI services; character rendering and scene interaction remain in UE.

## Technical notes

- [Integrating an AI digital human interaction workflow](/blog/ai-digital-human-integration/)
