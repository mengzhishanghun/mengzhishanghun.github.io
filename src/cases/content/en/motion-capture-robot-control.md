---
title: Motion capture and robot control
description: A UE project combining body motion capture, robot retargeting, live data transport and three-axis IK, with some features still in prototype development.
type: case
slug: motion-capture-robot
categoryId: ue-projects
categoryName: Unreal Engine Projects
categoryOrder: 0
order: 4
status: In development
featured: false
draft: false
sitePublish: true
tags:
  - "Motion capture"
  - "Robot control"
  - "Skeletal retargeting"
  - "Live data communication"
coverAlt: Motion capture and robot control cover
websiteCoverUrl: /assets/cases/motion-capture-robot-cover.png
translationKey: motion-capture-robot-control
lang: en
sourceHash: "2165ff52de0cb8b4920a1886a414788b1653f7836105433a832621f177f90afc"
translationStatus: translated
generatedBodyHash: "e59942f894b176ca3ec067b56e78f3f334f3055adeb78e123c5bde4fcbdf07ff"
---

## Project overview

This project maps human movement and live data to a robot mechanism in UE. Input from Kinect or external data is processed into skeleton poses and target positions, then converted into model motion or joint values using the robot's structure.

Motion retargeting, live communication and three-axis IK are different parts of the same project. My work covers input integration, an intermediate skeleton, robot mapping, UDP frame handoff, filtering and position solving. Some capabilities remain software prototypes or require further model adjustment.

## Features and implementation

| Feature | Scope |
| --- | --- |
| Motion input | Kinect skeleton reading, missing-joint filtering, position and angle filtering |
| Intermediate skeleton | A common reference model for the input pose |
| Robot retargeting | Bone proportions, joint origins, rotation axes and limits |
| Live communication | UDP JSON, latest-frame handoff, timeout and recovery |
| Motion solving | Reusing mechanism definitions and IK, with separate input and solution validity |

### From motion capture to the robot model

#### Implementation

The input side reads Kinect skeletons, processes position and Euler angles separately and writes poses to a PN3 intermediate model. The robot side uses URDF joint definitions and bone proportions to construct IK targets or direct angle mappings. Smoothing and limits on per-frame angle changes are applied before updating UE components.

Separating input processing from robot mapping makes it possible to inspect capture noise, skeleton poses and mechanism parameters independently.

#### Challenges and implementation

Humans and robots differ in joint counts, rotation axes, proportions and movement limits. Copying captured rotations directly can cause end-point offsets, joint-limit violations or distorted poses.

I first form a more stable intermediate skeleton, then apply proportional conversion and joint mapping for the robot. IK is used where a chain must track a target position; direct axis-angle mapping remains available for appropriate joints.

A change from 179 to -179 degrees represents a small rotation, but direct subtraction produces a change close to a full turn. I unwrap differences across the boundary before filtering, then apply interpolation, smoothing and per-frame angular limits at output.

These stages address numeric continuity and input noise. Skeleton directions and model proportions remain responsibilities of the retargeting configuration.

#### Related technical record

- [Retargeting Motion Capture to Robot Models in UE](/blog/motion-capture-robot-control/)

### Live data communication and updates

#### Implementation

A UDP worker thread retains the latest parsed frame, which the game Tick reads by data generation. On timeout, the prototype outputs zero values according to the protocol and resets filtering. New input restarts processing after recovery.

#### Challenges and implementation

UDP reception and game Tick progress separately. Queuing every packet as a required action would conflict with the goal of following the latest state.

The prototype uses latest-frame handoff and local receive time to determine data freshness. Filtering adapts to movement speed to balance stationary jitter against lag during fast motion.

#### Related technical record

- [Robot Realtime Data and Three-Axis IK Prototype](/blog/robot-realtime-ik-prototype/)

### Three-axis position solving and validity

#### Implementation

The three-axis prototype reuses existing mechanism capabilities, converts units and coordinate conventions and turns a target position into three joint values. Input reception and IK results have separate status fields, so incoming network data is not treated as proof of a usable joint solution.

#### Challenges and implementation

A target can pass input checks without producing a usable position IK result. The interface therefore separates `input_valid` and `ik_valid`. If input is valid but solving fails, joint output is cleared while the two states remain distinguishable for application logic.

## Results and development status

The implementation covers Kinect input, an intermediate skeleton and motion mapping to robot components in UE. The live-data path includes prototypes for frame handoff, timeout recovery, adaptive filtering and three-joint position solving.

Specific Kinect-to-intermediate-model pose distortion, the actual mechanism URDF, real data and device behaviour still need adjustment and testing. The three-axis prototype targets position rather than general end-effector orientation. Protocol zero output is not a physical safe-return command.

UE model motion and protocol output do not establish completed actuator communication, feedback or a hardware control loop. This project remains in development.
