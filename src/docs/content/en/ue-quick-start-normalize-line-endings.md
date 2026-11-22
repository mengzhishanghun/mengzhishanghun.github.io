---
title: Normalize Source Line Endings Before Building
type: doc
slug: ue-quick-start-normalize-line-endings
draft: false
sitePublish: true
tags:
  - UnrealEngine
  - Compilation
  - Launch tools
workIds:
  - ue-quick-start
documentKind: product-manual
websiteRoute: /en/works/ue-quick-start/docs/normalize-line-endings/
lang: en
translationKey: doc:ue-quick-start:normalize-line-endings
sourceHash: 386d0e6c2f5f545fe1a45b0a829bc4d057101a5df0d87ae22dd80ebfdec2250b
translationStatus: translated
generatedBodyHash: cad3a6d1e19e0e380199bfad7a4f315f0df5a86566c8225b433ec5ba137fcf18
docPage:
  work: ue-quick-start
  group: build
  slug: normalize-line-endings
  order: 2
---

## When and which files the tool converts

LF (`\n`) or CR (`\r`) line endings in a shared project can cause MSVC build problems on Windows. Before building, the tool scans matching source files and rewrites their line endings as CRLF (`\r\n`). No manual conversion is needed.

The scan covers:

- The project’s `Source/` and `ThirdParty/` directories.
- `Source/` and `ThirdParty/` directories found recursively under `Plugins/`.

It handles `.h`, `.c`, `.cpp`, `.cs`, and `.inl` files.
