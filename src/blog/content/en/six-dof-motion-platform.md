---
title: Six-Axis Platform Kinematics and Ocean Recording Integration
description: Implement Stewart platform kinematics and motion processing, with Take Recorder, Sequence, and LiveLink sending for an ocean scene.
type: blog
slug: six-dof-motion-platform
categoryId: blog-5b81b3e117a9
categoryName: Unreal Engine
categoryOrder: 0
status: Published
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
date: 2026-10-29
publishedAt: 2026-10-29
sourceHash: 93c0dd5c4cfcbc3a0af2fdf08680066d1f41d865ba3a011185c0f3c1ad049897
translationStatus: translated
generatedBodyHash: f3f4c599d3ea782093ef75374d9f6bc8a0fdaa9a5dd849a92bb564255884eb7b
---

## Turning Scene Poses into Platform Motion Data

Integrating a six-degree-of-freedom platform means turning UE scene translation and rotation into data the mechanism can use. The scene supplies a pose, while a Stewart platform is supported by six rods. A change in one direction can affect several rods, and units, zero positions, and constraints need explicit handling. My work on the motion platform project includes kinematics, data processing, and editor recording integration for an ocean scene.

### Responsibilities in the Motion Pipeline

| Stage | Input and output | Responsibility |
| --- | --- | --- |
| Mechanism definition | Six pivots on each platform | Define rod connections and the dimensional basis |
| Inverse kinematics, IK | Platform pose → six rod lengths | Convert position and rotation into mechanism lengths |
| Forward kinematics, FK | Six rod lengths → estimated pose | Recover platform position and rotation from lengths |
| Data constraints | Pose or motion data → constrained data | Handle zero position, filtering, limits, and rate of change |

### Forward and Inverse Kinematics and Unit Conversion

Inverse kinematics transforms the upper-platform pivots using the target pose, then measures their distances to the corresponding lower-platform pivots to obtain six rod lengths. This requires the full pivot layout. The platform center alone cannot determine how far each rod should extend.

Forward kinematics estimates the platform pose from rod lengths. The implementation uses Newton iteration and an analytical Jacobian to describe how pose changes affect rod lengths, progressively reducing the discrepancy between estimated and target lengths. The forward solver uses numerical methods and the inverse solver uses geometry, each with its own role. A length conversion alone does not establish physical calibration.

Centimeters and degrees on the UE side require explicit conversion to meters and radians on the solver side. Mixed units can produce plausible numbers at an incorrect scale. Conversion is kept at the solver boundary so it can be checked against the mechanism parameters.

### Filtering, Pose Limits, and Rate Limits

Data processing includes EMA, median, and Butterworth filters. EMA smooths changes by weighting previous and current results, median filtering handles local spikes, and Butterworth filtering processes signals according to frequency characteristics. Different filters suit different inputs, and smoothing also affects how quickly motion follows changes.

Zero-position handling defines the reference for a pose. Pose limits constrain its allowed range, while per-frame rate limits constrain changes between consecutive outputs. These layers serve different purposes: values within the permitted range can still jump abruptly between positions. Motion processing also includes high-pass and low-pass filtering and tilt coordination to organize motion components with different variation characteristics.

## Ocean Scenes and Virtual-Production Recording

Oceanology provides the ocean's water behavior and force calculations. My integration focuses on adjustable environment parameters, Actor recording, and sequence organization, preserving the timing relationship between scene content and a recording in editor assets.

### Animatable Wave Parameters

The ocean component exposes interpolatable time, wavelength, wave height, wave speed, and wave direction properties. Parameter changes broadcast notifications so the water side can update. TimeCode accumulates during recording to describe time progression. Environment parameters therefore have their own adjustment interface without copying water algorithms into recording logic.

These properties cover the existing wave and time parameters, but not wind fields. Animatable water parameters do not mean that wind-field simulation is complete.

### From Recording Start to Saved Sequence

The recording workflow is editor-only and uses TakePreset, Actor sources, and Take Recorder. It creates a new recording while retaining the timing relationship to the original scene Sequence:

1. At recording start, retain the original scene Sequence currently open in the editor and the start time.
2. Configure TakePreset and the Actor sources, then start Take Recorder to produce a new recording.
3. When recording finishes, add the original scene Sequence as a SubSequence within the new recorded result.
4. Apply an offset based on the recording start time to align the original scene sequence with the recorded content, then save the result.

Embedding the original scene sequence in the new recorded result brings existing scene content and newly recorded Actors into one result. This implementation depends on editor data. It describes an editor Take workflow and is not a general recording feature for a packaged application.

### LiveLink Sending

Six-axis parameters can be sent as LiveLink Transforms for downstream integration. The sender organizes and pushes Transforms; the receiving system must separately handle how to interpret them, drive the platform, and align images with motion.

## Practical Integration Scope

This work provides software for kinematics, signal processing, editor recording, and LiveLink sending. Filtering and pose constraints do not constitute mechanism-workspace validation or hardware safety protection. Physical accuracy, device control, and the final motion experience require the platform structure, protocol, and on-site tests.

The ocean integration covers environment parameters, recorded sequences, and a sending interface. Receivers, complete physical synchronization, wind fields, and recording-delay compensation are outside the connected pipeline in this article.

## Project overview

[Motion platform and virtual filming](/cases/motion-platform-filming/)
