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
sourceHash: cae05658bf155500f73c129c21ea3223b7fb070192e50782fceb756a0c17d5bb
translationStatus: translated
generatedBodyHash: 66f89e8450a352552120e23ad4c568ebcdad89af0658f5e669e31866c207d365
docPage:
  work: mcp-umg
  group: styling-themes
  slug: import-ui-fonts
  order: 3
---

## Import a FontFace and UFont

`ImportUIFont` imports one local `.ttf`/`.otf` as a new `/Game` FontFace and creates a matching UFont with the `_Font` suffix. The UFont's default typeface persistently references that FontFace. The result includes `FontFacePath` and `FontPath`, which can be used directly as `Text.font`. `SourceFile` and `AssetPath` are required; the source file limit is 64 MiB. The request is rejected if either target package already exists, is loaded as a non-empty package, or exists on disk, preventing overwrites or unintended saves. `bSave` must be a boolean and defaults to `false`; when true, it saves exactly those two packages. After a default import, use `SaveUIAsset` separately with each FontFace/UFont path to save one package at a time. The tool uses `UFontFileImportFactory`, available in UE 5.2 through 5.8 (its base-class `FactoryCreateFile` ultimately invokes FontFace's native binary factory).
