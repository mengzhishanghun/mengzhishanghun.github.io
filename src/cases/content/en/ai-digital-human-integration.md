---
title: AI digital human interaction
description: "A UE digital human project supporting local and cloud language model switching, voice conversation, gaze following, phrase effects and responses to human behaviour."
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
sourceHash: "01ac01ee15277503ef0ddc3241e4c624d9407a708e8b6c3b5aeb6003d321911e"
translationStatus: translated
generatedBodyHash: "c21bfbfd606cf830438e18678381c322cda5122fe901fb3c82d0035819b66e61"
---

## Project overview

This UE digital human project combines voice conversation, body sensing and scene interaction. Its versions address related requirements: talking with users, carrying out actions in response to language, following a person with the character's gaze, and responding when people enter, stop or move.

Conversation is the core function. User speech is converted to text, a language model returns a written answer, and speech synthesis generates audio. That audio then drives the character's lip movement and expressions. The model can run locally through Ollama or use a cloud service, with switching between the two. Speech recognition, conversation and synthesis can be combined in local, cloud or mixed deployments.

The project developed a shared character foundation, interaction flows and functional modules for use across its versions. Service interfaces, trigger conditions, character animation and scene responses can be adjusted to build new interactions from existing functions.

## My contribution

I integrated AI services with the UE characters, including speech recognition, language model calls, speech synthesis and switching between local and cloud services. I also handled integration testing for lip movement, expressions, body sensing and scene effects. My work included the flow and module framework, module execution, data transfer, character state and flow switching.

| Area | Work |
| --- | --- |
| Speech and language models | Integrating recognition, conversation and synthesis services, and passing text and audio between them |
| Local and cloud services | Connecting local models through Ollama, integrating remote services and supporting switching |
| Character performance | Driving lips and expressions from audio, integrating gaze control and character animation |
| Scene interaction | Phrase-triggered effects, lighting, character actions and body-sensing interactions |
| Shared foundation | Organizing flows, modules, shared state and configuration for related requirements |

## Features and implementation

### The voice conversation flow

The flow consists of speech recognition, language model conversation, speech synthesis and character performance. Recognition produces text, the model returns an answer as text, and synthesis converts that answer into speech.

| Stage | Input | Output |
| --- | --- | --- |
| Speech recognition | User speech | Recognized text |
| Language model | Recognized text | Answer text |
| Speech synthesis | Answer text | Generated speech |
| Character performance | Generated speech and corresponding animation data | Audio playback, lip movement and expressions |

I connected these stages in UE, passing each result to the next stage. Once speech has been generated, it drives lip movement and expressions as the character responds in the scene.

Recognition, the model and synthesis each handle their own task. Replacing one service mainly involves adapting that stage's interface and data processing, then passing its text or audio to the following modules and character performance.

#### Related technical record

- [Local AI digital human integration workflow](/blog/ai-digital-human-integration/)

### Ollama models and cloud service switching

The local setup runs a language model, such as DeepSeek, through Ollama. Recognized text is sent to the local model, and its written answer is passed to speech synthesis. The project also integrated ChatGLM, with the corresponding conversation module handling each model's calls.

The cloud setup calls remote language model services over network interfaces. I integrated both setups and switching between them so the project could use local or cloud services as needed. UE continues to handle rendering, audio playback, animation and scene interaction.

Speech recognition and synthesis also have local and cloud options. Combined with the model service, these can use fully local services, cloud services or a mixture of both. Switching a setup requires handling requests and returned data according to that service's interface before connecting it to the rest of the flow.

### Speech recognition and interaction input

Local recognition uses sherpa-ncnn, while the cloud option calls Azure Speech through AzSpeech. I connected user audio to the selected service and passed recognized text into the conversation flow.

That text can be used for model conversation, with configured phrases and scene logic contributing to the response. Speech integration and scene effects are handled separately; subsequent functional modules control the characters and objects in the scene.

### Configured phrases and scene effects

The conversation flow checks for configured phrases. A match invokes the corresponding command module, allowing language to trigger character actions or change the scene.

Related commands include turning lights on and off, starting a dance and ending a dance. These connect voice conversation with lighting and character actions, giving the character a way to respond through behaviour in the scene.

I integrated phrase detection, command execution and character performance as separate parts of the flow. Each effect is implemented by its functional module and can be combined with existing lighting, animation and scene-control logic.

### Speech, lips, expressions and character animation

After the model returns answer text, speech synthesis generates audio. Local options include ChatTTS and VITS; the cloud option calls Azure Speech through AzSpeech. The generated audio is played by the character and used for subsequent lip and expression driving.

