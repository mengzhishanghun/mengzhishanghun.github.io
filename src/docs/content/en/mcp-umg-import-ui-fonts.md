---
title: Import UI Fonts
type: doc
slug: mcp-umg-import-ui-fonts
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-umg
documentKind: product-manual
websiteRoute: /en/works/mcp-umg/docs/import-ui-fonts/
lang: en
translationKey: doc:mcp-umg:import-ui-fonts
sourceHash: d64beb06b02a22305b09cc48f8f4b0306e477530e4e8be8954741da506eb0d77
translationStatus: translated
generatedBodyHash: 6c75e5492da6fed36c46a365bf65ca476c60e9b1cc5cdfce902bb5706c381e77
docPage:
  work: mcp-umg
  group: features
  slug: import-ui-fonts
  order: 9
---

## Import a FontFace and UFont

Start with a local font file and an unused `/Game` destination. After importing it, use the returned font asset path to set the font on a text widget. Save both imported assets if you want to keep using the font after reopening the project.

`ImportUIFont` imports one local `.ttf`/`.otf` as a new `/Game` FontFace and creates a matching UFont with the `_Font` suffix. The UFont's default typeface keeps a reference to that FontFace. The tool returns `FontFacePath` and `FontPath`; use the latter for `Text.font`. `SourceFile` and `AssetPath` are required; the source file limit is 64 MiB. The request is rejected if either target package already exists, is loaded as a non-empty package, or exists on disk, preventing overwrites or unintended saves. `bSave` must be a boolean and defaults to `false`; when true, it saves exactly those two packages. After a default import, use `SaveUIAsset` separately with each FontFace/UFont path to save one package at a time. The tool uses `UFontFileImportFactory`, available in UE 5.2 through 5.8 (its base-class `FactoryCreateFile` ultimately invokes FontFace's native binary factory).
