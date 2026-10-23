---
title: Resolving Inconsistent Three-Screen Display in a Driving Test Simulator
description: Investigating and modifying engine implementations to address failed Lumen GI light reflections and inconsistent exposure across three screens.
type: case
slug: driving-simulator-three-screen
categoryId: ue-projects
categoryName: Unreal Engine Projects
categoryOrder: 0
status: Completed
featured: false
draft: false
sitePublish: true
tags:
  - Lumen
  - Multi-screen display
  - Simulation
coverAlt: Flowchart for resolving inconsistent three-screen display in a driving test simulator
websiteCoverUrl: /assets/cases/driving-simulator-three-screen.png
lang: en
translationKey: driving-simulator-three-screen
sourceHash: 8e278a89bf8640441c5ba7e25d29ffeefe1c8e1f0c6897a07a403d35268b3d3f
translationStatus: translated
generatedBodyHash: fca23a166adaee8802ac13910fa02b471a4acf7b513ff0dcba2c3aac1c7a1405
---

## Background

A driving training scenario used three screens and needed consistent training visuals across different viewpoints. Together, the screens formed the driving scene, so differences in lighting and exposure directly affected its overall appearance.

I helped address inconsistent Lumen indirect lighting and exposure in a three-screen scenario. The work focused on engine support for multiple views and exposure data association between views. The two areas were investigated and modified separately.

## Reproduction Environment

The scene used Unreal Engine, Lumen, and a three-screen display. The original record of the Lumen multi-view fix used UE 5.3 as its example and required a source build that allowed the engine to be modified and rebuilt.

The exposure synchronization implementation was recorded against UE 5.3.2 and involved LocalPlayer, FSceneView, and the views' StereoPass settings. The version identifies the engine implementation locations checked at the time.

## Specific Problem

**Abnormal Lumen lighting across three screens**

Lumen GI light reflections failed in the three-screen display, affecting lighting across the different viewpoints. The original troubleshooting record identified a maximum view count fixed at 2 in the relevant engine implementation, which did not match the three views required by the project.

**Inconsistent exposure between views**

Exposure was also out of sync across the views, producing inconsistent screen brightness. The association of exposure data needed separate treatment: increasing Lumen's view count still left the question of how the views would share the data used to calculate exposure.

## Solution

**Extending Lumen support for multiple views**

The fixed maximum view count in the relevant engine implementations was changed from 2 to 3. The seven recorded modifications are related and need to be treated as one set of changes.

These changes were made in engine source code and required rebuilding the modified engine. The existing record explicitly states that comparable changes in a non-source build could not achieve this result. For the recorded modifications and source screenshot, [read the multi-view GI fix](https://mzsh.me/blog/ue53-multiview-gi/).

**Associating exposure data across views**

Exposure synchronization was handled through custom LocalPlayer view construction logic, setting the `StereoPass` of non-primary player views to `eSSP_SECONDARY`.

This used the engine's association between primary and secondary views so the relevant views could reuse the data needed for exposure calculation. The UE 5.3.2 record located the corresponding condition in the `FSceneView` constructor. For the code and condition location, [read the exposure synchronization implementation details](https://mzsh.me/blog/cnblogs-19165561/).

Lumen view capacity and exposure data association address two different problems. Maintenance needs to preserve the rationale for each change and check implementation locations again after an engine version change.


According to the existing project records, the inconsistent lighting and exposure in the three-screen scene were addressed, and the project continued to be used for simulated driving test instruction.

This approach applies to the UE 5.3 / 5.3.2 three-screen scenario in the original records. Engine upgrades require renewed checks of multi-view limits and exposure data association; changes should not simply be applied at the old file locations.

## Discuss your project

If your UE multi-screen project has inconsistent brightness, Lumen lighting issues, or reflection problems between views, I can help inspect the view configuration and engine implementation, identify the cause, and assess changes for your engine version.

Useful details include the engine version, how the displays are configured, and screenshots or video showing the difference.

If you have a related project, [get in touch](https://mzsh.me/en/contact/) to discuss it.
