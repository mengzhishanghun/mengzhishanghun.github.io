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
sourceHash: 53650efa80bfbc8d33992f2681b30dfa460bcce93eb349adec1fc1a4a09e5b39
translationStatus: translated
generatedBodyHash: 483938759e6bfa1fe3e42c1361df59739c50fc847c7671f91ba2a3a809d56ed0
---


## Prototype Goal

RoBoBuilder is in development for robot realtime-data integration and three-axis position IK. I separated transport, scheduling, filtering, and solving to build a UE-side prototype. It handles how external data enters the scene, how output changes when input stops, and how a target position becomes joint values.

A realtime pipeline involves more than receiving JSON. Network reception and game Tick are not synchronized, and valid input does not mean the mechanism can reach a target. The prototype therefore expresses reception state and IK-solving state separately so higher-level logic can interpret output. Testing with the actual mechanism's URDF and real data remains outstanding.

## Data Input and Connection-Loss Handling

### Handing Data from the Receiver to Tick

RoboUdpTransport sends and receives JSON in a UDP worker thread and retains the latest parsed frame. Game Tick consumes updates by generation, allowing network reception and scene processing to advance independently. This structure follows the latest state instead of queuing every received packet as an action that must be executed in order.

Freshness is assessed using local receive time. Consecutive valid packets in the recovery condition means a count of consecutively parseable packets, not strict continuity in sender sequence numbers. There is currently no sequence-number deduplication or remote-clock synchronization. Parseable format, message ordering, and time bases are separate issues.

### Timeout, Zero Output, and Recovery

After an input timeout, protocol position, rotation, and joint values are zeroed, and filter state is reset. When reception conditions are met again, processing resumes from the newly received raw pose rather than continuing with pre-timeout filter history.

Zeroing here is a protocol-data rule. It is not a physical safe-home command. Whether actual equipment should stop, hold, or return to a reference position must be defined by its control protocol and hardware safety design.

### Filtering According to Movement Speed

The prototype adjusts filter cutoff frequency according to estimated movement and angular speed. Slow movements can receive more suppression of small fluctuations, while fast movements need less delay from strong smoothing. Rotations use normalized Slerp interpolation and are processed separately from position data.

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

Software prototypes exist for UDP transport, latest-frame handoff, timeout recovery, adaptive filtering, and three-joint position solving. The actual mechanism's URDF, real-data link, and device behavior still need testing. This case remains work in development. Protocol zeroing and solving status are available to higher-level logic, while final device behavior requires device-side rules.

To assess a similar project, share the mechanism structure, joint ranges, data format, and target-position constraints so we can identify reusable parts of the prototype.

[Get in touch](/en/contact/) to discuss it.
