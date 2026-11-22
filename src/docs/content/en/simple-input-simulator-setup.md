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
sourceHash: 2d03d066e2632911cc41991f93340da578a081b46de39423f7cf53a73229658e
translationStatus: translated
generatedBodyHash: cfbaab147bebe6f17a3725fbd8f58afcdad88896c13a6a092da9fe218970b4a8
docPage:
  work: simple-input-simulator
  group: setup
  slug: setup
  order: 1
---

## Install the Plugin

Copy the plugin folder into the project's `Plugins` directory and restart the editor.

## Use in Blueprints

After enabling the plugin, add nodes from the **Simple Input Simulator** category in Blueprint. Each call returns a `bool` for success or failure. Select a valid `PlayerController` with `PlayerIndex`; `0` targets the first local player. The nodes are marked `CallInEditor = true`, and editor calls still require a valid controller. For troubleshooting, filter the Output Log by `LogSimpleInputSimulator`.

## Available Nodes

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

The plugin works at the raw input level, so both input systems receive simulated events automatically.

Simulated events are injected through `PlayerController::InputKey`.

## Interface Language

Open **Edit → Project Settings**, select the SimpleInputSimulator settings page, and set **Language** to **English** or **Chinese**. English is the default. Available user-facing UI, tooltips, notifications, and functional logs update immediately without restarting the editor. Public API names and module startup/shutdown logs remain in English.
