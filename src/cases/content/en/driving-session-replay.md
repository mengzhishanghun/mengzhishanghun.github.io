---
title: Driving Session Recording and UE Replay Management
description: Capture driving inputs and vehicle states, save performance statistics, and manage UE Network Replay recordings.
type: case
slug: driving-session-replay
categoryId: ue-projects
categoryName: Unreal Engine Projects
categoryOrder: 0
status: Archived
featured: false
draft: false
sitePublish: true
tags:
  - Simulation
  - Driving records
  - Replay
lang: en
translationKey: driving-session-replay
sourceHash: 7a85b612360d041323c29c3d17995051acf6164398df89713230ad615bfd6d71
translationStatus: translated
generatedBodyHash: 413b982d437454bc5da174cf7edf948a969d94fbd1f0a6877e56f0d8f54af6a3
---


## Recording Inputs and Keeping a Viewable Replay

Driving training needs both an assessment of the session and a way to inspect what the driver did. A results table supports completion times and behavior counts. Continuous data shows changes in steering, braking, and speed, while scene replay lets the user watch the drive again. My implementation organizes process JSON, performance JSON, and UE Network Replay separately, giving each a defined recording responsibility.

This separation also affects integration. A results interface can read statistics, an analysis tool can read curves, and scene review can use the engine's recording manager. Similar fields, or data from the same training session, do not make these formats interchangeable.

## Driving Data and Performance Statistics

### Sampling Time and Batches

A WorldSubsystem automatically starts process recording during initialization and samples vehicle state in Tick. The time axis uses elapsed seconds from a wall-clock starting point. Vehicle position is converted from UE centimeters to meters before entering the recording structure.

Processing is triggered when the buffer reaches 3,000 samples. This is a sample-batch threshold, not a fixed sampling rate or a guarantee that output appears at fixed time intervals. Changes in Tick frequency also change the number of samples collected per second. Consumers should use the stored time coordinates when reading curves.

### Continuous Curves and State Events

Continuously changing values enter separate channels. Gear and turn signals are recorded as changed-value events. This retains the shape of inputs over time without treating an unchanged discrete state as a new event every frame.

| Data category | Recorded content | Organization |
| --- | --- | --- |
| Control inputs | Steering, brake, throttle | Separate continuous curves |
| Vehicle and viewing state | Speed, head direction | Channels with time coordinates |
| Spatial information | X, Y, Z components of world position and direction | Separate channels, with position standardized to meters |
| Discrete state | Gear, turn signals | Time and value when a change occurs |

The generated JSON contains session fields, curve ControlPoints, and discrete Events. An analysis tool can read input changes by channel and compare them with gear or signal state at event times, without interpreting every field as the same kind of sample.

### Curve Fitting and Error Meaning

Raw points are fitted and simplified per channel before control points are saved. The tolerance applies to fitting distance in the `(time, value)` plane. Both time and the field value participate in that distance. Steering, speed, and position use different units, so the same numeric tolerance cannot be interpreted as the same physical error.

Reducing keys aims to describe a changing curve with fewer data points. Which discontinuities to preserve, acceptable error, and the intended use remain business decisions. Identifying when braking starts, for example, has different detail requirements from viewing a speed trend. The implementation processes channels separately and does not establish a compression ratio or uniform physical accuracy here.

### Background Saving and Completion

Serialization and file writing run in the background. Per-path locking coordinates writes to the same path, and completion can be sent back to the game thread through a callback. This separates file operations from frame-by-frame sampling, but initiating a save and finishing a file write remain different states.

The current capture caller neither binds the completion callback nor waits for saving during shutdown. The implementation therefore provides asynchronous saving without guaranteeing that the final batch reaches disk when the application exits. Projects requiring reliable end-of-session persistence need completion notification and shutdown handling included in their integration scope.

### Separate Performance Statistics

Performance JSON stores result tags, steering and start counts, completion time, reaction time, and date, with record filtering. It serves result queries for a training session, while process curves retain changes in inputs and state. A business interface can present them together while preserving their distinct structures and meanings.

## Reusing UE Network Replay

Scene replay uses UE Network Replay. Its management interface wraps starting recording, playback, listing, renaming, and deletion. An interface can select an existing recording and start playback without reinterpreting process curves as the engine's full scene state.

Process capture, performance statistics, and engine replay are three complementary mechanisms. Process JSON is not a custom engine for reconstructing the entire scene. Which Actors and replicated states are reproduced, and the resulting playback behavior, need checking against the project's UE replay configuration. Data queries, file management, and scene review can therefore have separate acceptance requirements.

## Discuss Your Project

For driving training or other simulations that need process records, result queries, and scene review, start with the capture fields, scoring rules, and states to reproduce. I can help define the responsibilities of data recording and engine replay and connect them to the existing interface.

[Get in touch](/en/contact/) to discuss it.
