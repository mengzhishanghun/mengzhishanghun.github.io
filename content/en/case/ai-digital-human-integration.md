---
title: Integrating an AI Digital Human Interaction Workflow
description: Connecting a digital human, speech recognition, conversation, speech synthesis, and facial expression driving into a local demonstration workflow.
type: case
slug: ai-digital-human-integration
categoryId: ue-projects
categoryName: Unreal Engine Projects
categoryOrder: 0
status: Completed
featured: false
draft: false
sitePublish: true
tags:
  - AI
  - MetaHuman
  - Voice interaction
coverAlt: Flowchart of the AI digital human interaction integration workflow
websiteCoverUrl: /assets/cases/ai-digital-human-integration.png
lang: en
translationKey: ai-digital-human-integration
sourceHash: 9041c7c3c3537ffd0f0ef09a988e764e916d7bf5c11c6a65315fcc77b4823c2d
translationStatus: translated
generatedBodyHash: 28aa93ac35361c66cf219863814f6123821fc2ed8810aa918e6a3cafd3241dd9
---

## Background

In a local digital human demonstration, I worked on integrating voice interaction, facial expression driving, and body pose input. The goal was for the digital human to receive speech, generate replies, and present them through voice and expressions, rather than only play character animations prepared in advance.

The work involved several input and output stages. This case focuses on connecting them into an interaction workflow that could be demonstrated.

## Reproduction Environment

The demonstration used Unreal Engine and MetaHuman for the digital human presentation, together with Kinect and ControlRig for body pose capture and eye tracking.

The voice pipeline included speech recognition, Chat conversation, and TTS speech synthesis. The character also needed facial expression driving.

## Specific Problem

The digital human's interaction depended on the entire pipeline working together: voice input needed to become conversation content, replies needed to become audio, and the character's presentation needed to coordinate with expressions and pose input.

Completing only one stage would still leave the full process from user input to digital human response unavailable for demonstration. Integration therefore needed to address both data flow and character presentation.

## Solution

Using MetaHuman as the character foundation, I connected speech recognition, Chat, and TTS to link voice input, reply generation, and voice output, then added facial expression driving so the digital human could present the replies.

Kinect and ControlRig workflows handled body pose and eye input, joining voice interaction in the local demonstration. The two types of input supported conversation and character presentation respectively and were ultimately shown in the same scene.

## Final Summary

The work produced a local AI digital human interaction workflow suitable for demonstration, including voice conversation, facial expression driving, and interactions involving pose and eye input.

The demonstration connected voice input with character responses while incorporating pose and eye input, showing how several interaction stages worked together in one scene.
