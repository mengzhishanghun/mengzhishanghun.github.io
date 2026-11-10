---
title: Six-axis triple-screen driving simulator
description: An Unreal Engine simulator for scene exploration and driving-school practice, with three screens, six-axis motion, an AI coaching backend and vehicle recording and replay.
type: case
slug: driving-simulation
categoryId: ue-projects
categoryName: Unreal Engine Projects
categoryOrder: 0
order: 0
status: Completed
featured: true
draft: false
sitePublish: true
tags:
  - Simulation control
  - Driver training
  - Multi-screen display
  - Recording & replay
coverAlt: Six-axis triple-screen driving simulator cover
websiteCoverUrl: /assets/cases/driving-simulation-cover.png
translationKey: driving-simulator-three-screen
lang: en
sourceHash: "07818b480b12aeb4dd84fe42c8992ad2b1318ffaeb16a00f2a5cce7bdf3bce0c"
translationStatus: translated
generatedBodyHash: "cb044f74f89c1c2fe531693f962d5ae5ec11c60ea2fa877ac1db34de88c1e7a0"
---

## Project overview

This Unreal Engine project combines scene exploration, driving simulation and driving-school practice. Three screens present the driving environment, a six-axis platform provides motion feedback, and trainees practise vehicle controls on the simulator with an AI coach as part of the training interaction.

The system brings together scenes, vehicle simulation, device input, training workflows and coaching services. My work covers third-party vehicle model integration, plugins and client APIs, UI and settings, multi-screen rendering, platform motion processing, driving-school functions, vehicle recording and replay, and the AI coaching backend. I also worked on scene optimization and frame-rate issues.

## Features and implementation

### Scene exploration and vehicle model integration

I integrated a third-party vehicle driving model into UE scenes and connected its motion states and controls to the application. Steering, throttle, braking, gears and indicators feed the driving state system. Speed, acceleration, angular velocity and vehicle pose are available to the interface, training logic and device communication.

Scene exploration and simulated driving share the project's scenes and vehicle capabilities. My integration work connects the model to UE and the application; the underlying vehicle dynamics come from the third-party simulation model.

### Plugins and client APIs

I developed supporting functions for training workflows, vehicle states, device input, recording, replay and data storage, then exposed them through APIs for the client. C++ manages states and core logic, while Blueprints and the interface use those APIs to organize interactions.

The application can read vehicle states, start or reset training, trigger scoring events, and control recording and replay without duplicating low-level data handling across interfaces and levels.

### Client interface, CommonUI and settings

#### Implementation

I handled UI layout and CommonUI integration for training and settings screens, including supporting buttons, activatable pages and settings list components. The interface reads and changes application state through client APIs connected to the vehicle and training systems.

| Area | Implementation |
| --- | --- |
| Interface | UI layout, CommonUI pages and buttons, input handling |
| Custom controls | Keyboard and driving-control bindings, with key-conflict prompts |
| Display | Resolution, windowed and fullscreen modes |
| Graphics | Graphics quality options and display parameters |
| Configuration | Loading, editing, saving and applying settings |

Control rebinding is connected to interface prompts. Display and graphics choices update the runtime configuration through the settings system, allowing the client to be adjusted for the device and the user's preferences.

#### Challenges and implementation

In a UE 5.3.2 Surround setup, the fullscreen resolution can be restricted to the size of a single monitor, leaving only one screen active.

I handled resolution and fullscreen application by adding the `ForceRes` parameter and requesting the resolution at startup to avoid that single-monitor restriction. The change targets the engine version and multi-monitor setup used at the time.

#### Related blog

- [When Only One Monitor Displays in Multi-Monitor Fullscreen](/blog/cnblogs-19174288/): the cause, parameter handling and resolution enumeration.

### Driving-school training and scoring

Training is organized by project, subject and mode. Step configuration connects the workflow to scene triggers, prompts and vehicle states. The training system maintains the current step and score, with controls to start, stop and reset a session and update results when scoring events occur.

Steps use their own workflows and resources. Text, sound, images, video and scene sequences provide instructions and prompts. Results are stored by training step for later review.

### Three-screen display integration

#### Implementation

I worked on global illumination, consistent exposure and display integration across multiple views. The three screens present a continuous driving environment, so differences in brightness and rendering affect observation and control.

#### Challenges and implementation

In the historical UE 5.3 implementation, view-count limits in related rendering data affected global illumination in the third view. Multiple LocalPlayers calculating exposure independently could also produce different brightness levels within the same driving scene.

