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
sourceHash: a1ac29fbf7e88cf7bb74055683117edfbe1917a34f98d70486ea15ac96a9af8e
translationStatus: translated
generatedBodyHash: 97839545369ba78792d1e7e73e38746686a230b472c10b23364a971c573b57e6
workInfo:
  channels:
    - kind: open-source
      href: https://github.com/MZSH-Tools/UEPackageManager
    - kind: docs
      href: /docs/zh/tools/ue-package-manager/
  compatibility:
    - platforms:
        - Windows
      requirements:
        - Win64 project packaging; Launcher or source-built engine
websiteCoverUrl: /media/imported/works/ue-package-manager-cover.png
coverAlt: Illustration of Unreal Engine project packaging
---

## Overview

UEPackageManager is a Windows Unreal Engine project packaging tool. Package projects quickly without opening the UE editor, using a graphical interface or the command line.

It calls Unreal Automation Tool for Build, Cook, Stage, Pak, Archive, and related steps, then deploys additional files into successful packages according to rules. Project detection, isolated configuration, and output cleanup support controlled repeated packaging.

## Background and goals

UE delivery often separates packaging commands from additional file preparation. Engines, output directories, build types, and accompanying data may vary by project, and reusing a previous project's settings can produce incorrect results.

The work consolidates these choices into one workflow. Its GUI serves the current project, while the command line supports automation with an explicitly specified project.

## Core capabilities

### Project detection and configuration isolation

The tool automatically detects the current UE project and associated engine, and saves packaging options per project to avoid mixing configurations from different projects.

### UE packaging and result inspection

The tool organizes project packaging through UAT, supports multiple build types, and provides process logs. Both the GUI and CLI can start packaging; actual build results still come from UAT.

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

*UEPackageManager graphical interface: configuring the project, packaging parameters, and additional file copy rules.*

For operation steps and parameter details, see the [user guide](/en/docs/tools/ue-package-manager/).
