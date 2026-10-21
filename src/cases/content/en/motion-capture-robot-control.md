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
sourceHash: d440d5bee959836f5807bc516abb225e0fbff9bd5d83b298e94b12df1c3220c9
translationStatus: translated
generatedBodyHash: 99f15ef4c9d1a980b7f5f5a577cee9dda01eff6c1f57c25d5c9f1c5edb91447e
---

## Human Motion and Robot Structure

Human joint positions and proportions often differ from those of a robot model. Copying rotations directly can produce unsuitable motion ranges, jitter, or distorted poses. I worked on a retargeting pipeline from motion-capture input to robot models inside UE, allowing input processing and joint mapping to be adjusted separately.

## Two Retargeting Stages

KinectRetarget reads Kinect skeleton data, filters each joint, and writes the pose to a PN3 PoseableMesh. This input stage handles joint fluctuations before passing pose data to model mapping.

On the robot side, the implementation reuses URDFForge's RobotRetargetComponent to map motion according to structural proportions. Joints can use IK or direct-angle control, followed by smoothing and angular-speed limits. `SetRelativeRotation` then updates UE scene components.

Joint correspondence, proportions, and motion constraints can therefore be adjusted for each model, rather than tying capture input directly to one robot structure.

## Implemented Scope and Model Adjustments

This case covers motion retargeting for robot models inside UE. Each model still needs checks of bone directions, joint proportions, and motion ranges. Some pose distortion in the Kinect-to-PN3 path still needs adjustment.

Actuator communication, feedback, and closed-loop control for a physical robot require a separate device-integration assessment.

## Discuss Your Project

To drive a robot or non-standard skeleton in UE with motion-capture data, share the input device, model structure, and target movements. I can help define joint mapping, constraints, and pose processing.

[Get in touch](/en/contact/) to discuss it.
