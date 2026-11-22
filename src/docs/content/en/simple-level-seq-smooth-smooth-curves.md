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
sourceHash: 053f1b8aa5e24be2fad5804884d46e16233220448d9aaeb22b970691471a6e31
translationStatus: translated
generatedBodyHash: b158fa677add222283fa244b11b2d346c532f215923386a2c420679df07ea8b8
docPage:
  work: simple-level-seq-smooth
  group: curves
  slug: smooth-curves
  order: 1
---

## Supported Sequences and Output

**Smooth** handles one or more LevelSequence assets, including Transform and Scalar channels in ControlRig parameter sections. It reads the sequence frame rate automatically and uses a consistent suffix when creating new sequences in a batch. Choose whether to overwrite the originals or create new sequences.

## Apply Smoothing from the Content Browser

1. In the Content Browser, right-click on one or more LevelSequence assets
2. Select **Smooth** from the context menu
3. Choose a smoothing algorithm and adjust parameters
4. Select output mode (overwrite or create new)
5. Click **OK** to apply