I investigated and addressed the multiview GI limits and adjusted StereoPass settings for secondary views through a custom LocalPlayer so the views share exposure calculation data. These changes target the engine versions used at the time; later versions require their corresponding implementations to be checked.

#### Related blogs

- [Fixing Missing GI Across Multiple Views in UE 5.3](/blog/ue53-multiview-gi/): source adaptation for missing GI in a three-screen setup.
- [Synchronizing Exposure Across Multiple Screens](/blog/cnblogs-19165561/): secondary-view StereoPass settings and shared exposure data.

### Six-axis motion feedback

Vehicle telemetry supplies speed, acceleration, angular velocity and pose for device communication. Motion processing includes high-pass and low-pass filtering, integration, tilt coordination and angular-velocity limits. My work covers software signal processing and communication integration; the platform protocol and device parameters determine the motion range and execution.

### AI coaching backend

#### Implementation

I built the AI coaching backend for speech-to-text, AI question handling and response generation, text-to-speech, and mouth animation synchronization, then connected these functions to the UE training scene.

Speech recognition converts the trainee's voice to text. The backend prepares a request from that text and calls the AI service to generate the coach's response. Speech synthesis then turns the response into audio, which UE plays alongside synchronized mouth animation. My work includes backend setup, AI service integration, request and response handling, and integration across the backend and UE client. The driving application manages training steps and rule-based scoring.

#### Challenges and implementation

Speech recognition, AI responses, synthesis and UE character presentation are separate parts of the system. Text requests, response text, audio and character playback need to pass between them, while sound and mouth animation stay synchronized.

I built the backend flow, connected the services to UE audio and mouth animation, and worked through the complete interaction from trainee speech to the coach's response. The coaching backend handles the interaction, while the driving system manages training steps, vehicle states and scoring.

#### Related technical record

- [Local Integration of an AI Digital Human Interaction Workflow](/blog/ai-digital-human-integration/): speech recognition, AI dialogue, synthesis and lip animation integration in the digital-human project.

### Recording vehicle and model data with LevelSequence

#### Implementation

I connected the core data from the third-party vehicle dynamics model to UE LevelSequence for recording and replay. The recording preserves the data needed to reproduce vehicle motion and model states. Playback uses those recorded values, and the system calculates the remaining data from them.

The implementation gathers relevant body and four-wheel transforms, control input, vehicle states, engine, transmission and dashboard data in a recording Actor. Nested properties are exposed for interpolation, and Take Recorder organizes recording. During playback, LevelSequence updates the recorded core data on its timeline and writes it back to the third-party model's vehicle replay streams. The system uses that data to reconstruct vehicle states and calculate the remaining data. My work focuses on connecting the recording and playback data paths and keeping replay data consistent with the original driving states.

The supporting APIs provide playback start and end times, playback rate, stop controls and completion notifications. Take Recorder recording runs in the UE editor; LevelSequence organizes and plays the recorded result.

#### Challenges and implementation

Replay needs to write the timeline's core data back to the third-party model correctly, keep motion and model states consistent with the recording, and connect the calculation of the remaining data. The model also contains nested struct properties that need to participate in Sequence recording.

I recursively traverse the relevant struct properties and set `CPF_Interp`, build read and write paths between the vehicle replay streams and LevelSequence, and handle mode changes between recording, playback and stopping.

#### Related blog

- [Traversing Actor Properties for Sequence Recording](/blog/cnblogs-19165520/): recursively marking struct properties for Sequence recording.

### Driving-session and result records

The application captures steering, throttle, braking, speed, head direction, vehicle position and direction. Continuous values form curves over time. Gear and indicator changes are stored separately so they can be located alongside operating trends.

Session data and results are saved separately as JSON. Session data preserves control details, while result records store scoring events and time information by training step. Vehicle and model replay handles scene reproduction. An earlier version also integrated UE Network Replay with recording, playback, listing, renaming and deletion controls.

#### Related technical record

- [Driving Session Recording and UE Replay Management](/blog/driving-session-replay/): session capture, JSON storage, results and earlier Network Replay integration. The preceding section describes LevelSequence vehicle-model replay.

### Scene and frame-rate optimization

#### Implementation

I worked on scene optimization and runtime stalls, investigated multi-screen rendering and vehicle update paths, and addressed rear-view mirror ghosting and abnormally reduced vehicle speed at low frame rates.

#### Challenges and implementation

Driving simulation continuously updates vehicle motion, device input, several views and the interface. A low frame rate affects visual smoothness and can expose problems in how vehicle updates handle frame timing.

I checked scene rendering, vehicle motion and device input separately, then verified adjustments through integration in the running project.
