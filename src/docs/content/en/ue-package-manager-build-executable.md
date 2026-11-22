---
title: Run from Source and Build the Executable
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
sourceHash: 468d9c814729c29848031d3e81184dd36ce8d4abf70a92c2b740b73d3ca0e8d9
translationStatus: translated
generatedBodyHash: a1f91e74a980a47ac2930f8b484d12b863afe845029b2a1b304d2eb80ef42a66
docPage:
  work: ue-package-manager
  group: workflows
  slug: build-executable
  order: 2
---

## Running from Source

```bat
conda env create -f environment.yml
conda activate UEPackageManager
cd /d E:\Projects\MyGame
python E:\Tools\UEPackageManager\Main.py
python E:\Tools\UEPackageManager\Main.py validate --project-root E:\Projects\MyGame
```
On Windows, you can also double-click `Run.bat` to launch the GUI or use `CLI.bat` to run commands.

## Building a Single-File EXE

```bat
Build.bat
```
The build reads only `UEPackageManager.spec` and produces `dist/UEPackageManager.exe`. This EXE retains the CLI console and automatically hides it in GUI mode with no arguments.
