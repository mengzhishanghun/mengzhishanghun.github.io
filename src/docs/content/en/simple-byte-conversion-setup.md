---
title: Install the Plugin and Find Nodes
type: doc
slug: simple-byte-conversion-setup
draft: false
sitePublish: true
tags:
  - Blueprints
  - Serialization
workIds:
  - simple-byte-conversion
documentKind: product-manual
websiteRoute: /en/works/simple-byte-conversion/docs/setup/
lang: en
translationKey: doc:simple-byte-conversion:setup
sourceHash: 85468896b535b89738348c426084103483cf0aa605443a33a9a7c3e0b5181521
translationStatus: translated
generatedBodyHash: 12faf18da4f892e0c1ab11836413f8d678f5124f467c292cf5a0cb55d49ef798
docPage:
  work: simple-byte-conversion
  group: setup
  slug: setup
  order: 1
---

## Installation and Activation

Copy the plugin folder into your project's `Plugins` directory and restart the editor.

Once enabled, the plugin is ready to use. You do not need to manage a subsystem or the plugin lifecycle.

## Blueprint Node Category

All nodes are under the `SimpleByteConversion` category:

-   **Basic types**: Search for `IntToBytes`, `FloatToBytes`, etc.
-   **Structs**: Search for `StructToBytes`, `StructToJsonString`, etc.

- All nodes are `BlueprintPure` — no execution pins required
- Easily compose them for networking, file access, or custom protocols

![](/media-occurrence/doc%3Asimple-byte-conversion%3Asetup%3Amedia%3A1)
