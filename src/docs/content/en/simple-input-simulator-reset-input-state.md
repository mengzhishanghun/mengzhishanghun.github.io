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
sourceHash: 32f3785c94b791b10b24bf3c3a145457322228ab6b2b0574ff8b4f58795b507e
translationStatus: translated
generatedBodyHash: 24b0dea9affaf7e1273f39faa70d66cc2450aaabcc2a619875c0a41d23c7358b
docPage:
  work: simple-input-simulator
  group: features
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

Send press and release events to the same player index. When a test, demonstration, or replay ends or is interrupted, call `FlushPressedKeys` to clear any remaining pressed keys on that player’s controller. In local multiplayer, check which player you are clearing.
