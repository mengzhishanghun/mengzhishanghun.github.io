---
title: Run and Build from Source
type: doc
slug: ue-package-manager-build-executable
draft: false
sitePublish: true
tags:
  - UnrealEngine
  - Packaging
  - Automation
workIds:
  - ue-package-manager
documentKind: product-manual
websiteRoute: /en/works/ue-package-manager/docs/build-executable/
lang: en
translationKey: doc:ue-package-manager:build-executable
sourceHash: f3fd8eb83492dbc832172035132ffbc5c60be776c8e5945413659bd74933529e
translationStatus: translated
generatedBodyHash: 307cd27f8dbdfd39e992ba63ac6aaced1d9a884d3c8ff4bc746a4ba939a13e80
docPage:
  work: ue-package-manager
  group: features
  slug: build-executable
  order: 5
---

## Run from source

Create and activate the Conda environment from `environment.yml` in the tool’s source directory, then switch to the UE project directory. Replace the two absolute paths in the example with your own paths to the UE project and the tool’s source.

```bat
conda env create -f environment.yml
conda activate UEPackageManager
cd /d E:\Projects\MyGame
python E:\Tools\UEPackageManager\Main.py
python E:\Tools\UEPackageManager\Main.py validate --project-root E:\Projects\MyGame
```
On Windows, you can also double-click `Run.bat` to launch the GUI or use `CLI.bat` to run commands.

## Build a single-file EXE

Run the build command from the tool’s source directory:

```bat
Build.bat
```
The build reads only `UEPackageManager.spec` and produces `dist/UEPackageManager.exe`. This EXE retains the CLI console and automatically hides it in GUI mode with no arguments.
