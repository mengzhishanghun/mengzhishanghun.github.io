---
title: SimpleInputSimulator
description: Simulate key and axis input in Blueprints and clear lingering pressed-key states.
type: work
slug: simple-input-simulator
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
order: 6
status: Official documentation
featured: false
draft: false
sitePublish: false
tags:
  - Blueprints
  - Input simulation
  - Simple series
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19770939
links:
  - label: Original article on CNBlogs
    href: https://www.cnblogs.com/mengzhishanghun/p/19770939
docIds:
  - simple-input-simulator-guide
sourceDate: 2026-03-25
lang: en
translationKey: simple-input-simulator
sourceHash: 00cfd0e4fe06fef9768021fe84726cf13d7ba22a5be91ae8c04178982b6d2b7d
translationStatus: translated
generatedBodyHash: 61d277ca5f1212dc7184307fca9ccfe1b79d778006043767daeb7be4b42926cd
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/listings/dd1ee0a8-f450-4a3d-adc4-4a96f5dec3dd
    - kind: docs
      href: /docs/zh/guides/ue-tools/simple-input-simulator-guide/
  compatibility:
    - platforms:
        - Windows (Win64)
        - macOS
        - Linux
        - Android
        - iOS
      requirements:
        - UE 5.2–5.8
websiteCoverUrl: /assets/covers/simple-input-simulator.png
---

## Overview

SimpleInputSimulator provides key and axis input simulation nodes for UE Blueprints, allowing game logic to receive specified actions through its existing input pipeline.

It simulates press and release events for keyboard keys, mouse buttons, and gamepad buttons, as well as axis values such as mouse movement and joystick input. It also provides an action for clearing pressed states.

## Background and goals

Automated demonstrations, input debugging, and local multiplayer tests often require reproducing a sequence of actions. Calling character behavior directly may bypass the project's actual input bindings and controller logic.

The plugin injects events through PlayerController input interfaces so scripted actions follow normal input handling as closely as possible. Users organize input sequences themselves; the plugin supplies individual input and state management nodes.

## Core capabilities

### Simulating key events

Press and release events for keyboard keys, mouse buttons, and gamepad buttons can be used to organize repeated actions. Each press still needs a matching release to avoid leaving a key held.

### Axis input and player selection

The tool supports axis input such as mouse movement and joysticks, automatically obtains the required DeltaTime, and allows a local player to be selected.

The nodes support Legacy Input and Enhanced Input, but the project still needs valid input mappings and controllers.

### State cleanup

An action for clearing pressed states helps restore the input environment after a test, demonstration, or replay.

## Use cases

It suits repeated movement or jumping in smoke tests and driving existing character inputs in tutorials or exhibition demonstrations. It can also replay events with a project's own recording system or target a second player in local multiplayer tests.

Recording, timing, and complete test assertions must be provided by higher-level logic.

## Scope and limitations

The plugin simulates input events without guaranteeing that the intended action occurs. Character state, input mappings, and the current game phase still affect results.

Pair press and release events and clear state when tests finish. Input cannot be injected as intended without a valid PlayerController, so automation should check that prerequisite.

See the [usage guide](/en/docs/guides/ue-tools/simple-input-simulator-guide/) for steps and parameters.
