---
title: SimpleLauncher
description: Manage external program launch, stop, multiple instances, and exit notifications through presets.
type: work
slug: simple-launcher
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
order: 12
status: Official documentation
featured: false
draft: false
sitePublish: false
tags:
  - Process management
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19770928
links:
  - label: Original article on CNBlogs
    href: https://www.cnblogs.com/mengzhishanghun/p/19770928
docIds:
  - simple-launcher-guide
sourceDate: 2026-03-25
lang: en
translationKey: simple-launcher
sourceHash: d9ebd4cd12616c68049d82a1bec3d0e8522481b93ff7970502b9dad821548c8f
translationStatus: translated
generatedBodyHash: 4cb189a562e0795ddf83c474365b512a8b7fc05929a867c7d61f341761c0caeb
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/listings/58d6403a-a2fe-4b49-9b27-536e12beace3
    - kind: docs
      href: /docs/zh/guides/ue-tools/simple-launcher-guide/
  compatibility:
    - platforms:
        - Windows (Win64)
        - macOS
        - Linux
      requirements:
        - UE 5.2–5.8
---
## Overview

SimpleLauncher manages external programs through named presets in UE games. Projects configure launch commands, working directories, and execution modes for services or tools, then start, query, or stop processes by preset.

Each preset supports multiple instances. Instance identifiers and exit notifications let game logic distinguish their lifecycles.

## Background and goals

Some UE projects depend at runtime on local services, background processors, or helper tools launched with the game. Scattering executable paths and arguments across Blueprints or code makes later changes and cleanup inconvenient.

The work centralizes process configuration and provides interfaces from launch to exit so callers know which processes they started.

## Core capabilities

### Named presets

Presets store command lines, working directories, hidden-window settings, and detached execution options. Games can call them by name and query, update, or remove configuration at runtime.

Configuration describes how to launch a program; the program and its arguments remain the project's responsibility.

### Multiple instance lifecycles

One preset can launch several processes, each distinguished by FProcessId. Callers can query or stop an individual instance or stop a group by preset, avoiding imprecise management by program name alone.

Instance-level or preset-level exit notifications can update interfaces, clean up state, or trigger the project's own subsequent logic.

### Cleanup on exit

Default non-detached execution cleans up managed processes when the game exits. Detached execution allows external processes to remain alive. This distinction supports different lifecycle policies for temporary helpers and independently running services.

## Use cases

It suits starting local services with a game, invoking background processors during a workflow, or launching several similar instances in parallel for tests.

Exit notifications help determine whether an external task has ended. Failure retries or automatic restarts still need conditions and policies defined by project logic.

## Scope and limitations

The plugin launches and tracks processes it manages; it does not guarantee that a target program runs successfully or produces correct output.

Detached processes do not close automatically with the game, so configuration must establish who terminates them. Command lines and working directories must reference existing, accessible resources.
