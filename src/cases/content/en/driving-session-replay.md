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
sourceHash: 02cf9becdd85dcff583e5d033aba0b597ff29017c64de85ee8ec54ef4a490e4f
translationStatus: translated
generatedBodyHash: a4ec3053bf860cccd50b0f8f50d42f9a495456dcb1942daba3057497d96f5b9e
---

## Recording Inputs and Keeping a Viewable Replay

Process data and scene replay serve different needs in a driving simulator. Process data supports reviewing inputs, states, and results; replay lets the user watch the UE scene again. My implementation handles JSON capture and UE Network Replay management separately as complementary mechanisms.

## Driving Data and Performance Statistics

Process capture records steering, brake, throttle, speed, head direction, vehicle position and orientation, gear, and turn signals. Every 3,000 frames, the system organizes samples into curves, simplifies keys using an error threshold, and saves JSON for later reading and analysis.

Separate performance records include result tags, steering and start counts, completion time, reaction time, and date, with record filtering. These statistics are organized separately from continuous driving data so a training result and its changing inputs can be queried independently.

## Reusing UE Network Replay

Scene replay uses UE Network Replay, with wrappers for starting recording, playback, listing recordings, renaming, and deletion. Replay management selects and maintains recording files; process JSON stores business data.

Each mechanism has a defined purpose. The implemented scope does not include a custom replay engine that reconstructs the entire scene from process JSON. Each project still needs to confirm which Actors and states participate in UE replay.

## Discuss Your Project

For driving training or other simulations that need process records, result queries, and scene review, start with the capture fields, scoring rules, and states to reproduce. I can help define the responsibilities of data recording and engine replay and connect them to the existing interface.

[Get in touch](/en/contact/) to discuss it.
