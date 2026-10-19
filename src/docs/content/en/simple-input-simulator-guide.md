---
title: SimpleInputSimulator User Guide
description: Complete product user guide for SimpleInputSimulator
type: doc
slug: simple-input-simulator-guide
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
draft: false
sitePublish: true
tags:
  - Blueprints
  - Input simulation
workIds:
  - simple-input-simulator
documentKind: product-manual
websiteRoute: /docs/zh/guides/ue-tools/simple-input-simulator-guide/
lang: en
translationKey: simple-input-simulator-guide
supplementSources:
  - docs/content/en/supplements/simple-input-simulator-guide-1.md
sourceHash: 0ac64677217373cd56e837ca7d136f43defd3637d0e9075e855afb93ed78a8ee
translationStatus: translated
generatedBodyHash: cf1e62cbc6255aa6340f2e026dfa24e95ac73abd557080840dfc1ce0cf57089d
---

# 📘 Simple Input Simulator Plugin Tutorial (Blueprint Edition)

**Supported Unreal Engine Versions**: 5.2–5.8

**Simple Input Simulator** is a lightweight input simulation plugin for Unreal Engine.
It provides **three Blueprint functions** to simulate keyboard, mouse, and gamepad inputs programmatically.

---

## 🔧 Plugin Usage

The plugin works immediately after enabling.
All functions are available in the **Simple Input Simulator** category in Blueprint.

---

## 🧠 Blueprint Node Interface

![](/media-occurrence/doc%3Asimple-input-simulator-guide%3Amedia%3A1)

### 🎮 Key Input Simulation

| Node                | Description                                    |
|--------------------|------------------------------------------------|
| `Simulate Key Input` | Simulate press/release events for any input key |

**Parameters:**
- **Key**: UE FKey input key to simulate (Space Bar, Left Mouse Button, Gamepad buttons, etc.)
- **Pressed**: `true` for press, `false` for release
- **Player Index**: Target player controller (0 = first player)

![](/media-occurrence/doc%3Asimple-input-simulator-guide%3Amedia%3A2)

### 🕹️ Axis Input Simulation

| Node                 | Description                                    |
|---------------------|------------------------------------------------|
| `Simulate Axis Input` | Simulate analog input values (movement, mouse delta, gamepad sticks) |

**Parameters:**
- **Key**: Axis input key (Mouse X/Y, Gamepad Left Thumbstick X/Y, etc.)
- **Axis Value**: 3D vector for input values (typically use X component)
- **Player Index**: Target player controller (0 = first player)

![](/media-occurrence/doc%3Asimple-input-simulator-guide%3Amedia%3A3)

### 🧹 Input State Management

| Node               | Description                          |
|-------------------|--------------------------------------|
| `Flush Pressed Keys` | Clear all pressed keys and reset input state |

**Parameters:**
- **Player Index**: Target player controller (0 = first player)

---

## 🔁 Enhanced Input Compatibility

| Input System     | Compatibility                                  |
|-----------------|------------------------------------------------|
| Legacy Input     | ✅ Full support                                |
| Enhanced Input   | ✅ Full support - triggers Input Actions automatically |

The plugin works at the raw input level, so both input systems receive simulated events automatically.

---

## 🧪 Blueprint Examples (Images)

### Key Input Example
![](/media-occurrence/doc%3Asimple-input-simulator-guide%3Amedia%3A4)

Simulate pressing Space Bar for Player 0.

### Axis Input Example
![](/media-occurrence/doc%3Asimple-input-simulator-guide%3Amedia%3A5)

Simulate mouse movement or gamepad stick input.

---

## ✅ Tips & Notes

- All functions return `bool` indicating success/failure
- Player Index 0 targets the first player controller
- Pair press events with releases. After a test, demonstration, or replay, use Flush Pressed Keys to clear remaining state and prevent stuck keys
- Nodes can also be called in the editor, but require a valid PlayerController; without one, input cannot be injected as intended
- Axis inputs automatically adapt to current frame rate
- Check Output Log for detailed simulation messages (LogSimpleInputSimulator)

---

## Version History


Open **Edit → Project Settings**, select the SimpleInputSimulator settings page, and set **Language** to **English** or **Chinese**. English is the default. Available user-facing UI, tooltips, notifications, and functional logs update immediately without restarting the editor. Public API names and module startup/shutdown logs remain in English.

## Support

For usage questions or collaboration, please visit the contact page.

- **Contact:** [Contact and collaboration](https://mzsh.me/contact/)
