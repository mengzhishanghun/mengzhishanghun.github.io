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
  - simple-input-simulator-setup
  - simple-input-simulator-key-input
  - simple-input-simulator-axis-input
  - simple-input-simulator-reset-input-state
sourceDate: 2026-03-25
lang: en
translationKey: simple-input-simulator
sourceHash: ee4e2f99056c7a240b7a49d1b64098551675da3b411035992e425bba7231b665
translationStatus: translated
generatedBodyHash: 981cb3218ae498d853ee74242c9404252ca47746ab6611f1cfef2c1ea9ebd1d4
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/listings/dd1ee0a8-f450-4a3d-adc4-4a96f5dec3dd
    - kind: docs
      href: /en/works/simple-input-simulator/docs/setup/
websiteCoverUrl: /media/covers/works/simple-input-simulator-20261101.webp
coverAlt: SimpleInputSimulator cover
---

## Overview

SimpleInputSimulator provides key and axis input simulation nodes for UE Blueprints, allowing game logic to receive specified actions through its existing input pipeline.

It simulates pressing and releasing keyboard keys, mouse buttons, and gamepad buttons, as well as axis input from a mouse or joystick. You can clear held keys when a test ends.

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

Use `Flush Pressed Keys` to clear held keys after a test, demo, or replay.

## Use cases

It suits repeated movement or jumping in smoke tests and driving existing character inputs in tutorials or exhibition demonstrations. It can also replay events with a project's own recording system or target a second player in local multiplayer tests.

Recording, timing, and complete test assertions must be provided by higher-level logic.

## How to use it

1. After [installing the plugin](/en/works/simple-input-simulator/docs/setup/), find the nodes in the **Simple Input Simulator** Blueprint category. Make sure the target player has a valid `PlayerController`. A `PlayerIndex` of `0` selects the first local player.
2. To test forward movement, bind `W` to moving forward in the project. Call `Simulate Key Input` for `W` with `Pressed` set to `true`, wait one second, then call it again with `false` to release the key.
3. For joystick or mouse movement, use [Simulate Axis Input](/en/works/simple-input-simulator/docs/axis-input/). [Clear held keys](/en/works/simple-input-simulator/docs/reset-input-state/) after the test.

![](/media-occurrence/work%3Asimple-input-simulator%3Amedia%3A1)

## Scope and limitations

The plugin simulates input events without guaranteeing that the intended action occurs. Character state, input mappings, and the current game phase still affect results.

Pair press and release events and clear state when tests finish. Input cannot be injected as intended without a valid PlayerController, so automation should check that prerequisite.

See the [usage guide](/en/works/simple-input-simulator/docs/key-input/) for steps and parameters.

## Contact and Support

For usage questions or collaboration, please visit the contact page.

- **Contact:** [Contact and collaboration](https://mzsh.me/contact/)

## Original Article

Originally published on 2026-03-25 on [Cnblogs](https://www.cnblogs.com/mengzhishanghun/p/19770939).

## Compatibility

Supports Unreal Engine 5.2–5.8.
