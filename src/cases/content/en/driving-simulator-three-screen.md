---
title: Driving simulation
description: A driving training project combining three-screen display, session recording, results and scene replay.
type: case
slug: driving-simulation
categoryId: ue-projects
categoryName: Unreal Engine Projects
categoryOrder: 0
order: 0
status: Completed
featured: true
draft: false
sitePublish: true
tags:
  - Simulation
  - Driving records
  - Multi-screen display
coverAlt: AI concept cover for Driving simulation, not a project screenshot
websiteCoverUrl: /assets/cases/driving-simulation-cover.png
translationKey: driving-simulator-three-screen
lang: en
sourceHash: 28c882666cbc8d8fddf77333db2dfcb1481fb8f897783055d00699f84d3f26c3
translationStatus: translated
generatedBodyHash: f4abf82a6b1286113e71d4397c697e333495acc91f752b842e0f1a3b4b65706c
---

## Project overview

This Unreal Engine project supports driving training and simulated tests. Three screens form the driving environment, while session data, results and scene recordings support review after a training run.

## My contribution

- Addressed inconsistent Lumen lighting and exposure across three screens through engine multi-view changes and view data association.
- Integrated time-based recording of steering, braking, throttle, speed, position and other vehicle states.
- Organized results and queries, and integrated recording, playback and file management through UE Network Replay.

## Implementation and results

The display work addressed lighting and exposure differences across the three views. The data pipeline stores continuous curves, discrete events and results separately. Scene review uses the engine replay system, with each record serving a different purpose.

The display changes were made against UE 5.3 / 5.3.2 source implementations. Process data is saved in the background; completion notification is still needed to coordinate the final batch with session end and application exit. Starting a save does not confirm that the file has been written.

## Technical notes

- [Driving session recording and UE replay management](/blog/driving-session-replay/)
- [Fixing missing GI across multiple views](/blog/ue53-multiview-gi/)
- [Synchronizing exposure across multiple screens](/blog/cnblogs-19165561/)
