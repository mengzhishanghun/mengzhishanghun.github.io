---
title: Motion Capture Robot Control System
description: A real-time robot control approach based on motion capture.
type: case
slug: motion-capture-robot-control
categoryId: ue-projects
categoryName: Unreal Engine Projects
categoryOrder: 0
status: Archived
featured: false
draft: false
sitePublish: true
tags:
  - Motion capture
  - Robotics
coverAlt: Flowchart of the motion capture robot control system
websiteCoverUrl: /assets/cases/motion-capture-robot-control.png
lang: en
translationKey: motion-capture-robot-control
sourceHash: a9194931ada9d8f5e2edf00883262c3743526e1e8a9abe2af1ef47b90921314a
translationStatus: translated
generatedBodyHash: 9b96d72d603f431c31e1dc2ede791984b65bd5876e26b0e51d996238d2d044e5
---

## Background

I worked on a project that used motion capture data to control robot movement. The work included a robot skeleton on the UE side, real-time motion synchronization, and control feedback.

This case focuses on the connection from motion capture input to robot control: after capturing motion, the data still needed to be parsed, mapped to the skeleton, and connected to control commands and feedback.

## Reproduction Environment

The system used real-time motion capture data, handled robot skeleton mapping and motion synchronization in Unreal Engine, and connected these to the control feedback workflow.

## Specific Problem

Motion capture data needed to serve robot control as well as character animation playback. Data parsing, skeleton correspondence, and control output were separate stages that needed to be connected into one workflow.

In addition to sending motion out, the approach included a feedback loop to receive information returned by the control side.

## Solution

Motion capture data acquisition and real-time parsing were integrated first so motion input could enter subsequent processing. Robot skeleton mapping was then established on the UE side, with the corresponding motion synchronized.

The control stage handled command delivery and the feedback loop, connecting motion synchronization with information from the control side. Acquisition, parsing, mapping, and control each handled part of the process and together supported real-time motion control.

## Final Summary

Data parsing, skeleton mapping, motion synchronization, and control feedback were connected into one approach, forming the project's motion capture robot control workflow.
