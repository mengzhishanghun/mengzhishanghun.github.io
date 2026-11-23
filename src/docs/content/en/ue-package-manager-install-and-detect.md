---
title: Download and Detect a Project
type: doc
slug: ue-package-manager-install-and-detect
draft: false
sitePublish: true
tags:
  - UnrealEngine
  - Packaging
  - Automation
workIds:
  - ue-package-manager
documentKind: product-manual
websiteRoute: /en/works/ue-package-manager/docs/install-and-detect/
lang: en
translationKey: doc:ue-package-manager:install-and-detect
sourceHash: b4d4355c35a87b56aa12f121d77c88f0f1e9e3996cc2501261ce576e168016f0
translationStatus: translated
generatedBodyHash: cac672ef2985aee9d96fc06a16828d33b819bc05b1fd99f99e7ee5802c45d10e
docPage:
  work: ue-package-manager
  group: getting-started
  slug: install-and-detect
  order: 1
---

## Download and run UEPackageManager

Download `UEPackageManager.exe` from [Releases](https://github.com/MZSH-Tools/UEPackageManager/releases/latest). If you plan to launch it by double-clicking, first put it in the project root that contains the `.uproject` file.

- Double-click the EXE without arguments to hide the console and open the GUI.
- Run a subcommand in a terminal to retain the console and CLI output.
- Place the EXE in the project root containing `.uproject` and double-click it. The project and associated engine are detected automatically and cannot be selected or changed in the GUI.
- Launching from a terminal in the project root also detects them automatically. If the EXE is elsewhere, the GUI refuses to package and tells you the correct location.
- The current EXE does not have commercial code signing. Windows may show a SmartScreen prompt on first launch. Use the SHA-256 file included with the Release to check download integrity.

[Package the detected project](/en/works/ue-package-manager/docs/package-project/)
