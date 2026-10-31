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
  - Simulation
  - Virtual filming
coverAlt: Motion platform and virtual filming cover
websiteCoverUrl: /assets/cases/motion-platform-filming-cover.png
translationKey: six-dof-motion-platform
lang: en
sourceHash: 128afb6deaf56d889e4e5f01ef52e25def9ffbd6d6d87c1c0c2903687c24738d
translationStatus: translated
generatedBodyHash: 1069821f93f9966101681f31cab1cc75cde439443f1ec5b1453288045386d24b
---

## Project overview

This project converts pose changes in Unreal Engine into motion data for a six-axis platform. It also supports parameter animation and recording for ocean scenes and virtual filming. My work covered the motion-processing and recording software.

## My contribution

- Implemented forward and inverse kinematics and unit conversions for the platform.
- Handled zero references, filtering, amplitude and rate limits, and tilt coordination.
- Integrated animatable wave and time parameters into the recording workflow.
- Adapted Take Recorder and Sequence in the editor to align existing scene sequences with new recordings.
- Sent Transform data through LiveLink for downstream integration.

## Implementation and results

The motion pipeline separates mechanism definitions, pose solving and signal processing. The recording pipeline organizes environment parameters and Actor recordings in editor sequences for review and adjustment.

The work covers software solving, processing, editor recording and data output. Device control, physical calibration and safety require validation in the device system. Editor recording does not establish a general recording feature for packaged applications.

## Technical notes

- [Six-axis motion solving and ocean recording integration](/blog/six-dof-motion-platform/)
