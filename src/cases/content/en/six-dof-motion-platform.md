---
title: Six-Axis Platform Kinematics and Ocean Recording Integration
description: Implement Stewart platform kinematics and motion processing, with Take Recorder, Sequence, and LiveLink sending for an ocean scene.
type: case
slug: six-dof-motion-platform
categoryId: ue-projects
categoryName: Unreal Engine Projects
categoryOrder: 0
status: Archived
featured: false
draft: false
sitePublish: true
tags:
  - Simulation
  - Hardware integration
coverAlt: Flowchart of the six-degree-of-freedom motion platform integration
websiteCoverUrl: /assets/cases/six-dof-motion-platform.png
lang: en
translationKey: six-dof-motion-platform
sourceHash: 29af4d0750676da50693ce9f0099f22d36ce9c8e8eb3be4586ffb9a01dd7bf43
translationStatus: translated
generatedBodyHash: 7222a2bbe6e7f1204ea7a4ad8a60233b13731d0a3c4d537d7577829f7694c3b6
---

## Turning Scene Poses into Platform Motion Data

Integrating a six-degree-of-freedom platform requires handling the relationship between scene poses, mechanism dimensions, and control data. My work on StewartControl includes platform kinematics, data conversion, limits, and smoothing. It also extends to ocean-scene recording and data sending for virtual production.

### Forward and Inverse Kinematics and Unit Conversion

StewartKinematics calculates six rod lengths from a platform pose and also provides forward kinematics to recover a pose from rod lengths. The implementation uses Newton iteration and an analytical Jacobian, with conversions between centimeters and meters and between degrees and radians.

Platform data also passes through zero-position handling, limits, per-frame rate limiting, and filtering to turn scene output into constrained motion data. Motion processing includes high-pass and low-pass filtering and tilt coordination.

## Ocean Scenes and Virtual-Production Recording

For the ocean scene, I adapted environment parameters and recording workflows. Oceanology supplies the water behavior and force calculations; the project handles parameter changes, time recording, and sequence organization.

- Record Actors through TakePreset, Take Recorder, and Level Sequence.
- Organize recorded Sequences into saved SubSequences for subsequent sequence workflows.
- Expose interpolatable time, wavelength, wave height, wave speed, and wave direction properties on the ocean component. Accumulate TimeCode during recording and broadcast parameter changes.
- Send six-axis parameters as LiveLink Transforms, providing an interface for downstream integration.

The LiveLink scope here is the sender. Receiver devices and full synchronization between platform motion and recorded images still need integration and validation in the specific system.

## Practical Integration Scope

This work provides software implementations for kinematics, data processing, and recording integration. Physical calibration accuracy, mechanism safety, and the final motion experience require the platform dimensions, control protocol, and on-site tests.

The ocean work provides a basis for recording environment parameters and organizing sequences. Wind fields, receivers, and recording-delay compensation are outside the implemented scope of this case.

## Discuss Your Project

For connecting a UE scene to a six-axis platform or recording an adjustable ocean environment, share the mechanism, communication protocol, existing recording workflow, and receiver requirements. We can then define software adaptation and on-site integration work.

[Get in touch](/en/contact/) to discuss it.
