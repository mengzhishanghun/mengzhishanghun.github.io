---
title: Smooth Sequencer Curves
type: doc
slug: simple-level-seq-smooth-smooth-curves
draft: false
sitePublish: true
tags:
  - Animation
  - Motion capture
  - Filtering
workIds:
  - simple-level-seq-smooth
documentKind: product-manual
websiteRoute: /en/works/simple-level-seq-smooth/docs/smooth-curves/
lang: en
translationKey: doc:simple-level-seq-smooth:smooth-curves
sourceHash: 1c85f9049133c4d3e3082b98c23c885211c3a56d478621637029935de9f3ddab
translationStatus: translated
generatedBodyHash: 66b1f68446270d46b929b307416416577d49a9ac2962d9a9b45b287395fbe3d2
docPage:
  work: simple-level-seq-smooth
  group: workflows
  slug: smooth-curves
  order: 1
---

Level sequence data filtering plugin with 12 smoothing algorithms covering mocap, post-processing, and AI scenarios.

## Compatibility

- Unreal Engine 5.2–5.8
- Version 1.1.0 (Version 2)

## Features

- **12 Smoothing Algorithms** covering time-domain, frequency-domain, state estimation, adaptive, and AI-specific approaches
- **Content Browser Integration**: Right-click on LevelSequence assets to access smoothing
- **ControlRig Support**: Directly processes ControlRig parameter sections (Transform and Scalar)
- **Flexible Output**: Choose to overwrite the original sequence or create a new one
- **Batch Processing**: Process multiple sequences at once with consistent suffix naming
- **Auto Frame Rate Detection**: Automatically reads the sequence frame rate

## Installation

1. Copy the `SimpleLevelSeqSmooth` folder to your project's `Plugins/` directory
2. Restart the Unreal Editor
3. Enable the plugin in Edit > Plugins if not already enabled

## Usage

1. In the Content Browser, right-click on one or more LevelSequence assets
2. Select **Smooth** from the context menu
3. Choose a smoothing algorithm and adjust parameters
4. Select output mode (overwrite or create new)
5. Click **OK** to apply

## Dependencies

- ControlRig plugin (enabled by default)

## Supported Engine Versions

- Unreal Engine 5.2–5.8

## Version History


Open **Edit → Project Settings**, select the Simple Level Sequence Smooth settings page, and set **Language** to **English** or **Chinese**. English is the default. Available user-facing UI, tooltips, notifications, and functional logs update immediately without restarting the editor. Public API names and module startup/shutdown logs remain in English.

## Contact

For usage questions or collaboration, please visit the contact page.

- **Contact:** [Contact and collaboration](https://mzsh.me/contact/)
