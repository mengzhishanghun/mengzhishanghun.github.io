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
sourceHash: a829c210d320c65c6c6cf89c0440c2becda7620cc71283164c64e9f561e5069b
translationStatus: translated
generatedBodyHash: f0032613f82ca131eceb38e518b189308fc845102b08b178f56f06835f0e9a9c
docPage:
  work: mcp-umg
  group: component-reuse
  slug: component-extraction
  order: 2
---

## Copy a subtree or replace it with an instance

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

Start with `dryRun:true` to inspect `WouldChange`, `Dependencies` and any `PreflightError`; after checking, set it to `false` to create the component. The new Blueprint compiles in memory but is not automatically saved. If the source location was replaced, save the source Blueprint too. Call `SaveWidgetBlueprint` for each path separately.

The tool does not transfer the source page's business graphs into the component.
