---
title: Flight simulation
description: An Unreal Engine and AirSim flight simulation project covering input, flight control, camera behavior and engine adaptation.
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
  - Simulation
  - Flight control
coverAlt: Flight simulation cover
websiteCoverUrl: /assets/cases/flight-simulation-cover.png
translationKey: flying-car-simulator
lang: en
sourceHash: eb3981088cdd07ef4064b4155c8891275265769565e5a310dfa2e56d65ee5aa1
translationStatus: translated
generatedBodyHash: 66e7e34683884cea91009ee5ac5f6395b82c65a93b3f42fe130d6108fd5fd71c
---

## Project overview

The project connects flight input to an Unreal Engine scene through AirSim, coordinating controls, vehicle motion and camera behavior. My work focused on control integration and engine adaptation.

## My contribution

- Converted forward, lateral, vertical and turning input into flight commands.
- Separated translation from yaw so movement direction and heading could be controlled independently.
- Changed control calls to reduce blocking of game-thread updates by duration-based commands.
- Adapted interfaces and initialization for UE 5.6 and resolved competing camera management responsibilities.

## Implementation and results

Flight targets update with frame input. Unit and coordinate conversions are handled at the boundary between UE and the simulation interface. Non-blocking calls allow the game thread to continue updating the scene, interface and camera.

The project also involved motion-platform integration tests and VR and camera configuration changes. This page covers integration and adaptation; flight dynamics accuracy and device response require validation against the actual model and environment.

## Technical notes

- [AirSim control integration in UE flight simulation](/blog/flying-car-simulator/)
- [Motion platform and virtual filming](/cases/motion-platform-filming/)
