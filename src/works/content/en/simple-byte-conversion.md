---
title: SimpleByteConversion
description: Convert between basic types, structs, byte arrays, and JSON strings.
type: work
slug: simple-byte-conversion
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
order: 1
status: Official documentation
featured: false
draft: false
sitePublish: false
tags:
  - Blueprints
  - Serialization
  - Simple series
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19770934
links:
  - label: Original article on CNBlogs
    href: https://www.cnblogs.com/mengzhishanghun/p/19770934
docIds:
  - simple-byte-conversion-setup
  - simple-byte-conversion-primitive-bytes
  - simple-byte-conversion-struct-and-json
sourceDate: 2026-03-25
lang: en
translationKey: simple-byte-conversion
sourceHash: b7b98a3aa0d9b18d824760ce72e2813ef196b71e3cb84dac20bd76003cd1082c
translationStatus: translated
generatedBodyHash: 15164b618df779f77f505667303379a64f936fc9f35e59e51f665d4c0832df6a
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/zh-cn/listings/ee68b12e-30b4-4904-8f80-3cc43c1e6002
    - kind: docs
      href: /en/works/simple-byte-conversion/docs/setup/
  compatibility:
    - platforms:
        - Windows (Win64)
        - macOS
        - Linux
        - Android
        - iOS
      requirements:
        - UE 5.2–5.8
websiteCoverUrl: /media/covers/works/simple-byte-conversion-20261101.webp
coverAlt: SimpleByteConversion cover
---

## Overview

SimpleByteConversion provides UE Blueprint interfaces for converting common data and structs to byte arrays, and converting structs to and from JSON strings.

Blueprint logic that needs network transfer, file storage, or data exchange with external programs can first obtain an explicit byte or text representation, then pass it to the appropriate communication or storage layer.

## Background and goals

Getting a sendable byte array directly from integers, floating-point values, or custom structs in Blueprints is inconvenient. Data from different sources may also use binary or JSON representations.

The work organizes these basic conversions into callable nodes, reducing repeated interface development across projects while keeping conversion separate from subsequent transmission and persistence.

## Core capabilities

### Basic types and byte arrays

Paired ToBytes / FromBytes interfaces are provided for int32, int64, float, double, bool, and FString. Basic numeric values are written using their memory representation; strings use UTF-8.

These interfaces can encode data before sending or restore data received in the same format.

### Binary struct conversion

StructToBytes and BytesToStruct handle custom structs. Blueprint interfaces accept different types through generic struct parameters, then output byte arrays or restore structs.

The struct type and field layout form a shared contract between both ends. A receiver cannot infer meaning from byte length alone.

### Struct and JSON conversion

StructToJsonString and JsonStringToStruct convert between structs and readable text.

JSON is better suited to field inspection or exchange with external programs such as Python. The work also handles conversion issues in field names and floating-point output so results are easier to identify and review.

## Use cases

It can prepare data for UDP/TCP communication in UE or convert structured state to bytes before file storage.

For external program integration, JSON can help verify fields. Network connections and file I/O in these examples must be supplied by other modules.

## Scope and limitations

The conversion interfaces do not define a cross-language protocol. Structs containing object references or resource handles are not supported.

Sender and receiver must agree on types, fields, encoding, and versions, and verify round trips using fixed examples. Check compatibility with old data after struct changes. Successfully calling a conversion node does not mean the data has been interpreted correctly.

See the [usage guide](/en/works/simple-byte-conversion/docs/primitive-bytes/) for steps and parameters.

## Compatibility, Language, and Support

Supports Unreal Engine 5.2–5.8.

Open **Edit → Project Settings**, go to SimpleByteConversion settings, and set **Language** to **English** or **Chinese**. English is the default. User-facing interfaces, prompts, notifications, and functional logs update immediately without restarting the editor; public API names and module startup/shutdown logs always remain in English.

For usage questions or collaboration inquiries, visit the contact page.

- **Contact:** [Contact and Collaboration](https://mzsh.me/contact/)

## Companion Plugins

For structured messages over TCP or UDP, use **SimpleTCPClient** or **SimpleUDP** alongside the conversion nodes.

## Documentation Source

The original article was published on [CNBlogs](https://www.cnblogs.com/mengzhishanghun/p/19770934) on 2026-03-25.
