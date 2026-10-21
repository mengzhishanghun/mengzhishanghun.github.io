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
sourceHash: 04b15dd22122b832a7a980386df5c28e6aea29ccb36c0a7ea90df3778ec4da42
translationStatus: translated
generatedBodyHash: 0eaedfd23ee1083a4c1867ec2fbaa7f7e21ab3d5122940996d25a289140ed1fe
---

## Flight Input and Scene Updates

A flying-car simulation needs to keep sending operator input to AirSim while the UE scene continues updating. My work focused on flight-control integration, yaw handling, and engine-version adaptation. Later work also included six-axis platform integration tests, VR, and a simpler camera setup.

### Keeping Commands off the Blocking Path

The older control interface with a duration parameter waited during the call and affected game-thread updates. I switched the Pawn's Tick path to non-blocking `setVelocityCommandBodyFrame` calls, submitting body-frame velocity each frame. Input changes can continue arriving while the scene processes interaction and visual updates.

### Handling Translation and Heading Separately

During diagonal movement, velocity direction and vehicle heading can interfere. The implementation maintains a separate `TargetYaw` and uses angle-mode yaw control to reduce unwanted turning from translation input. Data exchange between UE and AirSim also converts velocity units and handles the Z direction in NED coordinates.

## Version Adaptation and Integration Scope

I adapted AirSim interfaces and initialization for UE 5.6. The project also involved six-axis integration tests, VR, and camera adjustments. See the [six-DOF platform case](/en/cases/six-dof-motion-platform/) for the platform-side software work.

This case covers control and integration. Flight dynamics depend on the simulation model used; model accuracy, device response, and the intended experience require project-specific testing.

## Discuss Your Project

For an existing AirSim or UE flight scene that needs input-device integration, changes to movement and yaw, or an engine migration, share the current version, control interface, and observed behavior so we can define the adaptation work.

[Get in touch](/en/contact/) to discuss it.
