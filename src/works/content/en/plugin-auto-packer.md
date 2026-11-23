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
sourceHash: d468840dc8948d1c3458769427b6789372070e5978e096b9fd3f9b51f57cef7c
translationStatus: translated
generatedBodyHash: ff5d7c99bc915675c7ffc12859e92e6e02907e263754cc153089566c2d39060d
workInfo:
  channels:
    - kind: open-source
      href: https://github.com/MZSH-Tools/UEPluginAutoPacker
    - kind: docs
      href: /en/works/plugin-auto-packer/docs/setup/
  compatibility:
    - platforms:
        - Windows
      requirements:
        - Win64 plugin builds only
websiteCoverUrl: /media/covers/works/plugin-auto-packer-20261101.webp
coverAlt: UEPluginAutoPacker cover
docIds:
  - plugin-auto-packer-setup
  - plugin-auto-packer-package
  - plugin-auto-packer-output
  - plugin-auto-packer-updates-2026-08-08
  - plugin-auto-packer-updates-2026-06-19
  - plugin-auto-packer-updates-2026-04-17
  - plugin-auto-packer-updates-2026-02-26
  - plugin-auto-packer-updates-2025-06-22
  - plugin-auto-packer-updates-2025-06-18
  - plugin-auto-packer-updates-2025-06-10
  - plugin-auto-packer-updates-2025-04-21
---

## Overview

UEPluginAutoPacker builds UE plugin packages for Fab and other distribution channels. In the GUI, add your engines, select the plugin and target versions, and choose how to prepare the release files after the build.

To package from the command line, add the engines in the GUI first, then specify the plugin and target engines in the build command.

## Background and goals

Releasing the same plugin for several engine versions requires selecting each engine, running builds, inspecting failure logs, and organizing each delivery directory. Repeated operations can easily mix up versions and outputs.

The work presents each engine task as a separate result, showing which versions completed, failed, or were canceled so developers can inspect their logs and artifacts.

## Core capabilities

### Multi-engine builds

The tool registers paths for Launcher-installed or source engines and detects .uplugin files in the project. After selecting a plugin, it builds separately for multiple configured engines.

The CLI uses these engine configurations and can restrict target versions. Adding and removing configuration remains a GUI responsibility.

### Status and logs

The GUI shows each engine’s status: waiting, packaging, succeeded, failed, or canceled. Click an engine to view its log. If packaging fails for a version, look in that version’s output directory for the failure log.

### Release file preparation

After builds, options can clean intermediate artifacts, copy documentation, generate release filter configuration, or process plugin description fields as needed. Outputs are separated by plugin and engine version.

The tool also offers source copyright notice generation from .uplugin author information. Check target files before enabling options that change content.

## Use cases

It suits UE plugin authors building several engine versions before release and checking compatibility and failures per version. Fab delivery preparation can include appropriate cleanup and filtering in the same task, reducing repeated manual work across output directories.

## Scope and limitations

The current build target is Windows / Win64, and plugin directories require valid .uplugin files.

Successful multi-version tasks still need assessment using logs and tests in target engines. Review preparation options against release requirements. The tool handles plugin packages, not whole UE project packaging.

For operation steps and parameter details, see the [user guide](/en/works/plugin-auto-packer/docs/package/).

## License

This project is open source under the [MIT License](https://github.com/MZSH-Tools/UEPluginAutoPacker/blob/1a1e43b283fcb6deb561cba0636d1e28bc634f8a/LICENSE). You are welcome to use, modify, and distribute it.

## Contact and Support

Author email: **mengzhishanghun@outlook.com**  
Contact me for custom functionality or collaboration!
