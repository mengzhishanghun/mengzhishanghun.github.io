---
title: UEPluginAutoPacker
description: Prepare UE plugins for release, primarily for Fab submissions and also for other distribution channels.
type: work
slug: plugin-auto-packer
categoryId: open-source-tools
categoryName: Open-source tools
categoryOrder: 1
order: 1
status: Official documentation
featured: false
draft: false
sitePublish: false
tags:
  - UnrealEngine
  - Plugins
  - Packaging
links:
  - label: GitHub
    href: https://github.com/MZSH-Tools/UEPluginAutoPacker
lang: en
translationKey: plugin-auto-packer
sourceHash: f75657b2c22c422920bb1686505a16d44f9542ac55313867a93172b7856130bd
translationStatus: translated
generatedBodyHash: 2775ee494b392227d00cf5c5566bbfa98dd81f6d399ef6002f41cf2665c105b7
workInfo:
  channels:
    - kind: open-source
      href: https://github.com/MZSH-Tools/UEPluginAutoPacker
    - kind: docs
      href: /docs/zh/tools/plugin-auto-packer/
  compatibility:
    - platforms:
        - Windows
      requirements:
        - Win64 plugin builds only
websiteCoverUrl: /media/imported/works/plugin-auto-packer-cover.png
coverAlt: UEPluginAutoPacker cover
---

## Overview

UEPluginAutoPacker packages UE plugins for release, primarily for Fab submissions and also for other distribution channels. It brings multi-engine configuration, plugin builds, status inspection, and release file preparation into one interface.

The GUI supports observing each engine task, while the CLI builds a specified plugin using configured engines.

## Background and goals

Releasing the same plugin for several engine versions requires selecting each engine, running builds, inspecting failure logs, and organizing each delivery directory. Repeated operations can easily mix up versions and outputs.

The work presents each engine task as a separate result, showing which versions completed, failed, or were canceled so developers can inspect their logs and artifacts.

## Core capabilities

### Multi-engine builds

The tool registers paths for Launcher-installed or source engines and detects .uplugin files in the project. After selecting a plugin, it builds separately for multiple configured engines.

The CLI uses these engine configurations and can restrict target versions. Adding and removing configuration remains a GUI responsibility.

### Status and logs

The GUI shows waiting, packaging, successful, failed, and canceled states per engine, with corresponding log views. Failed results retain log files to locate problems in a specific engine version rather than reporting only one success or failure for the entire batch.

### Release file preparation

After builds, options can clean intermediate artifacts, copy documentation, generate release filter configuration, or process plugin description fields as needed. Outputs are separated by plugin and engine version.

The tool also offers source copyright notice generation from .uplugin author information. Check target files before enabling options that change content.

## Use cases

It suits UE plugin authors building several engine versions before release and checking compatibility and failures per version. Fab delivery preparation can include appropriate cleanup and filtering in the same task, reducing repeated manual work across output directories.

## Scope and limitations

The current build target is Windows / Win64, and plugin directories require valid .uplugin files.

Successful multi-version tasks still need assessment using logs and tests in target engines. Review preparation options against release requirements. The tool handles plugin packages, not whole UE project packaging.

For operation steps and parameter details, see the [user guide](/en/docs/tools/plugin-auto-packer/).
