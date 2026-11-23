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
  - Simple series
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19770928
links:
  - label: Original article on CNBlogs
    href: https://www.cnblogs.com/mengzhishanghun/p/19770928
docIds:
  - simple-launcher-setup
  - simple-launcher-presets
  - simple-launcher-processes
sourceDate: 2026-03-25
lang: en
translationKey: simple-launcher
sourceHash: ed39a4ee9de7f8e5349c78f15777294027a4628efeb0b6f20f285fba2f27cf08
translationStatus: translated
generatedBodyHash: e2e9789ac982468bf3384de22fda18dc8d19a7ffd0447cf41bb2063953e78d85
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/listings/58d6403a-a2fe-4b49-9b27-536e12beace3
    - kind: docs
      href: /en/works/simple-launcher/docs/setup/
websiteCoverUrl: /media/covers/works/simple-launcher-20261101.webp
coverAlt: SimpleLauncher cover
---

## Overview

SimpleLauncher manages external programs through named presets in UE games. Projects configure launch commands, working directories, and execution modes for services or tools, then start, query, or stop processes by preset.

A preset can launch several instances. Each has its own ID, so game logic can track which process exited.

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

Default non-detached execution cleans up managed processes when the game exits. Detached execution allows external processes to remain alive. Let temporary tools close with the game, or detach a service that needs to run independently.

## Use cases

It suits starting local services with a game, invoking background processors during a workflow, or launching several similar instances in parallel for tests.

Exit notifications help determine whether an external task has ended. Failure retries or automatic restarts still need conditions and policies defined by project logic.

## How to use it

To start a local service with the game, create a `LocalServer` preset in Project Settings and enter its launch command and working directory. Leave detached mode off if the service should close with the game.

1. Call `StartProcess` from Blueprint or C++ with the preset name and keep the returned process ID.
2. Use `IsProcessRunning` to check that instance or `BindProcessExited` to listen for it exiting while the game is running.
3. To end that instance early, call `StopProcess` with the same ID. Cleanup when the game exits does not fire exit callbacks.

See [starting and managing processes](/en/works/simple-launcher/docs/processes/) for the full API walkthrough.

## Scope and limitations

The plugin launches and tracks processes it manages; it does not guarantee that a target program runs successfully or produces correct output.

Detached processes do not close automatically with the game, so configuration must establish who terminates them. Command lines and working directories must reference existing, accessible resources.

See the [usage guide](/en/works/simple-launcher/docs/presets/) for steps and parameters.

## Compatibility

- Unreal Engine 5.2–5.8
- Version 1.1.0 (Version 2)

## Supported Platforms

The plugin supports Windows, Linux, and macOS. It uses UE's `FPlatformProcess::CreateProc` under the hood, so any program the OS can execute can be launched — there are no file type restrictions.

## Contact and Support

For usage questions or collaboration, please visit the contact page.

- **Contact:** [Contact and collaboration](https://mzsh.me/contact/)
