---
title: MCPUMG
description: Let AI create and edit Unreal Engine UMG interfaces through MCP, including widget trees, layouts, styles, animations, asset imports, and screenshots.
type: work
slug: mcp-umg
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
order: 23
workInfo:
  channels:
    - kind: docs
      href: /en/works/mcp-umg/docs/connect/
featured: false
draft: false
sitePublish: true
tags:
  - Widget trees, properties and animations
  - MCP series
lang: en
translationKey: mcp-umg
sourceHash: fcd3bd1dbc3521977aba45a97c33f2f1d0f56899bf1fa685bae84382c66be377
generatedBodyHash: 6acb0f689982ac2e8aa6b37197cba1a505518ad080d01acd3a05b7ed619cbc1d
translationStatus: translated
coverAlt: MCPUMG cover
websiteCoverUrl: /media/covers/works/mcp-umg-20261101.webp
docIds:
  - mcp-umg-connect
  - mcp-umg-layout
  - mcp-umg-image-to-umg
  - mcp-umg-layout-inspection
  - mcp-umg-batch-migration
  - mcp-umg-components-styles
  - mcp-umg-component-extraction
  - mcp-umg-widget-styles
  - mcp-umg-widget-themes
  - mcp-umg-import-ui-fonts
  - mcp-umg-events-navigation-animation
  - mcp-umg-navigation
  - mcp-umg-animation
  - mcp-umg-commonui
  - mcp-umg-mvvm
  - mcp-umg-preview-runtime
  - mcp-umg-runtime-diagnostics
  - mcp-umg-widget-performance
---

## About this work

MCPUMG is a UMG editing plugin for Unreal Editor. MCP-compatible AI clients can read and edit Widget Blueprints, including widget trees, properties, slots, styles, animations, and events. They can also import UI assets, capture interfaces, and inspect running widgets where the engine version supports it.

The demonstration video and screenshots show a UMG interface built by AI through MCPUMG. Blueprint logic was arranged through MCPBlueprint, and GPT generated the artwork. The media shows actual results in Unreal Engine.

## Features

### Build interfaces and reuse widgets

Find widgets in the tree and edit their hierarchy, properties, and slot layout. Extract a repeated subtree as a standalone component, or use a Named Slot to swap content in an existing component instance. Styles, themes, and fonts have their own tools. Style edits depend on the properties each widget supports. [Widget trees](/en/works/mcp-umg/docs/layout/) · [Component extraction](/en/works/mcp-umg/docs/component-extraction/) · [Named Slots](/en/works/mcp-umg/docs/components-styles/) · [Styles](/en/works/mcp-umg/docs/widget-styles/) · [Themes](/en/works/mcp-umg/docs/widget-themes/) · [Fonts](/en/works/mcp-umg/docs/import-ui-fonts/)

### Set up interactions, navigation, and animations

Configure widget events and focus navigation or edit animation sections and keyframes. CommonUI and MVVM have separate availability checks. Confirm that the target editor has the framework and tools you need before configuring it. [Events](/en/works/mcp-umg/docs/events-navigation-animation/) · [Focus navigation](/en/works/mcp-umg/docs/navigation/) · [Animations](/en/works/mcp-umg/docs/animation/) · [CommonUI](/en/works/mcp-umg/docs/commonui/) · [MVVM](/en/works/mcp-umg/docs/mvvm/)

### Preview and diagnose widgets

Preview different states and sizes, or inspect PIE instances for clipping and hit test issues. Design data and dry runs can check structure and properties; they cannot confirm actual Slate layout. Hit test diagnostics use cached data and do not send clicks. Design complexity checks, runtime measurements, and traces each cover a different part of performance analysis. [Previews](/en/works/mcp-umg/docs/preview-runtime/) · [Layout and hit testing](/en/works/mcp-umg/docs/layout-inspection/) · [Runtime instances](/en/works/mcp-umg/docs/runtime-diagnostics/) · [Performance](/en/works/mcp-umg/docs/widget-performance/)

## Workflow

To build a page from a reference image, follow the [connection guide](/en/works/mcp-umg/docs/connect/) and confirm the target project and tool version. The AI client interprets the image and produces a Widget Spec. The plugin does not call an image model. Validate the spec first, then build and inspect the actual preview. If you need to confirm clipping or interaction behavior, check a running instance. Once you have reviewed the changes, call `SaveWidgetBlueprint` explicitly to keep them. [Build a UMG interface from a reference image](/en/works/mcp-umg/docs/image-to-umg/)

Before you [edit widget properties in batches](/en/works/mcp-umg/docs/batch-migration/), read each target’s fingerprint and preview the property changes. The tool records a separate undo transaction for each Widget Blueprint. If something fails, check the result for each package. The tool does not roll changes back across assets or compile or save them automatically.

## UE versions and scope

MCPUMG supports UE 5.2 through 5.8, with features varying by engine version. On UE 5.2 through 5.5, standalone Widget Blueprints with native parent classes that pass the safety checks support basic creation, widget tree editing, properties, layout, styles, animations, events, asset imports, saving, and screenshots. Inherited Blueprints, advanced tree patches, component extraction, multi-state previews, runtime control, and optional framework operations require UE 5.6 through 5.8.

The plugin is editor-only. It is not a runtime UI framework for games. Use the installation package that matches your engine, and check the installed version's tool list, parameters, and safety results. [MCPUMG user guide](/en/works/mcp-umg/docs/connect/)
