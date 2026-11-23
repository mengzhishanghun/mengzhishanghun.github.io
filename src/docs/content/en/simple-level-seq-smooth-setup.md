---
title: Installation and Interface Settings
type: doc
slug: simple-level-seq-smooth-setup
draft: false
sitePublish: true
tags:
  - Animation
  - Motion capture
  - Filtering
workIds:
  - simple-level-seq-smooth
documentKind: product-manual
websiteRoute: /en/works/simple-level-seq-smooth/docs/setup/
lang: en
translationKey: doc:simple-level-seq-smooth:setup
sourceHash: c38c535bac289c74b9735128b113909b852423b6342cedc63e5eda2cac6a929a
translationStatus: translated
generatedBodyHash: 2cf23733de630f7ad9e5cc43500f7d4d97266ecbdb5c392ec3c9851b79969e91
docPage:
  work: simple-level-seq-smooth
  group: getting-started
  slug: setup
  order: 1
---

## Install the Plugin

1. Copy the `SimpleLevelSeqSmooth` folder to your project's `Plugins/` directory
2. Restart the Unreal Editor
3. If the plugin is disabled, find and enable it under **Edit → Plugins**.

## ControlRig Dependency

After restarting, check that ControlRig is enabled. Use a LevelSequence with a ControlRig parameter section, then open **Smooth** from its Content Browser context menu.

- ControlRig plugin (enabled by default)

## Interface Language

Open **Edit → Project Settings**, select the Simple Level Sequence Smooth settings page, and set **Language** to **English** or **Chinese**. English is the default. Available user-facing UI, tooltips, notifications, and functional logs update immediately without restarting the editor. Public API names and module startup/shutdown logs remain in English.
