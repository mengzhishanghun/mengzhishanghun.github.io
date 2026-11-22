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
sourceHash: 0e25575e6009d8564c5ef5d8ec56695339332065df8020b576c2731a20bfdfd4
translationStatus: translated
generatedBodyHash: 753afbcc6c30278d2eb76099a4581487dc81ae766f54d2d27d503253b177abe4
docPage:
  work: ue-package-manager
  group: source
  slug: build-executable
  order: 1
---

## Run from source

```bat
conda env create -f environment.yml
conda activate UEPackageManager
cd /d E:\Projects\MyGame
python E:\Tools\UEPackageManager\Main.py
python E:\Tools\UEPackageManager\Main.py validate --project-root E:\Projects\MyGame
```
On Windows, you can also double-click `Run.bat` to launch the GUI or use `CLI.bat` to run commands.

## Build a single-file EXE

```bat
Build.bat
```
The build reads only `UEPackageManager.spec` and produces `dist/UEPackageManager.exe`. This EXE retains the CLI console and automatically hides it in GUI mode with no arguments.
