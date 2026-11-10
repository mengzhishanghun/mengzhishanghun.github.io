---
title: Motion platform and virtual filming
description: Software motion solving and signal processing for a six-axis platform, with ocean parameter animation and editor recording.
type: case
slug: motion-platform-filming
categoryId: ue-projects
categoryName: Unreal Engine Projects
categoryOrder: 0
order: 2
status: Archived
featured: false
draft: false
sitePublish: true
tags:
  - "Simulation control"
  - "Motion platforms"
  - "Virtual production"
coverAlt: Motion platform and virtual filming cover
websiteCoverUrl: /assets/cases/motion-platform-filming-cover.png
translationKey: six-dof-motion-platform
lang: en
sourceHash: "f7d2ce4cfb14dc776b694401e79fdb05c1cce8f9044624f140439f5ff96fa0cb"
translationStatus: translated
generatedBodyHash: "9d7b437ff4de23acf4586d33db2c9b15dce6cb38d5350e5c70e7c64d94f334a7"
---

## Project overview

This project covers software motion processing for a six-axis platform and virtual filming in the UE editor. Scene position and rotation must become data usable by the platform mechanism. Ocean parameters and actor motion also need to be organized into recorded sequences for review and adjustment.

My work covered forward and inverse kinematics, unit conversion, signal processing, ocean parameter integration, Take Recorder sequence organization and LiveLink transmission. Device control, physical calibration and hardware safety remain the responsibility of the device system.

## Features and implementation

| Module | My contribution |
| --- | --- |
| Mechanism definition | Connections and dimensions based on upper and lower platform joints |
| Kinematics | Rod lengths from platform pose and pose estimation from rod lengths |
| Signal processing | Reference pose, filtering, amplitude and rate limits, high/low-pass processing and tilt coordination |
| Ocean parameters | Interpolatable wave and time properties, change notifications and time progression |
| Editor recording | TakePreset, actor sources, Take Recorder and timing between original and recorded sequences |
| Transmission | Preparing and sending LiveLink Transform data |

### Platform kinematics

Inverse kinematics transforms the upper joints using the target position and rotation, then calculates their distances from the corresponding lower joints to obtain six rod lengths. Forward kinematics uses Newton iteration and an analytical Jacobian to estimate pose from lengths.

Mechanism definition and solving are separate, with explicit joint layouts, dimensions and poses. Conversions between centimetres and metres and between degrees and radians are handled at the solving boundary.

UE position and rotation cannot directly serve as six rod values. Motion along one axis can affect several rods, and solving depends on the full joint layout and dimensions.

I separated mechanism parameters, geometric inverse solving and numerical forward solving. Each direction can be checked against its own input, units and connection definitions.

### Motion processing

#### Implementation

I integrated EMA, median and Butterworth filtering, together with reference-pose handling, amplitude limits and limits on changes between frames. High/low-pass processing and tilt coordination address different components of the motion signal.

These stages have separate roles: reference, noise, range and rate of change. One constraint does not substitute for the others.

#### Challenges and implementation

A value within the allowed range may still change sharply between frames. Stronger smoothing can also introduce lag during fast movement.

I kept filtering, amplitude limiting and rate limiting distinct so that noise, range and change speed can be adjusted separately. Different filters can be selected for different input signals instead of applying one parameter set to every motion.

### Ocean scene and virtual filming

#### Implementation

Working with Oceanology's scene presentation and force calculations, I exposed interpolatable time, wavelength, wave height, wave speed and direction properties. Changes broadcast notifications, while recording accumulates TimeCode for editor timing.

Recording uses editor-only TakePreset, actor sources and Take Recorder. After recording, the original scene Sequence is added as a SubSequence of the new result, with an offset based on the recording start time, and the result is saved.

#### Challenges and implementation

Saving newly recorded actors alone does not preserve their relationship to an existing scene sequence. At recording start, I retain the original Sequence and start time. After recording, I add the original as a SubSequence and calculate its offset.

This organizes existing scene content and newly recorded actors in the same editor result for later review and adjustment.

#### Related technical record

- [Six-Axis Platform Kinematics and Ocean Recording Integration](/blog/six-dof-motion-platform/)

### LiveLink data transmission

The LiveLink sender prepares Transform data; the receiver interprets it and connects to the device. My implementation covers solving, processing and sending. Transmission completion does not establish device execution or hardware safety.

## Results and scope

The software provides a path from scene pose through mechanism solving and signal processing to LiveLink transmission, alongside ocean parameters and editor recording sequences.

The recording path depends on editor data and is not a general video recorder for packaged applications. Ocean integration covers the existing wave and time properties. Wind, complete hardware synchronization and recording latency compensation are not complete; filtering and pose constraints do not replace workspace checks or physical calibration.

## Related projects

- [Flight simulation](/cases/flight-simulation/): related flight control and platform integration.
