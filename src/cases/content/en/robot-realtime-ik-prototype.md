---
title: Robot Realtime Data and Three-Axis IK Prototype
description: An in-development UDP JSON and three-joint position-IK prototype, awaiting testing with the actual mechanism and real data.
type: case
slug: robot-realtime-ik-prototype
categoryId: ue-projects
categoryName: Unreal Engine Projects
categoryOrder: 0
status: In development
featured: false
draft: false
sitePublish: true
tags:
  - Robotics
  - UDP
  - Prototype
lang: en
translationKey: robot-realtime-ik-prototype
sourceHash: 83983b2123f46b9412e58fe718e77381374f0173c4874930c91e4c074c8145a2
translationStatus: translated
generatedBodyHash: 618f6d4a673b90951a0696b664280285e1f9f8f6fa80e2a39eef96c955d4d8c4
---

## Prototype Goal

RoBoBuilder is in development for robot realtime-data integration and three-axis position IK. I separated transport, scheduling, and solving to establish an adjustable UE-side prototype. Testing with the actual mechanism's URDF and real data remains outstanding.

## Data Input and Connection-Loss Handling

RoboUdpTransport sends and receives JSON over UDP. RoboRealtimeSubsystem schedules updates at a configured target period, zeros output after an input timeout, and resumes after consecutive valid packets. This distinguishes ongoing updates, interrupted input, and recovery.

The 120 Hz scheduling rate is a configuration target. Actual execution depends on the runtime environment and frame scheduling; it is not a hard-realtime guarantee.

## Three-Joint Position Solving

RoboThreeAxisIkSolver reuses URDFForge. It handles meters-to-centimeters conversion, coordinate handedness, and rotation-axis conversion as a pseudovector before solving three-joint position IK.

The current target is position only. End-effector orientation constraints are outside this three-axis prototype, and the mechanism definition and joint parameters still need checking against the actual model.

## Development Status

Software prototypes exist for transport, scheduling, and position solving. The actual mechanism's URDF, real-data link, and device behavior still require testing. This case is presented as work in development.

To assess a similar project, share the mechanism structure, joint ranges, data format, and target-position constraints so we can identify reusable parts of the prototype.

[Get in touch](/en/contact/) to discuss it.
