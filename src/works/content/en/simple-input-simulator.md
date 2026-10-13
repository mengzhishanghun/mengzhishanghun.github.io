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
sourceHash: 1416b14681871a7870838ff13712ed9c1a1052df1ca53ccc8bd54848f03bbe8a
translationStatus: translated
generatedBodyHash: a7d7fc432e66300574f285b7e5dae6cba1c1218c900431f0ec211e686b9bdcbe
---

## Overview

SimpleInputSimulator provides key and axis input simulation nodes for UE Blueprints, allowing game logic to receive specified actions through its existing input pipeline.

It simulates press and release events for keyboard keys, mouse buttons, and gamepad buttons, as well as axis values such as mouse movement and joystick input. It also provides an action for clearing pressed states.

## Background and goals

Automated demonstrations, input debugging, and local multiplayer tests often require reproducing a sequence of actions. Calling character behavior directly may bypass the project's actual input bindings and controller logic.

The plugin injects events through PlayerController input interfaces so scripted actions follow normal input handling as closely as possible. Users organize input sequences themselves; the plugin supplies individual input and state management nodes.

## Core capabilities

### Simulating key events

Simulate Key Input accepts a UE FKey and handles press or release events for keyboard keys, mouse buttons, and gamepad buttons.

Users can construct explicit action sequences. Each pressed state needs a corresponding release event, otherwise later logic may continue treating the key as held.

### Axis input and player selection

Simulate Axis Input handles axes such as mouse movement and joysticks, obtaining the required DeltaTime. PlayerIndex selects a local player so simulated actions reach the corresponding PlayerController.

The nodes support Legacy Input and Enhanced Input, but the project still needs valid input mappings and controllers.

### State cleanup

Flush Pressed Keys clears lingering pressed states, restoring the input environment after a test, demonstration, or replay.

Nodes can be called in the editor to verify the input pipeline, but runtime requirements such as a valid PlayerController still apply.

## Use cases

It suits repeated movement or jumping in smoke tests and driving existing character inputs in tutorials or exhibition demonstrations. It can also replay events with a project's own recording system or target a second player in local multiplayer tests.

Recording, timing, and complete test assertions must be provided by higher-level logic.

## Scope and limitations

The plugin simulates input events without guaranteeing that the intended action occurs. Character state, input mappings, and the current game phase still affect results.

Pair press and release events and clear state when tests finish. Input cannot be injected as intended without a valid PlayerController, so automation should check that prerequisite.