Local options use audio-driven solutions such as Ynnk Voice Lip-sync. The cloud option receives Viseme and related animation data from Azure Speech and applies it to the character in UE. I connected audio playback and the corresponding lip and facial animation to the same response flow.

The character distinguishes states such as idle, thinking and speaking, with body and facial animation controlled separately. Both have idle animation pools. Configuration selects animations and sets playback offsets, start delays and end delays.

Voice responses, preset actions and behaviour triggers share the character's animation playback interfaces. The interaction flow decides when each action runs.

### Camera-based person tracking and gaze following

Camera input provides a person's position and updates the character's gaze target. As the user moves within the interaction area, the character adjusts its gaze to look toward the person during conversation.

Azure Kinect provides body-joint positions. The character calculates orientation from the target position and uses facial controls to adjust the eye target. I connected position data to UE and Control Rig so eye orientation updates with the target.

Position and movement also support other scene interactions, such as controlling an elevator through user actions. Body sensing and speech provide separate inputs, while the interaction flow coordinates the character and scene responses.

### Behaviour sensing and automatic triggers

The project also responds to people's behaviour. Separate detection modules read position, movement and person-count data, then compare it with configured conditions. When a condition is met, a corresponding preset animation is selected as the character's response.

| Detection or trigger | Implementation |
| --- | --- |
| Entry and departure | Detecting entry or departure changes and triggering the corresponding preset animation |
| Distance changes | Responding to distance and approach or retreat conditions |
| Remaining in place | Combining a movement range and dwell time to detect a person stopping |
| Movement speed | Detecting speed and acceleration or deceleration conditions |
| Person-count changes | Responding to increases, decreases and configured count ranges |
| No interaction for a period | Tracking time without interaction and triggering a preset behaviour when the configured condition is met |
| Scheduled animation | Triggering animation at configured times using the corresponding candidate pool |
| Scheduled lighting | Using timer logic to switch scene lighting on and off |

Each module stores the state it needs. Distance and speed detection retain the previous state, dwell detection combines position range with elapsed time, and inactivity detection tracks time. The selected modules are configured with detection conditions and animation responses, then added to the character flow.

Phrase triggers and behaviour triggers share character performance and scene-control functions. One responds to conversation content; the other responds to person state or timing conditions. Their configuration and modules determine the response.

### Reusable flows and functional modules

To support related requirements, I split fixed linear logic into a character foundation, flow control and functional modules. C++ provides initialization, start, update, stop and cleanup interfaces. Blueprints implement service calls, behaviour detection and scene interactions.

Flow presets are stored in configuration assets. A character creates its own instance when loading a flow and can start it immediately if selected. The flow loads, starts and stops modules by name, and updates running modules each frame. On completion, a module reports success or failure through a callback so subsequent logic can decide how to continue.

Modules exchange Boolean values, strings and object references through shared state. The flow schedules execution, each module handles its own function, shared state passes data, and the character handles sound and animation. Related interactions can combine existing modules with additional service calls or scene actions.

Flow switching also requires input bindings and instances to be cleaned up. Stopping removes the flow's key listeners. Unloading first clears the character's reference to the current flow, then calls cleanup logic to avoid repeated unload calls during cleanup. The flow manages module execution through stop, completion callback and cleanup interfaces.

## Technologies and service integration

These options were used across different project versions and combined according to their requirements.

| Stage | Local integration | Cloud integration |
| --- | --- | --- |
| Speech recognition | sherpa-ncnn | Azure Speech through AzSpeech |
| Language model conversation | Local models such as DeepSeek through Ollama; the project also integrated ChatGLM | Remote language model services called over network interfaces |
| Speech synthesis | ChatTTS and VITS | Azure Speech through AzSpeech |
| Lip movement and expressions | Audio-driven solutions such as Ynnk Voice Lip-sync | UE receives and applies Viseme and related animation data from Azure Speech |
| Body sensing | Azure Kinect skeleton data with UE and Control Rig | Integrated and processed in UE |
| Character performance | UE and MetaHuman rendering, audio playback and animation | The character is still presented in UE |

UE exchanges data with backend services through HTTP and UDP. A later integration also used a WebSocket conversation backend. Each service module handles its requests and returned data, and the flow passes recognized text, model answers, speech and animation data to the next stage.

Local services use separate Python environments managed with Miniconda, including PyTorch and CUDA dependencies. I configured the service environments, connected their interfaces and tested data transfer and character responses with the UE side.
