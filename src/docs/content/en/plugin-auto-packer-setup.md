---
title: Install and Start
type: doc
slug: plugin-auto-packer-setup
draft: false
sitePublish: true
tags:
  - UnrealEngine
  - Plugins
  - Packaging
workIds:
  - plugin-auto-packer
documentKind: product-manual
websiteRoute: /en/works/plugin-auto-packer/docs/setup/
lang: en
translationKey: doc:plugin-auto-packer:setup
sourceHash: e4c3d35d3a8304327a089920baa6760cc5e7e152776962176f6ec30b79b10948
translationStatus: translated
generatedBodyHash: 7c0877ff55ce5e2c433a54d7959630ebc727169804bd447d643705a72591c041
docPage:
  work: plugin-auto-packer
  group: getting-started
  slug: setup
  order: 1
---

## Run the EXE

1. Download `UEPluginPacker.exe` from the Releases page
2. Place it in your Unreal project root, containing the `.uproject` file
3. Double-click `UEPluginPacker.exe` to open the GUI. You do not need to use the command line or set up a separate environment to run the EXE.

## Run from Source

1. Clone this repository
2. Install Python 3.8+ (Miniconda recommended)
3. Install dependencies and run:

```bash
conda env create -f environment.yml
conda activate UEPluginAutoPacker
pip install -r requirements.txt
python Main.py
```
