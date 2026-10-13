---
title: Flying Car Simulator
description: A flying car simulation system for future mobility.
type: case
slug: flying-car-simulator
categoryId: ue-projects
categoryName: Unreal Engine Projects
categoryOrder: 0
status: Archived
featured: false
draft: false
sitePublish: true
tags:
  - Simulation
  - Transportation
coverAlt: Flowchart of the flying car simulator
websiteCoverUrl: /assets/cases/flying-car-simulator.png
lang: en
translationKey: flying-car-simulator
sourceHash: 25d0529bd432b147e2002e2f426e4650c94166f3742ad8a5a4f93164f7311d91
translationStatus: translated
generatedBodyHash: 4c5dee892bf990c890c8422b36b389fdfbe0bab899111ba48efacfb2fed37566
---

## Background

I worked on a flying car simulation project that needed to support both ground driving and flight, with cockpit interaction and HUD instruments presenting vehicle information.

This case records the project's simulation and interaction approach. Dual-mode control, flight attitude, and instrument displays together formed the experience; a single driving mode would not describe the full scenario.

## Reproduction Environment

The project used Unreal Engine to build a flying car simulation scene, including cockpit interaction and a HUD instrument system. A physical model drove flight attitude and dynamics simulation.

The cockpit and HUD supported operation and information display, while the physical simulation handled motion in flight.

## Specific Problem

The scene needed to present both ground driving and flight and support switching between them. Changes in control state also needed to be reflected in flight attitude and cockpit information within the same simulation experience.

This made the work span control, physical simulation, and interface presentation. A HUD alone or control for a single mode would not cover the requirements.

## Solution

Dual-mode switching controls were established around flight and ground driving, bringing both states into the same scene.

In flight, a physical model drove attitude and dynamics simulation. Cockpit interaction and HUD instruments provided operation entry points and information displays, giving control and state presentation corresponding interfaces.

## Final Summary

The project organized its simulation system around dual-mode control, physical simulation, and cockpit interaction, allowing ground driving and flight to be presented within one experience.
