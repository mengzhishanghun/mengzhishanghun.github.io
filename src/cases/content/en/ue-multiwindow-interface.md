---
title: Creating Independent Multiwindow Interfaces in UE
description: Host UMG in native Slate windows with lifecycle, position, size, visibility, and DPI controls.
type: case
slug: ue-multiwindow-interface
categoryId: ue-projects
categoryName: Unreal Engine Projects
categoryOrder: 0
status: Archived
featured: false
draft: false
sitePublish: true
tags:
  - UMG
  - Multiwindow
  - UI tools
lang: en
translationKey: ue-multiwindow-interface
sourceHash: 66d3fa160996ff9d7222ae838508aff34d054a59f37f3f5b6e183e15af0c22fa
translationStatus: translated
generatedBodyHash: d05fc35f06cebaf4ab53c4c7b36f50e613fe28acfde0a0d45a8152a1c089017c
---

## Controls outside the Main View

UE tools and simulations sometimes need an independent control panel so the controls do not occupy the main view. I implemented a MultiWindow tool that creates native Slate windows and hosts UMG inside them, allowing an existing interface to become a separate panel.

## Window Creation and Lifecycle

`CreateMultiWindow` creates a Slate window and connects UMG content. MultiWindowActor manages position, size, title, and visibility. It also provides maximize, minimize, close, and activation events, plus DPI handling.

These controls let the application open panels as needed, adjust layouts, and respond when a window closes or activates. UMG continues to organize interface content while window management is handled separately.

## Scope

This implementation targets independent tool windows and control panels. Multiple UI windows and multiple camera rendering require separate designs. A window that also displays an independent camera view needs further assessment of viewports, rendering, and resource costs.

Integration also needs checks of interaction behavior on the target platform, window-closing behavior, and DPI settings.

## Discuss Your Project

If a UE application needs separate parameter panels, debug windows, or operator interfaces, share the UI content, window relationships, and runtime environment. I can help connect UMG and handle window controls and events.

[Get in touch](/en/contact/) to discuss it.
