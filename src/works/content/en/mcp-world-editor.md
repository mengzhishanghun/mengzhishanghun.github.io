---
title: MCPWorldEditor
description: MCPWorldEditor is an Unreal Editor MCP plugin in development, providing tool interfaces for Actors, levels, terrain and viewports. Features and compatibility are still being verified.
type: work
slug: mcp-world-editor
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
order: 24
status: In development
workInfo:
  stage: developing
  channels:
    - kind: docs
      href: /en/works/mcp-world-editor/docs/connect/
featured: false
draft: false
sitePublish: true
tags:
  - Actors, levels, terrain and viewports
  - MCP series
lang: en
translationKey: mcp-world-editor
sourceHash: 62b1b60afffbecfb256d6941771a19a60a43f4d5d92987aee35df0199db87282
generatedBodyHash: 3ef36b95493dc861a062bf618c0f0acd00736ee3d3a1844793f88120189514ac
translationStatus: translated
coverAlt: MCPWorldEditor cover
websiteCoverUrl: /media/covers/works/mcp-world-editor-20261101.webp
docIds:
  - mcp-world-editor-connect
  - mcp-world-editor-maps
  - mcp-world-editor-save-level-packages
  - mcp-world-editor-navigation
  - mcp-world-editor-lighting-build
  - mcp-world-editor-world-settings
  - mcp-world-editor-actors
  - mcp-world-editor-foliage
  - mcp-world-editor-instanced-meshes
  - mcp-world-editor-actor-splines
  - mcp-world-editor-actor-hierarchy
  - mcp-world-editor-actor-components
  - mcp-world-editor-streaming-levels
  - mcp-world-editor-streamed-world
  - mcp-world-editor-world-partition-regions
  - mcp-world-editor-level-instances
  - mcp-world-editor-landscape
  - mcp-world-editor-landscape-paint-layers
  - mcp-world-editor-landscape-splines
  - mcp-world-editor-editor-viewport
  - mcp-world-editor-editor-pie
  - mcp-world-editor-viewport-statistics
  - mcp-world-editor-materials
---

## About this work

MCPWorldEditor is an Unreal Editor MCP plugin in development. External AI tools can use it to query and edit actors, levels, and terrain in the current world, and inspect the level editor viewport and PIE state. The available operations and diagnostics are still being tested and may change.

## Development direction

### Actors, components, and foliage

Identify an actor by path or another unique identifier before placing it, grouping it, changing its attachment, or adding a component. You can edit actor splines, convert supported instanced meshes, or query and edit instances in loaded foliage partitions. Foliage indices are valid only for the queried snapshot. [Actor placement](/en/works/mcp-world-editor/docs/actors/) · [Grouping and attachments](/en/works/mcp-world-editor/docs/actor-hierarchy/) · [Components](/en/works/mcp-world-editor/docs/actor-components/) · [Actor splines](/en/works/mcp-world-editor/docs/actor-splines/) · [Instanced meshes](/en/works/mcp-world-editor/docs/instanced-meshes/) · [Foliage](/en/works/mcp-world-editor/docs/foliage/)

### Level organization and map checks

Check the map, adjust World Settings, manage actors in streaming levels, work with World Partition Data Layers and loaded regions, or edit Level Instances. Navigation and lighting builds have separate previews. A path query against existing navigation data does not start a build. [Map checks](/en/works/mcp-world-editor/docs/maps/) · [World Settings](/en/works/mcp-world-editor/docs/world-settings/) · [Streaming levels](/en/works/mcp-world-editor/docs/streaming-levels/) · [Data Layers](/en/works/mcp-world-editor/docs/streamed-world/) · [Partition regions](/en/works/mcp-world-editor/docs/world-partition-regions/) · [Level Instances](/en/works/mcp-world-editor/docs/level-instances/) · [Navigation](/en/works/mcp-world-editor/docs/navigation/) · [Lighting](/en/works/mcp-world-editor/docs/lighting-build/)

### Terrain and viewports

Read or update Landscape heights or paint weights in bounded regions, and edit Landscape splines through their dedicated topology tools. Check the loaded area, target layers, and edit requirements before applying changes. Each write covers one region. Multiple writes cannot be rolled back as a single transaction. Capture the viewport to inspect the scene and check whether PIE is idle, queued to start, or playing. [Height data](/en/works/mcp-world-editor/docs/landscape/) · [Paint layers](/en/works/mcp-world-editor/docs/landscape-paint-layers/) · [Landscape splines](/en/works/mcp-world-editor/docs/landscape-splines/) · [Viewport capture](/en/works/mcp-world-editor/docs/editor-viewport/) · [PIE state](/en/works/mcp-world-editor/docs/editor-pie/)

## Workflow

To update a batch of foliage instances, follow the [connection guide](/en/works/mcp-world-editor/docs/connect/) and query the target partition and instances in the target editor. Preview the edit against the current snapshot before applying it. If the snapshot is stale, query and preview again. Check the result, select only the level packages with changes you want to keep, then preview and apply the save using the [package saving guide](/en/works/mcp-world-editor/docs/save-level-packages/). Saving writes to disk and cannot be undone in the editor. If saving an empty package may delete a file, explicitly allow that operation.

## Development status

Work on UE 5.2–5.8 is ongoing. Compatibility remains unconfirmed, and testing across those versions is incomplete. [MCPWorldEditor user guide](/en/works/mcp-world-editor/docs/connect/)

## Support

Send feedback to [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com).
