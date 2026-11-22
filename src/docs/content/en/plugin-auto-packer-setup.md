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
sourceHash: 24db6b6daccbd29087a6645d656fc544e7bee6a2040c30381abedcbd5cc5d50c
translationStatus: translated
generatedBodyHash: 67779645c440c33bdd855ee71a19aaabd535ea9405b2704f7b6924ce2cd62b98
docPage:
  work: plugin-auto-packer
  group: setup
  slug: setup
  order: 1
---

## Run the EXE

1. Download `UEPluginPacker.exe` from the Releases page
2. Place it in your Unreal project root, containing the `.uproject` file
3. Double-click to run; no command-line or environment configuration is required

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
