---
title: Robot Realtime Data and Three-Axis IK Prototype
description: An in-development UDP JSON and three-joint position-IK prototype, awaiting testing with the actual mechanism and real data.
type: blog
slug: robot-realtime-ik-prototype
categoryId: blog-5b81b3e117a9
categoryName: Unreal Engine
categoryOrder: 0
status: Published
featured: false
draft: false
sitePublish: true
tags:
  - Robotics
  - UDP
  - Prototype
lang: en
translationKey: robot-realtime-ik-prototype
coverAlt: Realtime robot data and three-axis IK prototype diagram
websiteCoverUrl: /assets/cases/robot-realtime-ik-prototype.png
date: 2026-10-29
publishedAt: 2026-10-29
sourceHash: 2d075e18158f2a1629614c52b1d8b9736e6042e509672499d7c047b5c464bde8
translationStatus: translated
generatedBodyHash: 7863749efb185bb61257735713ae5d25c9790be5a0d5e435589f5294cc632bfb
---

## Prototype Goal

The robot control prototype is being developed for realtime robot-data integration and three-axis position IK. I separated transport, scheduling, filtering, and solving to build a UE-side prototype that brings external data into the scene, handles output changes when input stops, and converts a target position into joint values.

A realtime pipeline involves more than receiving JSON. Network reception and game Tick are not synchronized, and valid input does not mean the mechanism can reach a target. The prototype therefore expresses reception state and IK-solving state separately so higher-level logic can interpret output. Testing with the actual mechanism's URDF and real data remains outstanding.

## Data Input and Connection-Loss Handling

### Handing Data from the Receiver to Tick

RoboUdpTransport sends and receives JSON in a UDP worker thread and retains the latest parsed frame. Game Tick consumes updates by generation, allowing network reception and scene processing to advance independently. This structure follows the latest state instead of queuing every received packet as an action that must be executed in order.

Freshness is assessed using local receive time. The recovery condition counts consecutive packets that can be parsed; it does not require strictly continuous sender sequence numbers. There is currently no sequence-number deduplication or remote-clock synchronization. A parseable format, message order, and the time base are separate issues.

### Timeout, Zero Output, and Recovery

After an input timeout, protocol position, rotation, and joint values are zeroed, and filter state is reset. When reception conditions are met again, processing resumes from the newly received raw pose rather than continuing with pre-timeout filter history.

Zeroing here is a protocol-data rule. It is not a physical safe-home command. Whether actual equipment should stop, hold, or return to a reference position must be defined by its control protocol and hardware safety design.

### Filtering According to Movement Speed

The prototype adjusts filter cutoff frequency according to estimated movement and angular speed. Slow movements can receive stronger suppression of small fluctuations, while fast movements need less tracking delay from excessive smoothing. Rotations use normalized Slerp interpolation and are processed separately from position data.

This adaptive processing trades jitter suppression against response. Smoother output alone does not establish a suitable setting. Integration with real data needs observation of stationary fluctuations, fast movements, and pose changes during recovery.

### Target Rate and Actual Scheduling

RoboRealtimeSubsystem accumulates elapsed time in Tick and schedules processing at a configured target period. The 120 Hz rate is a configuration target; actual execution depends on frame scheduling and the runtime environment. Network reception, data updates, and solving frequency also need separate observation. One configured number cannot serve as a hard-realtime metric for the whole pipeline.

## Three-Joint Position Solving

### Converting External Targets to Mechanism Coordinates

RoboThreeAxisIkSolver reuses URDFForge. Before solving, target data passes through meters-to-centimeters and coordinate-handedness conversions, including rotation-axis conversion as a pseudovector. Position vectors and rotation axes have different conversion meanings. Units and handedness need explicit boundary handling to avoid plausible values that produce opposite rotation directions.

The current mechanism scope is a chain of three revolute joints with a fixed tool point, restricted to the joint-origin transforms supported by the implementation. Its mechanism definition converts target XYZ position into three joint values. It is not a general solver that accepts arbitrary URDF mechanisms directly.

### Distinguishing Valid Input from a Valid Solve

| State | Meaning | Effect on output |
| --- | --- | --- |
| `input_valid` | Input meets current reception-validity conditions | Describes input-link state |
| `ik_valid` | The current target has a valid position-IK result | Describes whether the joint result can be used |
| Valid input with failed IK | New data exists, but solving has no valid result | Clear joint output while keeping the state distinction |

This prevents ongoing network traffic from being mistaken for usable joint values. The current target is position only; end-effector orientation constraints are outside this three-axis prototype. Mechanism dimensions, joint limits, and tool-point definitions still require confirmation with the actual model.

## Development Status

Software prototypes exist for UDP transport, latest-frame handoff, timeout recovery, adaptive filtering, and three-joint position solving. The actual mechanism's URDF, real-data link, and device behavior still need testing, so this article is presented as work in development. Higher-level logic can use protocol zeroing and solving status, while final device behavior still requires device-side rules.

To assess a similar project, share the mechanism structure, joint ranges, data format, and target-position constraints so we can identify reusable parts of the prototype.

[Get in touch](/en/contact/) to discuss it.

## Project overview

[Motion capture and robot control](/cases/motion-capture-robot/)
