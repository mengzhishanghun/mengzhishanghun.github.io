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
sourceHash: c26c1fbdbe022ba52ea24fce0bb3409d1c9eaf9e82db0f7d58739527a2c56ac3
translationStatus: translated
generatedBodyHash: b70b04158248b0e93396c684ae1011e8baac991267cfae1258b4c1cdc467c3a3
docPage:
  work: simple-byte-conversion
  group: getting-started
  slug: setup
  order: 1
---

## Installation and Activation

Copy the plugin folder into your project's `Plugins` directory and restart the editor.

Once the plugin is enabled, its Blueprint nodes are available without managing a subsystem or the plugin lifecycle.

## Blueprint Node Category

The graph shows the conversion nodes in pairs. Pick the data type, connect the `Bytes` output to the matching decoder, and check the recovered value before wiring it into transport or storage.

All nodes are under the `SimpleByteConversion` category:

-   **Basic types**: Search for `IntToBytes`, `FloatToBytes`, etc.
-   **Structs**: Search for `StructToBytes`, `StructToJsonString`, etc.

- All nodes are `BlueprintPure` — no execution pins required
- Easily compose them for networking, file access, or custom protocols

![](/media-occurrence/doc%3Asimple-byte-conversion%3Asetup%3Amedia%3A1)
