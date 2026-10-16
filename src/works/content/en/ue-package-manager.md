---
title: UEPackageManager
description: Package UE projects through a GUI or CLI and deploy additional files after success.
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
sourceHash: db8a182dad88813b6e7fd7c9335f5f78d5e0e15528355d9981f177e9e88143a3
translationStatus: translated
generatedBodyHash: 8d542f72aab450490fe586f1cacea4095b7692599511d7f74db7b4d0f6eddbae
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
---
## Overview

UEPackageManager is a Windows Unreal Engine project packaging tool with graphical and command-line entry points.

It calls Unreal Automation Tool for Build, Cook, Stage, Pak, Archive, and related steps, then deploys additional files into successful packages according to rules. Project detection, isolated configuration, and output cleanup support controlled repeated packaging.

## Background and goals

UE delivery often separates packaging commands from additional file preparation. Engines, output directories, build types, and accompanying data may vary by project, and reusing a previous project's settings can produce incorrect results.

The work consolidates these choices into one workflow. Its GUI serves the current project, while the command line supports automation with an explicitly specified project.

## Core capabilities

### Project detection and configuration isolation

The GUI detects the .uproject and associated engine from the current project directory, fixing that detected project as the packaging target. Project paths, engine directories, output directories, build types, and extra copy rules are stored separately per project to prevent choices from carrying directly into another project.

The CLI requires an explicit project when it cannot determine one from the current directory.

### UE packaging and result inspection

The tool calls UAT for building, cooking, staging, creating Pak files, and archiving, supporting build types including DebugGame, Development, Test, and Shipping. Users configure output and observe progress in the GUI, or validate configuration, preview commands, and package through the CLI.

Packaging results come from UAT; the tool organizes invocation and feedback.

### Additional deployment after success

Each copy rule specifies a source and destination directory within the package, supporting both files and folders. Directory copying supports recursive exclusion by name patterns and checks copied file integrity.

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
