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
sourceHash: 636116a461c5b2a7eed8ac2585008edb8dd037b767b971e965fa426866db9886
translationStatus: translated
generatedBodyHash: 1c163a77917ac75bdb2f96a0b4a67c5dea31938578282fdb097d73dbc9bd36f2
docPage:
  work: ue-quick-start
  group: features
  slug: normalize-line-endings
  order: 2
---

## When and which files the tool converts

LF (`\n`) or CR (`\r`) line endings in a shared project can cause MSVC build problems on Windows. Before building, the tool scans the directories below and changes the line endings of matching files to CRLF (`\r\n`) in place.

The scan covers:

- The project’s `Source/` and `ThirdParty/` directories.
- `Source/` and `ThirdParty/` directories found recursively under `Plugins/`.

It handles `.h`, `.c`, `.cpp`, `.cs`, and `.inl` files.
