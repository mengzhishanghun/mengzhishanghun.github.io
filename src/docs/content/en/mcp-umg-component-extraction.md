---
title: Extract Reusable Widget Components
type: doc
slug: mcp-umg-component-extraction
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-umg
documentKind: product-manual
websiteRoute: /en/works/mcp-umg/docs/component-extraction/
lang: en
translationKey: doc:mcp-umg:component-extraction
sourceHash: 8ed01f4fd2e789cdd8ac7a8ebefa123b1caf12054018e07d800396b7c90fb844
translationStatus: translated
generatedBodyHash: c820f29dcb6c1e0455b54f57e9501f49d8f70993487530fa8cec5f6a35bd91d2
docPage:
  work: mcp-umg
  group: features
  slug: component-extraction
  order: 6
---

## Copy a subtree or replace it with an instance

Choose the root widget of the subtree you want to reuse and an unused asset path for the component. To try out the reusable component, start with a copy. Choose replacement when you also want the current page to use the component.

`ExtractWidgetComponent` extracts a specified WidgetTree subtree into a new `/Game` Widget Blueprint. The default `ReplaceSource:false` copies only and leaves the source unchanged. With `true`, one editor transaction replaces the original location with a new component instance. `InstanceName` can set the instance name, defaulting to the original widget name. The destination must be a new asset path; existing disk packages and non-empty in-memory packages are rejected.

Copying preserves native widget properties, ordinary `bIsVariable` flags, internal child hierarchy and native Slot properties. `DependencyMode` defaults to `Reject`. `MigrateSupported` can migrate NamedSlot content inside the subtree, plus animations whose bindings are all contained within it, whose tracks are property tracks only, and which have no dynamic binding functions. Dependencies such as cross-subtree animations, non-property tracks, graph references, inherited `BindWidget`/`BindWidgetOptional`, editor delegate bindings, default focus, UI Components and custom or cross-subtree navigation remain rejected.

```json
{
  "BlueprintPath": "/Game/UI/WBP_Menu",
  "WidgetName": "CardPanel",
  "AssetPath": "/Game/UI/WBP_Card",
  "dryRun": true
}
```

Start with `dryRun:true` to inspect `WouldChange`, `Dependencies` and any `PreflightError`; then set it to `false` to create the component. The new blueprint compiles in memory. Save it with `SaveWidgetBlueprint`. If you replaced the source widget, save the source blueprint separately using its own path.

The tool does not transfer the source page's business graphs into the component.
