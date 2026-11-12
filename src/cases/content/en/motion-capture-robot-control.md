---
title: Motion capture and robot control
description: "A shared robot motion-following system using a dedicated capture model, live or recorded input, URDF adaptation and IK."
type: case
slug: motion-capture-robot
categoryId: ue-projects
categoryName: Unreal Engine Projects
categoryOrder: 0
order: 4
status: "Published"
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
sourceHash: "bd3f9417c15f28e0d144a6b749aef6526cf7369a66cf48d4daf608103e2869a5"
translationStatus: translated
generatedBodyHash: "9fbc9e517973978ac6f3b2f64ea91820e753a65507870c21c36635313a73cf8b"
---

## Project overview

The robot model in UE is based on a real industrial robot. It has a human-like structure, with joint arrangements, limb proportions and movement limits that differ from the human body.

I built a shared motion-following system that makes the robot follow a dedicated motion-capture model. That model can receive live body poses from Kinect or play a recorded and filtered Level Sequence (LS). Both sources use the same reference model. The robot calculates its movement from its own URDF structure description and the configured joint correspondences.

My work covers bringing live capture and recorded playback into this shared system, integrating motion data and filtering, configuring the reference model, adapting robot URDFs, and implementing and tuning the IK logic. The project also includes a UDP communication and three-axis position-IK prototype. Hardware integration and testing with the real data link remain to be verified for that part.

## My work

| Module | Main work |
| --- | --- |
| Recorded motion processing and playback | Filter motion captured as LS assets, then use playback to drive the reference model |
| Live capture and the intermediate skeleton | Capture body joints with Kinect and update the reference model in real time |
| Filtering and angle handling | Process recorded motion curves and live joint data, including angle changes across ±180° in the live input |
| Shared following logic and IK | Read the reference model's pose, construct targets from the robot URDF and limb proportions, and solve joint movement |
| Debugging and configuration | Provide mock input, skeleton lines, targets and error displays to inspect mapping and solving |
| Live data communication | UDP JSON transport, latest-frame handoff, input timeout and recovery |
| Three-axis position solving | Implement and tune position IK, read mechanism parameters, convert coordinates and report solution status |

### Recorded motion processing and playback

Motion recorded with a capture device is supplied as a Level Sequence (LS). I filter its motion curves, then play the processed motion on the dedicated reference model. The robot follows through the shared adaptation logic.

The filtered sequence can be saved as a separate asset for comparison with the original recording and for repeated checks of the same motion.

### Live capture and the intermediate skeleton

The project also supports capturing body joints with Kinect and synchronising movement in real time. I integrated the device's skeleton data, selected the tracked person through configuration, and mapped capture joints to the dedicated PN3 reference model. Joint positions and rotations are filtered before being written to this model. The robot uses the same IK following logic as recorded playback.

The component checks that the target model and mapped bone names exist. At runtime, it checks the device, skeleton data and joint indices before updating the model.

Each mapping can apply position and rotation separately. In the default configuration, the root receives both, while the other mappings mainly pass rotation. The reference model acts as the intermediate skeleton, providing a common pose source and allowing capture data and robot movement to be inspected separately.

### Filtering and angle continuity

Filtering covers recorded sequences and live input. The LS side smooths recorded motion curves; the Kinect side processes live position and rotation for each joint. Both provide several filtering methods and adjustable parameters to suit the motion.

#### Challenge: angle boundaries affecting filtering

A change from 179° to -179° represents a small rotation, but direct subtraction produces a difference close to a full turn. Passing that difference straight into a filter can disrupt the pose transition.

For live Kinect input, I bring the difference between adjacent frames into the ±180° range, accumulate continuous angles, then filter and convert them back into rotation data. The three position components use separate filter channels.

Related technical record: [Retargeting Motion Capture to Robot Models in UE](/en/blog/motion-capture-robot-control/).

### Shared motion following and IK

The robot follows the current skeleton pose of the dedicated reference model. Differences between motion sources are handled on the input side. I packaged the following behaviour into shared logic so that live capture and recorded playback use the same robot adaptation and solving process.

For adaptation, I read each joint's connection, rotation direction and movement range from the robot's URDF, then configure the correspondence between capture bones and robot joints. Differences in limb length also require proportional conversion of the motion targets.

I implemented and tuned the IK following logic: calculating the joint angles needed to reach a motion target within the robot's structure and movement limits. Joints suited to direct angle transfer have separate settings for rotation direction, motion scale and initial offset.

The results are smoothed, with joint angle changes limited according to elapsed time, before updating UE scene components.

#### Challenge: differences between human and robot structures

The joints of this human-like industrial robot do not fully correspond to human joints. Segment lengths, joint counts and rotation directions differ. Copying a human end-point position or rotation directly can move the model away from the intended pose, so targets must be constructed for the actual mechanism and converted into joint movement through IK.

I scale motion using corresponding human and robot segment lengths, then calculate the target positions for the robot. Solving starts from the previous frame's joint angles and uses the human elbow position to guide the arm's bending direction. Joints suited to direct angle transfer are mapped separately. Structural adaptation and output smoothing are adjusted independently to distinguish mapping errors from input noise.

Related technical record: [Retargeting Motion Capture to Robot Models in UE](/en/blog/motion-capture-robot-control/).

### Mock input and visual debugging

I added mock skeleton input to check the data-processing path without a Kinect feed. It generates arm swings, leg movement and root motion from the reference pose of the intermediate model to check mapping, filtering and model updates.

Debug views can show the capture skeleton and model bones together, with joint names. The robot side also displays targets, actual joint positions, rotation axes and errors, helping identify whether an issue comes from the input pose, proportional conversion or joint configuration. Mock input is for software debugging and does not replace real capture or device testing.

### Live data communication and adaptive filtering

The live prototype sends and receives JSON over UDP. The receiving thread retains the latest parsed frame, which the game Tick reads by data generation. This avoids turning every packet into a queued action that must be executed. Tick schedules output at the configured interval, with the actual timing still affected by the game frame rate.

I use local receive time to detect input timeout and a count of consecutive parseable packets to determine recovery. Invalid input produces zero position and joint values, with rotation reset to identity, and resets filtering. Recovery initialises the filter from the new raw input. These are protocol output rules; they do not mean that a physical robot performs a safe return to its home position.

This part uses a separate adaptive filter. It adjusts the cutoff frequency from movement and angular speed, interpolates positions, and uses normalised quaternion interpolation for rotations. It is configured separately from the per-joint capture filters for its own input path.

Related technical record: [Robot Realtime Data and Three-Axis IK Prototype](/en/blog/robot-realtime-ik-prototype/).

### Three-axis position solving and status output

I implemented and tuned three-axis position solving. It calculates the angles needed at three joints from the target position, mechanism dimensions and joint movement limits. Each adjustment is limited, and the result is checked against the target.

The current prototype handles a serial mechanism with three rotating joints and a fixed tool point, with restrictions on the joints' initial orientations. It solves for the end-point position and does not yet handle the end-point orientation.

Output provides separate `input_valid` and `ik_valid` fields to distinguish acceptable input from a usable joint solution. If input is valid but IK fails, joint output is cleared while the status fields remain available for application logic. Blueprints can start or stop live processing, read the latest result or subscribe to output events.

Related technical record: [Robot Realtime Data and Three-Axis IK Prototype](/en/blog/robot-realtime-ik-prototype/).
