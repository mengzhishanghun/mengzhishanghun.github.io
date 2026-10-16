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
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19204715
links:
  - label: Original article on CNBlogs
    href: https://www.cnblogs.com/mengzhishanghun/p/19204715
docIds:
  - simple-static-mesh-merger-guide
sourceDate: 2025-11-09
lang: en
translationKey: simple-static-mesh-merger
sourceHash: 278b4241c7cc4e36635485c6286145888e8b8eff1ce4b01bb3ff35be07079c88
translationStatus: translated
generatedBodyHash: 22d401c8753e37870aae685340fc9636b505334090bbf9ff793b556aa4d1db8b
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/zh-cn/listings/bc2a9439-c5d4-4815-9694-8920661f10b5
    - kind: docs
      href: /docs/zh/guides/ue-tools/simple-static-mesh-merger-guide/
  compatibility:
    - platforms: []
      requirements:
        - UE 5.2–5.8
---
## Overview

SimpleStaticMeshMerger organizes repeated StaticMeshActors in levels. It first groups merge candidates by mesh, materials, mobility, and collision settings for preview and filtering, then organizes selected objects as ISM/HISM instances.

The process operates on actual level Actors, allowing grouping to be reviewed before scene modifications rather than replacing objects in bulk based only on mesh names.

## Background and goals

A scene may contain many individual Actors using the same model. Whether they can share an instance group also depends on material slots, mobility, and collision behavior. This tool presents those conditions together, helping level creators identify repeated objects to merge while allowing individual Actors to be excluded.

Assess instancing through loading and frame-rate measurements in the target project. Fewer objects do not imply performance improves by a fixed ratio.

## Core capabilities

### Handling nested scenes and refreshing previews

The tool can recursively process nested LevelInstances. It refreshes the merge preview afterward so subsequent grouping uses the expanded scene objects. Users can review which Actors actually participate.

### Strict grouping and manual filtering

Grouping compares Mesh, Static/Stationary/Movable mobility, every material slot, and collision Profile, ObjectType, and channel responses. Previews can be filtered by mobility and minimum instance count. After selecting a group, users can uncheck Actors that should not be merged.

These filters define the current operation's scope; participation of every group member is not mandatory.

### Creating instanced objects

Merging creates ISM/HISM Actors, copies relevant material, mobility, and collision settings, deletes participating original Actors, and selects the new objects for inspection.

Check the scene hierarchy and instance counts, then verify visuals and collision against expectations.

## Use cases

It suits levels with many repeated static meshes where users want to filter by actual properties before instancing. For objects with mixed materials or collision settings, preview grouping and individual exclusions make scope easier to inspect than processing solely by model name.

## Scope and limitations

Merging replaces original scene Actors. Keep a recoverable level version first and inspect materials, mobility, collision, and instance counts afterward.

Loading or runtime improvements depend on the scene and target device and require measurement. Group previews do not replace project acceptance checks after merging.
