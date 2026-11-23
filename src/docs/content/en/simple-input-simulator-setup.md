---
title: Install and Set Up
type: doc
slug: simple-input-simulator-setup
draft: false
sitePublish: true
tags:
  - Blueprints
  - Input simulation
workIds:
  - simple-input-simulator
documentKind: product-manual
websiteRoute: /en/works/simple-input-simulator/docs/setup/
lang: en
translationKey: doc:simple-input-simulator:setup
sourceHash: a5c711512362024c593cd644600d331d03ea7a6f7f132f8b35a6619f0167b8af
translationStatus: translated
generatedBodyHash: 89bd71ef4962539288aa1fbc93ae3ee44fb1b78fdb8ebf4b739b331df9a655bb
docPage:
  work: simple-input-simulator
  group: getting-started
  slug: setup
  order: 1
---

## Install the Plugin

Copy the plugin folder into the project's `Plugins` directory and restart the editor.

## Use in Blueprints

After enabling the plugin, add nodes from the **Simple Input Simulator** category in Blueprint. Each call returns a `bool` for success or failure. Select a valid `PlayerController` with `PlayerIndex`; `0` targets the first local player. The nodes are marked `CallInEditor = true`, and editor calls still require a valid controller. For troubleshooting, filter the Output Log by `LogSimpleInputSimulator`.

## Available Nodes

The top row shows the key and axis inputs and their return values. The node at the bottom left clears pressed keys.

![](/media-occurrence/doc%3Asimple-input-simulator%3Asetup%3Amedia%3A1)

| Node | Function |
| --- | --- |
| **Simulate Key Input** | Simulate pressing/releasing any key (keyboard, mouse, gamepad buttons) |
| **Simulate Axis Input** | Simulate axis input such as joystick movement or mouse motion |
| **Flush Pressed Keys** | Clear all pressed states with one call |

## Input System Compatibility

| Input System     | Compatibility                                  |
|-----------------|------------------------------------------------|
| Legacy Input     | ✅ Full support                                |
| Enhanced Input   | ✅ Full support - triggers Input Actions automatically |

Both input systems receive simulated events at the raw input layer. If the call succeeds but the game action does not fire, check the target player’s input bindings.

Simulated events are injected through `PlayerController::InputKey`.

## Interface Language

Open **Edit → Project Settings**, select the SimpleInputSimulator settings page, and set **Language** to **English** or **Chinese**. English is the default. Available user-facing UI, tooltips, notifications, and functional logs update immediately without restarting the editor. Public API names and module startup/shutdown logs remain in English.
