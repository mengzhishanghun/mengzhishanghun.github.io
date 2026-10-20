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
sourceHash: 59f5eca29148175c38eda51af2da2a0c2c2f5b63148f853cbe4bf059e323704a
translationStatus: translated
generatedBodyHash: 427ac903024c41f48e31b9d5face3962a31d03d2e255571d87712f27a0e7ef9c
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


The project organized its simulation system around dual-mode control, physical simulation, and cockpit interaction, allowing ground driving and flight to be presented within one experience.

## Discuss your project

If your UE simulation needs both ground driving and flight controls, or additional cockpit interactions and HUD instruments, I can help define the control states and displayed information, then integrate the simulation logic.

Describe the existing physical model, input devices, and intended experience so we can establish the development scope.

If you have a related project, [get in touch](https://mzsh.me/en/contact/) to discuss it.
