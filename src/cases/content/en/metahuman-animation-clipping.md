---
title: Addressing Clipping When Combining MetaHuman Head and Body Animations
description: Adjusting head animation Additive Settings and using a script Blueprint to process the same settings across multiple animations.
type: case
slug: metahuman-animation-clipping
categoryId: ue-projects
categoryName: Unreal Engine Projects
categoryOrder: 0
order: 9
status: Completed
featured: false
draft: false
sitePublish: true
tags:
  - MetaHuman
  - Animation
  - Batch processing
coverAlt: Workflow for previewing and checking head and body animations after adjusting Additive Settings
websiteCoverUrl: /assets/cases/metahuman-animation-clipping.png
lang: en
translationKey: metahuman-animation-clipping
sourceHash: 592ac8dad6d4c501f244b39c0b4ce59bc2d901aa792e2f183f05ef2116c8b7e4
translationStatus: translated
generatedBodyHash: f7e2869e32a60af43189bb0b986d848eb864109dc6b11334633805b219caed28
---

## Background

While working on a MetaHuman project, I encountered clipping around the neck when different head and body animations played simultaneously. I first addressed the settings of the head animation asset, then organized the same settings into a batch operation.

The single-animation method was based on a public tutorial. I used it in UE 5.6 and processed the same settings in batches with a script Blueprint.

## Reproduction Environment

The scene used Unreal Engine 5.6 and MetaHuman, with separate animations playing on the head and body. The original record noted that the same problem had not been observed in LevelSequence at the time.

The reference video used UE 5.2, while the project used UE 5.6. Validation in this project does not establish the result for all versions and animation combinations.

## Specific Problem

When head and body animations played simultaneously, clipping appeared around the neck and disrupted the character's continuous appearance. The symptom was related to the head animation's additive settings, requiring inspection of the animation asset as well as playback operations in the character scene.

With many similar animations, opening each asset to change the same settings took time and made omissions possible. The repeated operation needed to be organized into batch steps.

## Solution

The method was based on "Combine Face and Body Animations - Metahumans in Unreal Engine 5.2"; [watch the reference video](https://www.youtube.com/watch?v=ddQKMTKGpTE). First, open Asset Details for the relevant head animation and adjust Additive Settings.

The settings in the original screenshot were: `Additive Anim Type` set to `Mesh Space`, `Base Pose Type` set to `Frame from this animation`, and `Ref Frame Index` set to `0`. These values apply to the head animation scenario in the record; their suitability still needs to be checked before applying them to other animations.

After confirming the settings for one animation, a script Blueprint was used to organize batch modifications. For creating and configuring the script Blueprint, running its function, and screenshots of the results, [read the batch processing steps](https://mzsh.me/blog/cnblogs-19136316/).


I tested the method successfully in UE 5.6. Batch processing the same animation settings reduces repeated changes to individual assets.

This result applies to the neck clipping observed with separate head and body animations playing together. The LevelSequence record only says that the same symptom had not been found at the time; it does not establish that every playback path was validated.

## Discuss your project

If your MetaHuman clips when combining head and body animations, or you need to update animation asset settings in batches, I can help inspect the playback method, additive settings, and batch workflow.

Share the engine version, animation source, and a video of the issue so we can check whether it matches this case.

If you have a related project, [get in touch](https://mzsh.me/en/contact/) to discuss it.
