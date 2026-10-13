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
sourceHash: 30d6a9599a8bdac90d377e6edc8567a126b823e12406bf2c6abbd359884e7492
translationStatus: translated
generatedBodyHash: cf7665e660e561f92582be071cada4d5af91ea5a3ddff3ee16fc0782f56831e0
---

## Background

A driving training scenario used three screens and needed consistent training visuals across different viewpoints. Together, the screens formed the driving scene, so differences in lighting and exposure directly affected its overall appearance.

This case records my work on inconsistent Lumen indirect lighting and exposure in a three-screen scenario. The work focused on engine support for multiple views and the association of exposure data between views. These two areas were investigated and modified separately.

## Reproduction Environment

The scene used Unreal Engine, Lumen, and a three-screen display. The original record of the Lumen multi-view fix used UE 5.3 as its example and required a source build that allowed the engine to be modified and rebuilt.

The exposure synchronization implementation was recorded against UE 5.3.2 and involved LocalPlayer, FSceneView, and the views' StereoPass settings. These versions are retained to identify the engine implementation locations checked at the time.

## Specific Problem

**Abnormal Lumen lighting across three screens**

Lumen GI light reflections failed in the three-screen display, affecting lighting across the different viewpoints. The original troubleshooting record identified a maximum view count fixed at 2 in the relevant engine implementation, which did not match the three views required by the project.

**Inconsistent exposure between views**

Exposure was also out of sync across the views, producing inconsistent screen brightness. The association of exposure data needed separate treatment: increasing Lumen's view count still left the question of how the views would share the data used to calculate exposure.

## Solution

**Extending Lumen support for multiple views**

To address the fixed view limit in the engine, the maximum view count in the relevant implementations was changed from 2 to 3. The original record covered seven modifications that needed to be treated as one related set of changes.

These changes were made in engine source code and required rebuilding the modified engine. The existing record explicitly states that comparable changes in a non-source build could not achieve this result. For the recorded modifications and source screenshot, [read the multi-view GI fix](https://mzsh.me/blog/ue53-multiview-gi/).

**Associating exposure data across views**

Exposure synchronization was handled through custom LocalPlayer view construction logic, setting the `StereoPass` of non-primary player views to `eSSP_SECONDARY`.

This used the engine's association between primary and secondary views so the relevant views could reuse the data needed for exposure calculation. The UE 5.3.2 record located the corresponding condition in the `FSceneView` constructor. For the code and condition location, [read the exposure synchronization implementation details](https://mzsh.me/blog/cnblogs-19165561/).

Lumen view capacity and exposure data association address two different problems. Their respective rationales need to be retained during maintenance, and implementation locations need to be checked again after an engine version change.

## Final Summary

According to the existing project records, the inconsistent lighting and exposure in the three-screen scene were addressed, and the project continued to be used for simulated driving test instruction.

This approach applies to the UE 5.3 / 5.3.2 three-screen scenario in the original records. Engine upgrades require renewed checks of multi-view limits and exposure data association; changes should not simply be applied at the old file locations.
