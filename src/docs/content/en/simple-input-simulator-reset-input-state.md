---
title: Clear Simulated Input State
type: doc
slug: simple-input-simulator-reset-input-state
draft: false
sitePublish: true
tags:
  - Blueprints
  - Input simulation
workIds:
  - simple-input-simulator
documentKind: product-manual
websiteRoute: /en/works/simple-input-simulator/docs/reset-input-state/
lang: en
translationKey: doc:simple-input-simulator:reset-input-state
sourceHash: 8dd170faf4422d34522cd818b595933e65331e9c6483ad338189fc9b55131ee5
translationStatus: translated
generatedBodyHash: a69352c09f2a6f5fcd3933745713dee8574231d41f3b9f7215dd2d03471f95cc
docPage:
  work: simple-input-simulator
  group: input
  slug: reset-input-state
  order: 3
---

## Clear Pressed Input

| Node               | Description                          |
|-------------------|--------------------------------------|
| `Flush Pressed Keys` | Clear all pressed keys and reset input state |

**Parameters:**
- **Player Index**: Target player controller (0 = first player)

## Cleanup After Testing or Playback

Pair press events with releases. After testing, a demonstration, or playback, call `FlushPressedKeys` to clear any remaining pressed state for the target controller.
