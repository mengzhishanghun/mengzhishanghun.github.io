---
title: SimpleLevelSeqSmooth
description: Filter and smooth Level Sequence data with batch processing and ControlRig parameter section support.
type: work
slug: simple-level-seq-smooth
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
order: 15
status: Official documentation
featured: false
draft: false
sitePublish: false
tags:
  - Animation
  - Motion capture
  - Filtering
  - Simple series
links:
  - label: GitHub
    href: https://github.com/MZSH-UEPlugins/SimpleLevelSeqSmooth
lang: en
translationKey: simple-level-seq-smooth
sourceHash: 9781f51b8bb619017083a4aad3e0c56415401b4f8360d1b93dffd0a6a131d3fd
translationStatus: translated
generatedBodyHash: fbe477c43637fd7c03dc84dcc65cf83e96a1236df3e1dd39132aae8873546492
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/listings/b8acac2b-913d-47ce-8596-b4e2d7d6753a
    - kind: docs
      href: /en/works/simple-level-seq-smooth/docs/setup/
  compatibility:
    - platforms:
        - Windows (Win64)
        - macOS
        - Linux
      requirements:
        - UE 5.2–5.8
websiteCoverUrl: /media/covers/works/simple-level-seq-smooth-20261101.webp
coverAlt: SimpleLevelSeqSmooth cover
docIds:
  - simple-level-seq-smooth-setup
  - simple-level-seq-smooth-smooth-curves
---

## Overview

SimpleLevelSeqSmooth provides data filtering and smoothing for Unreal Engine Level Sequence, addressing curve jitter, skipped frames, and similar issues in motion capture, pose estimation, and animation post-processing.

Users select sequences in the Content Browser, process data with a chosen algorithm, and either overwrite the original sequence or generate a new one.

## Background and goals

Captured or generated animation data may contain unwanted high-frequency changes. Adjusting curves individually by hand takes time and makes consistent processing across a batch difficult.

The plugin brings algorithm selection, parameter adjustment, and batch processing into one workflow. Users choose a smoothing strategy based on data characteristics, then check that necessary motion details remain.

## Core capabilities

### Multiple filtering methods

Twelve algorithms are provided, including moving average, Gaussian, median, Butterworth, Kalman, and One Euro filters.

Check whether the curve has isolated spikes or persistent jitter, then choose a filter and settings based on the movement you need to preserve. Tune the settings for each asset.

### Sequence and parameter section processing

The tool supports batch processing of ControlRig Transform and Scalar parameter sections in Level Sequences and reads sequence frame rates.

### Output options

Results can be written to the original sequence or saved as a new one. Save a new sequence to compare the motion before and after filtering. Before overwriting, make sure you can recover the original. Outputs remain sequence assets for UE projects, and their effect should be checked in the target shot.

## Use cases

It suits motion capture curve cleanup, post-processing of pose estimation results, and workflows applying consistent filtering to several Level Sequences.

For assets that need less jitter while retaining rapid motion, compare algorithms and parameter settings before choosing the final output.

## How to use it

1. [Install the plugin and check that ControlRig is enabled](/en/works/simple-level-seq-smooth/docs/setup/). In the Content Browser, select one or more Level Sequence assets, right-click, and choose **Smooth**.
2. Choose a filter and adjust its settings. For example, start with a median filter if the motion capture curve has occasional spikes.
3. Save a new sequence first. In the target shot, compare the results to see whether the spikes are reduced and fast movements are still intact. Sequences generated in a batch use the same naming suffix.

## Scope and limitations

The tool targets Level Sequence data and supported ControlRig parameter sections.

Filtering may also weaken genuine fast motion, and skipped frames may have causes beyond curve noise. Select algorithms, parameters, and overwrite behavior for each sequence; processed curves do not by themselves prove that motion quality has been reviewed.

See the [usage guide](/en/works/simple-level-seq-smooth/docs/smooth-curves/) for steps and parameters.

## Compatibility

- Unreal Engine 5.2–5.8
- Version 1.1.0 (Version 2)

## Contact and Support

For usage questions or collaboration, please visit the contact page.

- **Contact:** [Contact and collaboration](https://mzsh.me/contact/)
