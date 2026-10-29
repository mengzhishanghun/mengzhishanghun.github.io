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
  - Motion capture
  - Robotics
  - Prototype
coverAlt: AI concept cover for Motion capture and robot control, not a project screenshot
websiteCoverUrl: /assets/cases/motion-capture-robot-cover.png
translationKey: motion-capture-robot-control
lang: en
sourceHash: bed108c6a82e17d2c2e1f221f001961f8e0ecf793ee50c11a6d11671f520bbe2
translationStatus: translated
generatedBodyHash: b3b7fc2cf6020907509c02a5a5944ebfa8ec72c7515d952c981fb557b05ddaa9
---

## Project overview

This project maps human motion to robot mechanisms. Motion-capture devices or live data provide input, UE processes skeletons, poses and target positions, and the robot definition determines model motion or joint values.

Motion retargeting, live communication and three-axis IK are different parts of the same project, covering input motion, data state and mechanism solving.

## My contribution

- Integrated Kinect skeleton data, missing-joint handling, position and angle filtering, and an intermediate skeleton.
- Retargeted motion using robot proportions, joint axes and limits, with IK and direct angle mapping for UE models.
- Developed a software prototype for UDP JSON latest-frame handoff, timeout recovery and adaptive filtering.
- Integrated three-joint position IK with separate input-valid and solve-valid states.

## Implementation and results

The existing pipeline covers motion input, an intermediate skeleton and motion mapping to UE robot components. The live-data and three-axis IK software prototypes expose reception, scheduling, filtering and solve states separately.

Model pose adjustments, a real mechanism URDF and real-data tests remain outstanding. UE model motion and protocol output do not establish physical robot communication, feedback or closed-loop control. The three-axis prototype currently solves target position only.

## Technical notes

- [Retargeting captured skeletons to UE robot models](/blog/motion-capture-robot-control/)
- [Live robot data and a three-axis IK prototype](/blog/robot-realtime-ik-prototype/)
