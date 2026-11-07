---
title: "Six-axis triple-screen driving simulator"
description: "An Unreal Engine simulator for scene exploration and driving-school practice, with three screens, six-axis motion, an AI coaching backend and vehicle recording and replay."
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
  - "Simulation control"
  - "Driver training"
  - "Multi-screen display"
  - "Recording & replay"
coverAlt: "Six-axis triple-screen driving simulator cover"
websiteCoverUrl: /assets/cases/driving-simulation-cover.png
translationKey: driving-simulator-three-screen
lang: en
sourceHash: "e2fafbc1bb9c26371a878c6d7316c23966158dd2b424d41ef947f4e330b4f834"
translationStatus: translated
generatedBodyHash: "1eaa0363615ad6ae2ec8337738967ead8cf6e04fc392abfe535683d5ec6044fd"
---

## Project overview

This Unreal Engine project combines scene exploration, driving simulation and driving-school practice. Three screens present the driving environment, a six-axis platform provides motion feedback, and trainees practise vehicle controls on the simulator with an AI coach as part of the training interaction.

The system brings together scenes, vehicle simulation, device input, training workflows and coaching services. My work covers third-party vehicle model integration, plugins and client APIs, UI and settings, multi-screen rendering, platform motion processing, driving-school functions, vehicle recording and replay, and the AI coaching backend. I also worked on scene optimization and frame-rate issues.

## My responsibilities

### Scene exploration and vehicle model integration

I integrated a third-party vehicle driving model into UE scenes and connected its motion states and controls to the application. Steering, throttle, braking, gears and indicators feed the driving state system. Speed, acceleration, angular velocity and vehicle pose are available to the interface, training logic and device communication.

Scene exploration and simulated driving share the project's scenes and vehicle capabilities. My integration work connects the model to UE and the application; the underlying vehicle dynamics come from the third-party simulation model.

### Plugins and client APIs

I developed supporting functions for training workflows, vehicle states, device input, recording, replay and data storage, then exposed them through APIs for the client. C++ manages states and core logic, while Blueprints and the interface use those APIs to organize interactions.

The application can read vehicle states, start or reset training, trigger scoring events, and control recording and replay without duplicating low-level data handling across interfaces and levels.

### Client interface, CommonUI and settings

I handled UI layout and CommonUI integration for training and settings screens, including supporting buttons, activatable pages and settings list components. The interface reads and changes application state through client APIs connected to the vehicle and training systems.

| Area | Implementation |
| --- | --- |
| Interface | UI layout, CommonUI pages and buttons, input handling |
| Custom controls | Keyboard and driving-control bindings, with key-conflict prompts |
| Display | Resolution, windowed and fullscreen modes |
| Graphics | Graphics quality options and display parameters |
| Configuration | Loading, editing, saving and applying settings |

Control rebinding is connected to interface prompts. Display and graphics choices update the runtime configuration through the settings system, allowing the client to be adjusted for the device and the user's preferences.

### Driving-school training and scoring

Training is organized by project, subject and mode. Step configuration connects the workflow to scene triggers, prompts and vehicle states. The training system maintains the current step and score, with controls to start, stop and reset a session and update results when scoring events occur.

Steps use their own workflows and resources. Text, sound, images, video and scene sequences provide instructions and prompts. Results are stored by training step for later review.

### Three-screen display and six-axis motion feedback

I worked on global illumination, consistent exposure and display integration across multiple views. The three screens present a continuous driving environment, so differences in brightness and rendering affect observation and control.

On the platform side, vehicle telemetry supplies speed, acceleration, angular velocity and pose for device communication. Motion processing includes high-pass and low-pass filtering, integration, tilt coordination and angular-velocity limits. My work covers software signal processing and communication integration; the platform protocol and device parameters determine the motion range and execution.

### AI coaching backend

I built the AI coaching backend for speech-to-text, AI question handling and response generation, text-to-speech, and mouth animation synchronization, then connected these functions to the UE training scene.

Speech recognition converts the trainee's voice to text. The backend prepares a request from that text and calls the AI service to generate the coach's response. Speech synthesis then turns the response into audio, which UE plays alongside synchronized mouth animation. My work includes backend setup, AI service integration, request and response handling, and integration across the backend and UE client. The driving application manages training steps and rule-based scoring.

