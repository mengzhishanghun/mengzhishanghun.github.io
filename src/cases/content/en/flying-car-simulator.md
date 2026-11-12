---
title: Flight simulation
description: "A UE and AirSim VR flight simulation project with flight stick integration, flight control adaptation, camera configuration and six-axis platform integration."
type: case
slug: flight-simulation
categoryId: ue-projects
categoryName: Unreal Engine Projects
categoryOrder: 0
order: 1
status: Archived
featured: false
draft: false
sitePublish: true
tags:
  - "Simulation control"
  - "Flight control"
  - "Motion platforms"
coverAlt: Flight simulation cover
websiteCoverUrl: /assets/cases/flight-simulation-cover.png
translationKey: flying-car-simulator
lang: en
sourceHash: "7c8ba5f9d4a1750294135446a4e2d3c42c94e1e4147baa87552cd4def99e1469"
translationStatus: translated
generatedBodyHash: "12a185d1183ed5c009eca263bb964c1542cadd7d375c84e8aae2008cc61f7bdd"
---

## Project overview

This VR flight simulation project uses UE and AirSim. Users view the flight scene through a headset and use a flight stick to control forward, lateral and vertical movement and turning. The project also connects to a six-axis motion platform, converting the aircraft's motion data into control inputs for the platform system.

I handled flight stick integration and input mapping, AirSim control adaptation, VR camera integration, and data processing and communication for the six-axis platform.

| Area | Scope |
| --- | --- |
| Experience | VR headset viewing and flight stick controls |
| Flight control | AirSim integration, axis input, velocity and heading control |
| Motion platform | Flight state queries, washout processing and six-axis data transmission |
| Compatibility | UE 5.6 interfaces and initialization adjustments |
| My contribution | Input device integration, flight control adaptation, parameter configuration, camera integration and platform communication |

## Features and implementation

### VR view and camera integration

The project uses OpenXR for VR and a camera on the aircraft to provide the headset view. The flight stick controls aircraft movement, while the camera system handles the observation view. I integrated these separately.

I adjusted VR and camera configuration and handled the relationship between the project's cameras and AirSim's camera management. AirSim's original CameraDirector initialization was disabled so the project could manage the observation view without two systems competing for the camera.

### Flight stick and input mapping

I used SimpleController to receive device input and integrated a custom control module on top of it. The module reads a device configuration table, maps axes, buttons and directional hats to project actions, and passes those actions through Blueprint to the flight controller.

The four action groups are forward/backward movement, lateral movement, turning and ascent/descent. Each device axis can have an offset and scale to adjust its input range and direction. Device-specific bindings are stored in the configuration table, while the flight controller receives the same four action values.

The control module also handles device connection, disconnection and control enable/disable. Keyboard controls use the same flight control interfaces, allowing scene and control debugging without the flight stick.

### Flight control integration and parameters

I integrated AirSim's multirotor API, enabling API control, arming the motors and applying control parameters during initialization. Input is limited by axis and converted into horizontal velocity, vertical velocity and target yaw. The Pawn submits these commands each frame.

Forward and lateral inputs use the body frame. Horizontal movement is transformed using the aircraft's current yaw, so forward input follows its heading. Vertical movement is handled separately, and turning maintains an independent target angle.

Maximum horizontal speed, vertical speed and yaw rate are editable. Proportional gains for angle, angular-rate and velocity control can also be adjusted separately in UE to configure the control response.

### Six-axis platform data integration

I handled aircraft motion queries, integrated washout processing and sent data to the six-axis platform system over UDP. Platform motion uses the simulation's velocity and attitude, separately from the targets requested by flight stick input.

I overrode the aircraft's velocity query to read simulation velocity from AirSim and convert it to UE units and axis conventions. The integration Blueprint uses successive velocity and attitude samples and their time interval to calculate acceleration and other motion values for the washout module.

The washout module provides scale settings for translation, rotation and tilt, along with filter and angular-velocity limit parameters. I connected these interfaces in Blueprint, converted the output into byte packets and sent them through a dedicated six-axis channel to the platform system.

### Independent yaw control

#### Implementation

Movement direction and vehicle heading are maintained separately. Target yaw is initialized from the vehicle's current estimated yaw. Turning input then accumulates an angle using DeltaTime, with angle wrapping.

The aircraft can move sideways or diagonally while turning independently. Its heading does not have to follow its movement direction.

#### Challenges and implementation

When translation and heading shared direction logic, combined forward and lateral input could produce large yaw changes. I maintained target yaw separately and used only the current yaw when transforming horizontal input.

Velocity commands determine movement, while target yaw determines heading. Initializing yaw from the actual estimate also avoids an initial turn toward a default angle.

#### Related technical record

- [Adapting AirSim Controls for UE Flight Simulation](/blog/flying-car-simulator/)

### UE and AirSim integration

#### Implementation

I centralized centimetre-to-metre conversion and the difference between UE and NED vertical axes. NED points Z downward, while UE points it upward, so both vertical commands and returned velocity data need direction conversion.

I also adapted interfaces and initialization for UE 5.6 and changed control calls to a nonblocking approach. After each target submission, the game thread continues updating the scene, camera and interface.

#### Challenges and implementation

The previous control path used an interface with a movement duration. Waiting for the action affected game-thread updates, including continuous input, scene and camera processing.

I switched to nonblocking `setVelocityCommandBodyFrame`. Each Pawn Tick submits the current velocity and heading targets, then lets the game thread continue. Subsequent frames update the control targets.

When both the project's camera system and AirSim's camera management initialize, viewpoint changes can look like aircraft motion problems. I adjusted CameraDirector initialization and separated flight control from the observation view to integrate the project's cameras.
