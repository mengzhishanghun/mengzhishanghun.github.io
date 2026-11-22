---
title: SimpleStaticMeshMerger
description: Preview and filter StaticMeshActor groups, then organize selected objects as ISM/HISM instances.
type: work
slug: simple-static-mesh-merger
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
order: 9
status: Official documentation
featured: false
draft: false
sitePublish: false
tags:
  - StaticMesh
  - Instancing
  - Simple series
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19204715
links:
  - label: Original article on CNBlogs
    href: https://www.cnblogs.com/mengzhishanghun/p/19204715
docIds:
  - simple-static-mesh-merger-setup
  - simple-static-mesh-merger-merge-actors
  - simple-static-mesh-merger-split-level-instance
sourceDate: 2025-11-09
lang: en
translationKey: simple-static-mesh-merger
sourceHash: 020d14241ec78e51248eab43fbcc90214188d683943b840f2dc99da5270752cc
translationStatus: translated
generatedBodyHash: 116803da1db0a90f89134b2a9cd8ed3104d319778771f00423a832fb22bfd845
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/zh-cn/listings/bc2a9439-c5d4-4815-9694-8920661f10b5
    - kind: docs
      href: /en/works/simple-static-mesh-merger/docs/setup/
  compatibility:
    - platforms:
        - Windows (Win64)
        - macOS
        - Linux
      requirements:
        - UE 5.2–5.8
websiteCoverUrl: /media/covers/works/simple-static-mesh-merger-20261101.webp
coverAlt: SimpleStaticMeshMerger cover
---

## Overview

SimpleStaticMeshMerger organizes repeated StaticMeshActors in levels. It first groups merge candidates by mesh, materials, mobility, and collision settings for preview and filtering, then organizes selected objects as ISM/HISM instances.

The process operates on actual level Actors, allowing grouping to be reviewed before scene modifications rather than replacing objects in bulk based only on mesh names.

## Background and goals

A scene may contain many individual Actors using the same model. Whether they can share an instance group also depends on material slots, mobility, and collision behavior. This tool presents those conditions together, helping level creators identify repeated objects to merge while allowing individual Actors to be excluded.

Assess instancing through loading and frame-rate measurements in the target project. Fewer objects do not imply performance improves by a fixed ratio.

## Core capabilities

### Handling nested scenes and refreshing previews

The tool supports recursively breaking apart nested LevelInstances and refreshing the merge preview of scene objects.

### Strict grouping and manual filtering

Objects are grouped by mesh, materials, mobility, and complete collision settings. Users can filter groups in the preview and exclude individual Actors that should not be merged.

### Creating instanced objects

Merging creates ISM/HISM Actors, copies relevant material, mobility, and collision settings, deletes participating original Actors, and selects the new objects for inspection.

Check the scene hierarchy and instance counts, then verify visuals and collision against expectations.

## Use cases

It suits levels with many repeated static meshes where users want to filter by actual properties before instancing. For objects with mixed materials or collision settings, preview grouping and individual exclusions make scope easier to inspect than processing solely by model name.

## Scope and limitations

Merging replaces original scene Actors. Keep a recoverable level version first and inspect materials, mobility, collision, and instance counts afterward.

Loading or runtime improvements depend on the scene and target device and require measurement. Group previews do not replace project acceptance checks after merging.

See the [user guide](/en/works/simple-static-mesh-merger/docs/merge-actors/) for scene grouping, merge steps, and loading overhead.

## Compatibility, Language, and Support

- Unreal Engine 5.2–5.8
- Version 1.1.0 (Version 2)

Open **Edit → Project Settings**, select the SimpleStaticMeshMerger settings page, and set **Language** to **English** or **Chinese**. English is the default. Available user-facing UI, tooltips, notifications, and functional logs update immediately without restarting the editor. Public API names and module startup/shutdown logs remain in English.

For usage questions or collaboration, please visit the contact page.

- **Contact:** [Contact and collaboration](https://mzsh.me/contact/)

## Documentation Source

The original article was published on [CNBlogs](https://www.cnblogs.com/mengzhishanghun/p/19204715) on 2025-11-09.
