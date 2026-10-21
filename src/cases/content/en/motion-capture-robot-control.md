---
title: Retargeting Motion Capture to Robot Models in UE
description: Map filtered Kinect skeleton data to robot joints using structural proportions, IK, smoothing, and angular-speed limits.
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
sourceHash: e156b3fdcd857d2241773e273ddba7e1d52419cfc95e23d99f7823df8382f16a
translationStatus: translated
generatedBodyHash: 0775535440e47785532974705a6567a3fcf7dd060d2544513f16dc683721525d
---


## Human Motion and Robot Structure

Retargeting human motion to a robot often runs into structural differences: joint counts, rotation axes, segment proportions, and ranges of motion do not match. Copying capture rotations directly can cause displaced endpoints, out-of-range joints, and jitter. The pipeline I helped implement separates input-skeleton processing from robot mapping, keeping adjustable parameters on both sides.

The input side first produces a relatively stable intermediate skeleton. The robot side then derives joint values from its mechanism definition. When the robot structure changes, joint correspondence and mechanism parameters can be adjusted. When capture looks wrong, the intermediate skeleton can be inspected before troubleshooting every robot joint at once.

## Two Retargeting Stages

### Kinect Data and the Intermediate Skeleton

KinectRetarget reads Kinect skeleton data, filters out missing bones, processes joint positions and Euler angles separately, and writes the pose into a PN3 PoseableMesh. This intermediate model receives the input pose and provides a common reference for subsequent mapping.

Per-joint processing matters. In one frame, a particular joint can fluctuate while other joints remain usable. Position and angular changes also need separate treatment. Input filtering reduces local jitter before each capture fluctuation becomes robot-joint motion.

### Handling Angle Changes across 180 Degrees

Euler angles have representation boundaries. A change from 179 degrees to -179 degrees describes a small actual rotation, but direct subtraction produces almost a full turn. The implementation unwraps angle differences across 180 degrees before further processing, reducing sudden flips caused by the numeric representation boundary.

This addresses angular continuity. Bone-direction mismatches and differences between human and model proportions still belong to retargeting. Filtering alone cannot correct the whole mapping.

### From Segment Proportions to Robot Targets

The robot side reuses URDFForge's RobotRetargetComponent. Joint origins, rotation axes, and limits in the URDF define the mechanism, while human body segments supply the intended motion. Mapping scales individual segments proportionally, bringing human movement into the robot's scale before constructing IK targets.

| Data | Role in mapping |
| --- | --- |
| Human segment lengths and joint positions | Describe movement direction and relative extension |
| Robot segment proportions | Convert human motion to the mechanism's scale |
| URDF joint origins and axes | Define connections and rotation directions |
| Joint limits | Constrain the range available for solving and output |

Segment-based proportions are more suitable than copying world coordinates between models with different lengths. A reaching movement should first be interpreted as human-limb extension, then converted into a target for the robot structure. The human endpoint's absolute distance cannot simply become robot travel.

### IK and Direct-Angle Mapping

Chains that track target positions use damped least squares, or DLS IK. It iteratively adjusts joint values from the error between the current pose and the target. Previous joint angles initialize the next solve, making use of continuity between adjacent frames.

Direct-axis angle mapping drives joints through their correspondence. It has a different role from IK: one gives a target to a mechanism solver, while the other transfers angles along selected axes. Integration should choose according to the joint structure and intended movement rather than putting every joint through the same solving method.

### Smoothing and Per-Frame Angular-Speed Limits

After calculating joint targets, output passes through interpolation and smoothing, with limits on the angular change allowed each frame. `SetRelativeRotation` then updates UE scene components. A transition between target and displayed values softens input jumps, but stronger smoothing can slow the response to fast movements. Parameters therefore need adjustment for the intended actions.

## Implemented Scope and Model Adjustments

The pipeline covers Kinect input, an intermediate skeleton, and retargeting to robot components inside UE. Each model still needs checks of bone directions, proportions, and joint ranges. Some pose distortion in the Kinect-to-PN3 path remains to be adjusted.

A moving robot model shows that the mapping result has been written into UE components. Physical actuator communication, state feedback, and closed-loop control are separate device-integration work. Model movement alone does not establish that hardware follows it.

## Discuss Your Project

To drive a robot or non-standard skeleton in UE with motion-capture data, share the input device, model structure, and target movements. I can help define joint mapping, constraints, and pose processing.

[Get in touch](/en/contact/) to discuss it.
