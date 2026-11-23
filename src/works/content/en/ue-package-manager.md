---
title: UEPackageManager
description: Package UE projects directly without opening the editor, using a graphical interface or the command line.
type: work
slug: ue-package-manager
categoryId: open-source-tools
categoryName: Open-source tools
categoryOrder: 1
order: 0
status: Official documentation
featured: false
draft: false
sitePublish: false
tags:
  - UnrealEngine
  - Packaging
  - Automation
links:
  - label: GitHub
    href: https://github.com/MZSH-Tools/UEPackageManager
lang: en
translationKey: ue-package-manager
sourceHash: 1a007d54a1ff1a07aa4f1acf8e4c71940fff1a3418202a1b1e46688aab4f7443
translationStatus: translated
generatedBodyHash: b99504c09dc46f248b26a0b6ee6fb066adc8087d120a8740dec2199ee4529063
workInfo:
  channels:
    - kind: open-source
      href: https://github.com/MZSH-Tools/UEPackageManager
    - kind: docs
      href: /en/works/ue-package-manager/docs/install-and-detect/
websiteCoverUrl: /media/imported/works/ue-package-manager-cover-v2.png
coverAlt: UEPackageManager cover
docIds:
  - ue-package-manager-install-and-detect
  - ue-package-manager-package-project
  - ue-package-manager-project-configuration
  - ue-package-manager-deploy-additional-files
  - ue-package-manager-clean-old-packages
  - ue-package-manager-build-executable
  - ue-package-manager-updates-2026-09-15
---

## Overview

UEPackageManager packages Unreal Engine projects on Windows. Start packaging from the GUI or the command line without opening Unreal Editor first.

It calls Unreal Automation Tool for Build, Cook, Stage, Pak, Archive, and related steps, then deploys additional files into successful packages according to rules. Project detection, isolated configuration, and output cleanup support controlled repeated packaging.

## Background and goals

UE delivery often separates packaging commands from additional file preparation. Engines, output directories, build types, and accompanying data may vary by project, and reusing a previous project's settings can produce incorrect results.

The work consolidates these choices into one workflow. Its GUI serves the current project, while the command line supports automation with an explicitly specified project.

## Core capabilities

### Project detection and configuration isolation

The tool automatically detects the current UE project and associated engine, and saves packaging options per project to avoid mixing configurations from different projects.

### UE packaging and result inspection

Choose a build configuration in the GUI or on the command line, then start packaging. UAT runs the build, and the log shows its progress and result.

### Additional deployment after success

Rules can copy files or folders into the package and filter out content that should not be delivered.

This stage only runs after UE packaging succeeds, preventing extra content from being placed into failed outputs. Targets are restricted to the package root, so rules cannot write to arbitrary external paths.

### Old package cleanup controls

Users may choose to clean an old package detected at the current output location before packaging, but actual cleanup still requires confirmation. Changing output paths does not retroactively clean the old location, protecting other directories. Cleanup and additional deployment both operate on the current packaging target.

## Use cases

It suits teams repeatedly generating Win64 project packages with accompanying data, configuration, or helper tools.

The GUI helps inspect the current project and options. The CLI can integrate the same workflow into scripts, but parameters, output directories, and logs still require review.

## Scope and limitations

Current scope is Win64 project packaging on Windows, using a Launcher engine or a manually specified source engine.

Full Debug builds, standalone plugin packaging, automatic editor closure, and project version control operations are outside the tool's responsibilities. Projects must still confirm additional file content, licensing, and deployment locations.

## Screenshots

![](/media-occurrence/work%3Aue-package-manager%3Amedia%3A1)

*UEPackageManager shows the detected project and engine at the top. Use the fields below to set the output directory, build configuration, and additional file rules.*

For operation steps and parameter details, see the [user guide](/en/works/ue-package-manager/docs/package-project/).

## License

[MIT License](https://github.com/MZSH-Tools/UEPackageManager/blob/f15dfdb00e1d06919035ccd95bc752c2877a3f8c/LICENSE)
