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
  - en/supplements/simple-input-simulator-guide-1.md
sourceHash: f65749046c2d1717bea986413e7ad859aa633cdd88a7f2185631f3d8c8b4e8f1
translationStatus: translated
generatedBodyHash: c1c4cd945b1665fda504c46397d063f2dc7bf0347e9fdba3e07e5e7b71f72ba9
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
- **Key**: Input key to simulate (Space Bar, Left Mouse Button, Gamepad buttons, etc.)
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
- Use Flush Pressed Keys to prevent "stuck" key states
- Axis inputs automatically adapt to current frame rate
- Check Output Log for detailed simulation messages (LogSimpleInputSimulator)

---

## Version History


Open **Edit → Project Settings**, select the SimpleInputSimulator settings page, and set **Language** to **English** or **Chinese**. English is the default. Available user-facing UI, tooltips, notifications, and functional logs update immediately without restarting the editor. Public API names and module startup/shutdown logs remain in English.

## Support

For usage questions or collaboration, please visit the contact page.

- **Contact:** [Contact and collaboration](https://mzsh.me/contact/)
