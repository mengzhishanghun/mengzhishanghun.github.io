---
title: Driving Session Recording and UE Replay Management
description: Capture driving inputs and vehicle states, save performance statistics, and manage UE Network Replay recordings.
type: blog
slug: driving-session-replay
categoryId: blog-5b81b3e117a9
categoryName: Unreal Engine
categoryOrder: 0
status: Published
featured: false
draft: false
sitePublish: true
tags:
  - Simulation
  - Driving records
  - Replay
lang: en
translationKey: driving-session-replay
coverAlt: Driving session recording and UE replay management diagram
websiteCoverUrl: /assets/cases/driving-session-replay.png
date: 2026-10-29
publishedAt: 2026-10-29
sourceHash: 04982e797884474eaf2d225ec55e8134e430eb768cd9ebbf6dea017c2a9d55c5
translationStatus: translated
generatedBodyHash: 970943307b858c1161f8ce0eb94ef9cb98ee5f402837f6687bf3606d3807a4ea
---

## Recording Inputs and Keeping a Viewable Replay

Driving training needs both an assessment of the session and a way to inspect what the driver did. A results table provides completion times and behavior counts. Continuous data shows changes in steering, braking, and speed, while scene replay lets the user watch the drive again. The implementation I contributed to separates these records into process JSON, performance JSON, and UE Network Replay.

During integration, a results interface can read statistics, an analysis tool can read curves, and scene review can use the engine's recording manager. These formats are not interchangeable, even when they contain similar fields or come from the same training session.

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

The aim of reducing keys is to describe a changing curve with fewer data points, but application requirements still determine which discontinuities to preserve, how much error to allow, and how the curves will be used. Identifying when braking starts, for example, requires different detail from viewing a speed trend. The implementation processes channels separately, without promising a compression ratio or uniform physical accuracy.

### Background Saving and Completion

Serialization and file writing run in the background. Per-path locking coordinates writes to the same path, and completion can be sent back to the game thread through a callback. This separates file operations from frame-by-frame sampling, but initiating a save and finishing a file write remain different states.

The current capture caller neither binds the completion callback nor waits for saving during shutdown. The implementation therefore provides asynchronous saving without guaranteeing that the final batch reaches disk when the application exits. Projects requiring reliable end-of-session persistence need completion notification and shutdown handling included in their integration scope.

### Separate Performance Statistics

Performance JSON stores result tags, steering and start counts, completion time, reaction time, and date, with record filtering. It serves result queries for a training session, while process curves retain changes in inputs and state. A business interface can present them together while preserving their distinct structures and meanings.

## Reusing UE Network Replay

Scene replay uses UE Network Replay. Its management interface wraps starting recording, playback, listing, renaming, and deletion. An interface can select an existing recording and start playback without reinterpreting process curves as the engine's full scene state.

Process capture, performance statistics, and engine replay are three complementary mechanisms. Process JSON is not a custom engine for reconstructing the entire scene. Which Actors and replicated states are reproduced, and the resulting playback behavior, need checking against the project's UE replay configuration. Data queries, file management, and scene review can therefore have separate acceptance requirements.

## Project overview

[Driving simulation](/cases/driving-simulation/)
