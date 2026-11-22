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
sourceHash: 91be48ed21779c7ab8b79fba08de77f6ecb8c98b9c1871d1f89b06c0a31d9558
translationStatus: translated
generatedBodyHash: c418bfcc6f1ab44a6dd910b1d79df5371e6e747f321ebcdd709284f1db7e665b
docPage:
  work: ue-package-manager
  group: setup
  slug: install-and-detect
  order: 1
---

## Download and run UEPackageManager

Download `UEPackageManager.exe` from [Releases](https://github.com/MZSH-Tools/UEPackageManager/releases/latest).

- Double-click the EXE without arguments to hide the console and open the GUI.
- Run a subcommand in a terminal to retain the console and CLI output.
- Place the EXE in the project root containing `.uproject` and double-click it. The project and associated engine are detected automatically and cannot be selected or changed in the GUI.
- Launching from a terminal in the project root also detects them automatically. If the EXE is elsewhere, the GUI refuses to package and tells you the correct location.
- The current EXE does not have commercial code signing. Windows may show a SmartScreen prompt on first launch. Use the SHA-256 file included with the Release to check download integrity.

[Package the detected project](/en/works/ue-package-manager/docs/package-project/)