### Recording vehicle and model data with LevelSequence

I connected the core data from the third-party vehicle dynamics model to UE LevelSequence for recording and replay. The recording preserves the data needed to reproduce vehicle motion and model states. Playback uses those recorded values, while the system automatically fills in and generates the remaining data.

The implementation gathers relevant body and four-wheel transforms, control input, vehicle states, engine, transmission and dashboard data in a recording Actor. Nested properties are exposed for interpolation, and Take Recorder organizes recording. During playback, LevelSequence updates the recorded core data on its timeline and writes it back to the third-party model's vehicle replay streams for state reconstruction and automatic completion of the remaining data. My work focuses on connecting the recording and playback data paths and keeping replay data consistent with the original driving states.

The supporting APIs provide playback start and end times, playback rate, stop controls and completion notifications. Take Recorder recording runs in the UE editor; LevelSequence organizes and plays the recorded result.

### Driving-session and result records

The application captures steering, throttle, braking, speed, head direction, vehicle position and direction. Continuous values form curves over time. Gear and indicator changes are stored separately so they can be located alongside operating trends.

Session data and results are saved separately as JSON. Session data preserves control details, while result records store scoring events and time information by training step. Vehicle and model replay handles scene reproduction. An earlier version also integrated UE Network Replay with recording, playback, listing, renaming and deletion controls.

## Technical challenges

### Bringing vehicle simulation states onto the UE timeline

Vehicle replay needs to reproduce states from the third-party dynamics model. Body and wheel motion also involves control input, engine and transmission data. Recording must preserve the core states so that playback can use them to reproduce the model's behaviour, with the remaining data filled in automatically.

I organized the relevant states as recordable, interpolated properties, built read and write paths between the vehicle replay streams and LevelSequence, and handled mode changes between recording, playback and stopping. The challenge was to write the timeline's core data back to the third-party model correctly, keep vehicle motion and model states consistent with the original recording, and connect the automatic completion of the remaining data.

### Coordinating coaching audio and mouth animation

The interaction from trainee speech to a character response passes through speech recognition, AI request handling and response generation, speech synthesis, and UE audio and mouth animation playback. Recognized text goes to the AI service, the generated response goes to speech synthesis, and audio playback needs to stay synchronized with mouth animation.

I built the backend flow, integrated the AI service and handled requests and responses, then connected the generated speech to the UE character and worked through the complete interaction. The coaching backend provides the interaction, while the driving system manages steps, vehicle states and scoring.

### Inconsistent lighting and exposure across three screens

In the historical UE 5.3 implementation, view-count limits in related rendering data affected global illumination in the third view. Multiple LocalPlayers calculating exposure independently could also produce different brightness levels within the same driving scene.

I investigated and addressed the multiview GI limits and adjusted StereoPass settings for secondary views through a custom LocalPlayer to connect their exposure data. These changes target the engine versions used at the time; later versions require their corresponding implementations to be checked.

### Scene complexity and vehicle updates

Driving simulation continuously updates vehicle motion, device input, several views and the interface. A low frame rate affects visual smoothness and can expose problems in how vehicle updates handle frame timing.

I worked on scene optimization and runtime stalls, investigated multi-screen rendering and vehicle update paths, and addressed rear-view mirror ghosting and abnormally reduced vehicle speed at low frame rates. Scene rendering, vehicle motion and device input were checked separately before integration testing in the project.

## Results and version scope

The project combines three-screen display and six-axis motion feedback for scene exploration and driving-school practice, with an AI coaching backend. Client APIs expose vehicle, training and data functions. Session details and results can be stored and queried, while LevelSequence records and replays the vehicle and its model states.

The vehicle model uses third-party simulation capabilities. My contribution covers application integration, supporting plugins and training functions. Historical rendering work targets UE 5.3 and 5.3.2; a later project version includes a UE 5.5 configuration. Recording, replay and display integration are maintained for their respective versions.

## Related records

- [Driving-session recording and UE replay management](/blog/driving-session-replay/): session capture, JSON storage, result records and the earlier Network Replay integration.
- [Fixing missing GI in multiple views](/blog/ue53-multiview-gi/): multiview global illumination integration in UE 5.3.
- [Synchronizing exposure across multiple screens](/blog/cnblogs-19165561/): LocalPlayer, StereoPass and exposure data handling.
