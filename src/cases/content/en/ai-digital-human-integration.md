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
  - "Digital humans"
  - "AI interaction"
  - "Voice interaction"
  - "Body sensing"
coverAlt: AI digital human interaction cover
websiteCoverUrl: /assets/cases/digital-human-interaction-cover.png
translationKey: ai-digital-human-integration
lang: en
sourceHash: 61ebb979c6bd6711f46e7999c36fbd04a4d1977e70f1f5435d0e247f689bb225
translationStatus: translated
generatedBodyHash: 1727d61217abbe066ea1f75e8b9bf64aba0e210dfbf5b37ce973ec3dc2dbab8c
---

## Project overview

This project integrates voice conversation and body sensing with a UE digital human. The system recognizes a user's speech, generates a response and synthesizes audio. The character responds through voice, lip movement and expressions. Body sensing provides another input for gaze following and gestures that trigger scene interactions.

I integrated backend services with the UE character, including communication, conversation flow, lip and expression driving, Kinect data, and testing local, cloud and mixed service deployments.

## System components

| Stage | Local integration | Cloud integration |
| --- | --- | --- |
| Speech recognition | sherpa-ncnn | Azure Speech through AzSpeech |
| AI conversation | ChatGLM, or DeepSeek through Ollama | Remote language model services accessed over the network |
| Speech synthesis | ChatTTS and VITS | Azure Speech through AzSpeech |
| Lip movement and expressions | Audio-driven solutions such as Ynnk Voice Lip-sync | UE receives and applies Viseme and related animation data from Azure Speech |
| Body sensing | Azure Kinect skeleton data with UE and Control Rig | Integrated and processed on the UE side |
| Character presentation | UE and MetaHuman rendering, audio and animation | The character remains rendered by UE |

The services are combined as needed for each deployment. Cloud deployment refers to remote AI processing; rendering and scene interaction remain on the UE side.

## Features I worked on

### Voice conversation integration

I connected speech recognition, AI responses, speech synthesis and character playback, organizing the transfer of text, audio and presentation data. UE communicates with services through HTTP and UDP, with a WebSocket-based AI backend integrated later.

The flow handles user speech, recognition text, model responses, synthesized audio and character playback in sequence, giving each stage a defined input and output.

### Character voice, lip movement and expressions

I coordinated audio playback with lip and expression driving. Services provide different kinds of output, which must be applied to the character in UE rather than treated only as an audio file.

The local integration uses audio-driven solutions. The cloud integration receives mouth-shape and related animation data from the speech service and applies it on the UE side.

### Body sensing and scene interaction

Azure Kinect skeleton data feeds character and scene logic for gaze following and gesture triggers. Examples include having the character look toward the user and using body movement to control an elevator in the scene.

Body sensing and voice conversation are separate inputs: one supplies position and motion, the other supplies dialogue content. They are combined in the scene's interactions.

### Deployment and modular flow

I integrated and tested local-only, cloud-only and mixed service arrangements. Local Python environments are managed with Miniconda, including PyTorch and CUDA dependencies. UE connects to the corresponding services and coordinates the interaction.

The original fixed linear logic was later separated into flow control and functional modules. C++ provides underlying support, while Blueprints organize application interactions, allowing service replacement and flow changes without changing the entire character presentation at the same time.

## Challenges and implementation

### Turning separate services into a continuous response

Recognition, conversation and synthesis perform different tasks and return different data. Connecting them individually does not produce a complete character conversation by itself.

I organized service calls and character presentation into a flow, defining how recognized text, a generated response and audio proceed to the next stage. UE then connects playback with lip movement and expressions. Service processing and character behaviour can be inspected separately.

### Supporting different deployment arrangements

Local deployments require model environments, cloud deployments require remote interfaces, and mixed deployments must feed both kinds of output into the same UE interaction.

I separated recognition, conversation, synthesis and presentation into integration modules coordinated by flow control. Changing deployment primarily changes the service combination and connections; UE continues to handle the scene, character and interaction.

### Combining conversation with body sensing

Voice processing advances through recognition and generated results, while body sensing continually supplies position and skeleton motion. The data and uses are different.

The project integrates these inputs separately: voice provides the conversation, while body sensing drives gaze and scene actions. Specific interactions then combine them.

## Results and scope

The project integrates speech recognition, AI responses, speech synthesis and character presentation, with body sensing for gaze and gesture triggers. Local, cloud and mixed service combinations were integrated and tested, and flow control was separated from functional modules.

My work covers service integration, flow organization and UE presentation. Recognition, language models and synthesis use existing solutions. Response speed and resource use depend on the selected models, hardware and network conditions.

## Related records

- [Integrating a local AI digital human workflow](/blog/ai-digital-human-integration/): services, local environments, communication, deployment combinations and body interaction.
