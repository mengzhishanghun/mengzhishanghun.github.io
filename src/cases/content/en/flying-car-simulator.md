---
title: Adapting AirSim Controls for UE Flight Simulation
description: Adapt frame-by-frame flight commands, yaw control, coordinate conversion, and AirSim interfaces for UE 5.6.
type: case
slug: flying-car-simulator
categoryId: ue-projects
categoryName: Unreal Engine Projects
categoryOrder: 0
status: Archived
featured: false
draft: false
sitePublish: true
tags:
  - Simulation
  - Transportation
coverAlt: Flowchart of the flying car simulator
websiteCoverUrl: /assets/cases/flying-car-simulator.png
lang: en
translationKey: flying-car-simulator
sourceHash: 4a3ef18ffe61ede154f4fdeb0a84f78886f7163dae1ba25c22a4080e651bbf5b
translationStatus: translated
generatedBodyHash: 1c3d24b343dfa974dbf90c96ee62b683ff63eb6c714b8b961b6753fbda4c9ec5
---


## Flight Input and Scene Updates

A flying-car simulation must keep receiving operator input while updating the vehicle, scene, and camera. My work focused on AirSim control integration, yaw handling, and adaptation for UE 5.6. The difficulty is that input devices express forward, sideways, vertical, and turning intentions, while the flight interface expects velocity and heading in specific coordinate systems. The calling pattern also affects whether the game thread can keep updating.

### From Input Axes to Flight Commands

Input is organized by axis before the Pawn processes it each frame. Translation and turning are maintained separately, then combined into the current frame's velocity command and target yaw angle.

| Input or state | Processing | Purpose |
| --- | --- | --- |
| Forward and sideways input | Clamp each axis and convert to horizontal velocity | Control horizontal movement |
| Vertical input | Convert to vertical velocity and handle the Z direction | Align UE and NED definitions of up and down |
| Turning input | Accumulate the target angle using DeltaTime | Relate the turning amount to elapsed time |
| Current yaw | Rotate the horizontal input direction | Make forward follow the vehicle heading |

Per-axis clamps limit individual inputs. The combined diagonal velocity can still exceed a single-axis velocity. A project requiring the same maximum speed in every direction needs a separate rule for limiting the combined vector.

### Keeping Commands off the Blocking Path

The older control path used an interface with a duration parameter; waiting during the call affected the game thread. This path switches to non-blocking `setVelocityCommandBodyFrame`. Each Pawn Tick submits a command for the current input, then continues processing scene logic. Subsequent frames maintain continuous control instead of waiting for an entire movement to finish inside one call.

This separates the desired movement for the current frame from how long control continues. When device input changes, the next frame can calculate a new target. The game thread can also process UI, cameras, and other interactions. Actual response still depends on simulation stepping and the runtime environment; a non-blocking interface alone does not guarantee a fixed frame rate.

### Handling Translation and Heading Separately

During diagonal movement, the movement direction should not automatically become the vehicle's heading. The implementation maintains a separate `TargetYaw`, initialized from the vehicle's actual estimated yaw to avoid an initial turn toward a default angle. Turning input accumulates the angle using frame time, with angle wrapping.

Horizontal velocity conversion uses current yaw only, rotating forward and sideways body-frame input onto world XY. Vertical input is handled separately. This distinguishes translation intent from heading control and reduces unwanted yaw during diagonal movement. The yaw target uses angle mode, separating the operator's turning input from the angular-rate control used within the flight controller.

### Units, Coordinates, and Control Parameters

UE commonly uses centimeters, while AirSim velocity interfaces organize data in meters per second. Exchanges require unit conversion. NED has a downward Z axis and UE an upward Z axis, so the vertical component also changes sign. Mixing these conversions into input mappings can produce reversed vertical motion or an incorrect speed scale. They are therefore handled at the interface boundary.

Angle, velocity, and angular-rate gain entries are configured separately. These settings currently use the proportional P term with I and D set to zero. They describe proportional-control settings for this configuration; the presence of PID-shaped parameters does not establish a fully tuned PID flight controller.

## Version Adaptation and Integration Scope

I adapted AirSim interfaces and initialization for UE 5.6. CameraDirector initialization was disabled to reduce competition with the project's camera management. Flight control, viewing direction, and camera ownership are handled separately so a camera change is less likely to be mistaken for abnormal vehicle motion.

The project also involved six-axis integration tests, VR, and a simpler camera configuration. See the [six-DOF platform case](/en/cases/six-dof-motion-platform/) for the platform-side software work. These tasks cover specific integrations and adjustments. The complete VR experience, flight-dynamics accuracy, and device response still require testing with the chosen model and runtime environment.

## Discuss Your Project

For an existing AirSim or UE flight scene that needs input-device integration, changes to movement and yaw, or an engine migration, share the current version, control interface, and observed behavior so we can define the adaptation work.

[Get in touch](/en/contact/) to discuss it.
