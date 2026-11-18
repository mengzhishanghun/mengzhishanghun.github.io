---
title: Motion capture and robot control
description: "A motion-following project for real industrial robots. Live and recorded motion capture are converted to robot joint movements, with the following behaviour tested in UE."
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
sourceHash: "691f0904ef444bafe91722cd7789f2646d2cf7d6a23e60620e1dd95d09f5fcda"
translationStatus: translated
generatedBodyHash: "bfed7a422397e564d9ace1d7114d2551d06540117831b92c9b82d36ef71b09b7"
---

## Project overview

I started this project to make a real industrial robot follow human movement. The UE demo uses a human-like model based on a real industrial robot. Its joint layout, limb proportions and range of motion differ from ours, so the model cannot simply copy a human skeleton's movements.

I use the same motion-capture model as the reference for both live and recorded movement. It can receive live poses from Kinect or play a filtered recording as a Level Sequence (LS). In either case, the following component calculates the robot's target joint angles from the current pose of that model.

I integrated motion-capture data and filtering, configured the capture model, adapted the robot's joint structure, and implemented and debugged the inverse kinematics (IK). The project also includes a real-time control prototype using UDP and three-axis position IK. Hardware integration and the real data link still need to be verified.

**Demo video**: A recorded motion-capture sequence plays back in UE so you can compare the movements of the human and industrial robot models. Some poses may differ from the original movement because of the robot's joint structure. This is not footage of the physical robot.

## My work

| Module | Main work |
| --- | --- |
| Recorded motion processing and playback | Filter motion captured as LS assets, then use playback to drive the reference model |
| Live capture and the intermediate skeleton | Capture body joints with Kinect and update the reference model in real time |
| Filtering and angle handling | Process recorded motion curves and live joint data, including angle changes across ±180° in the live input |
| Shared following logic and IK | Read the capture model pose and solve joint movement using the configured mappings, robot joint constraints and limb proportions |
| Debugging and configuration | Provide mock input, skeleton lines, targets and error displays to inspect mapping and solving |
| Live data communication | UDP JSON transport, latest-frame handoff, input timeout and recovery |
| Three-axis position solving | Implement and tune position IK, read mechanism parameters, convert coordinates and report solution status |

### Recorded motion processing and playback

Recorded motion plays back from an LS. I filter the motion curves, then play the result on the capture model. The same following logic drives the robot model. Live Kinect input skips this step.

The filtered sequence can be saved as a separate asset for comparison with the original recording and for repeated checks of the same motion.

### Live capture and the intermediate skeleton

For live following, Kinect continuously captures skeletal data. I select the tracked person through configuration, map the captured joints to the PN3 capture model, and apply the filtered positions and rotations to it. As the pose updates, the robot model uses the same IK following logic as recorded playback.

The component checks that the target model and mapped bone names exist. At runtime, it checks the device, skeleton data and joint indices before updating the model.

Each mapping can apply position and rotation separately. In the default configuration, the root receives both, while the other mappings mainly pass rotation. The reference model acts as the intermediate skeleton, providing a common pose source and allowing capture data and robot movement to be inspected separately.

### Filtering and angle continuity

Filtering covers recorded sequences and live input. The LS side smooths recorded motion curves; the Kinect side processes live position and rotation for each joint. Both provide several filtering methods and adjustable parameters to suit the motion.

#### Challenge: angle boundaries affecting filtering

A change from 179° to -179° represents a small rotation, but direct subtraction produces a difference close to a full turn. Passing that difference straight into a filter can disrupt the pose transition.

For live Kinect input, I bring the difference between adjacent frames into the ±180° range, accumulate continuous angles, then filter and convert them back into rotation data. The three position components use separate filter channels.

### Shared motion following and IK

The robot follows the current skeleton pose of the dedicated reference model. Differences between motion sources are handled on the input side. I packaged the following behaviour into shared logic so that live capture and recorded playback use the same robot adaptation and solving process.

I used two UE Data Assets to adapt motion to the robot. The mapping asset `URetargetMappingAsset` pairs motion-capture bones with robot joints. Each mapping determines how the captured pose is used: as an IK end target or intermediate constraint, or as a direct mapping of rotation or a single-axis angle.

The joint asset `UURDFAsset` stores the robot's joint hierarchy, rotation axes and angle limits. The following component uses this data to build IK chains and apply the resulting joint angles. The editor can export the joint asset as a URDF file, but at runtime the following logic reads the asset itself without parsing the exported file.

For IK, I scale the target using the relative limb lengths of the human and robot, then solve for the joint angles needed to reach it. Joints that can follow angles directly have their own settings for rotation direction, motion scale and initial offset.

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

### Three-axis position solving and status output

I implemented and tuned three-axis position solving. It calculates the angles needed at three joints from the target position, mechanism dimensions and joint movement limits. Each adjustment is limited, and the result is checked against the target.

The current prototype handles a serial mechanism with three rotating joints and a fixed tool point, with restrictions on the joints' initial orientations. It solves for the end-point position and does not yet handle the end-point orientation.

Output provides separate `input_valid` and `ik_valid` fields to distinguish acceptable input from a usable joint solution. If input is valid but IK fails, joint output is cleared while the status fields remain available for application logic. Blueprints can start or stop live processing, read the latest result or subscribe to output events.

Related technical record: [Robot Realtime Data and Three-Axis IK Prototype](/en/blog/robot-realtime-ik-prototype/).
