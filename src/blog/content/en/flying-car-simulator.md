---
title: Adapting AirSim Controls for UE Flight Simulation
description: Adapt frame-by-frame flight commands, yaw control, coordinate conversion, and AirSim interfaces for UE 5.6.
type: blog
slug: flying-car-simulator
categoryId: blog-5b81b3e117a9
categoryName: Unreal Engine
categoryOrder: 0
status: Published
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
date: 2026-10-29
publishedAt: 2026-10-29
sourceHash: be895a16c2f0107010ddb4f6bcb1c7e0095ec6adb186300c4f7131c3f1276a53
translationStatus: translated
generatedBodyHash: 1aa128153b055cc9e01888234ef720e76b1759f8fb5aa2fe5b6a29781c239d11
---

## Flight Input and Scene Updates

A flying-car simulation must keep receiving operator input while updating the vehicle, scene, and camera. My work focused on AirSim control integration, yaw handling, and adaptation for UE 5.6. Forward, sideways, vertical, and turning inputs need conversion into velocity and heading in the flight interface's coordinate systems. How that interface is called also affects whether the game thread can keep updating.

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

The movement target for each frame is handled separately from control duration. When device input changes, the next frame can calculate a new target, while the game thread continues processing UI, cameras, and other interactions. Actual response still depends on simulation stepping and the runtime environment; a non-blocking interface alone does not guarantee a fixed frame rate.

### Handling Translation and Heading Separately

During diagonal movement, the movement direction should not automatically become the vehicle's heading. The implementation maintains a separate `TargetYaw`, initialized from the vehicle's actual estimated yaw to avoid an initial turn toward a default angle. Turning input accumulates the angle using frame time, with angle wrapping.

Horizontal velocity conversion uses current yaw only, rotating forward and sideways body-frame input onto world XY. Vertical input is handled separately. This distinguishes translation intent from heading control and reduces unwanted yaw during diagonal movement. The yaw target uses angle mode, separating the operator's turning input from the angular-rate control used within the flight controller.

### Units, Coordinates, and Control Parameters

UE commonly uses centimeters, while AirSim velocity interfaces organize data in meters per second. Exchanges require unit conversion. NED has a downward Z axis and UE an upward Z axis, so the vertical component also changes sign. Mixing these conversions into input mappings can produce reversed vertical motion or an incorrect speed scale. They are therefore handled at the interface boundary.

Angle, velocity, and angular-rate gains are configured separately. These settings currently use the proportional P term, with I and D set to zero. This configuration uses proportional control; the parameter structure alone does not establish a fully tuned PID flight controller.

## Version Adaptation and Integration Scope

I adapted AirSim interfaces and initialization for UE 5.6. CameraDirector initialization was disabled to reduce competition with the project's camera management. Flight control, viewing direction, and camera ownership are handled separately so a camera change is less likely to be mistaken for abnormal vehicle motion.

The project also involved six-axis integration tests, VR, and a simpler camera configuration. See the [six-DOF platform case](/en/cases/six-dof-motion-platform/) for the platform-side software work. These tasks cover specific integrations and adjustments. The complete VR experience, flight-dynamics accuracy, and device response still require testing with the chosen model and runtime environment.

## Project overview

[Flight simulation](/cases/flight-simulation/)
