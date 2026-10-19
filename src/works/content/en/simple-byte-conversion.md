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
  - simple-byte-conversion-guide
sourceDate: 2026-03-25
lang: en
translationKey: simple-byte-conversion
sourceHash: 6830607d1e7ff65f08bbddf84b4c9dc5ef9c1ca4b51e2d2f3bc687e107f63355
translationStatus: translated
generatedBodyHash: 8509a63db5fc74d660d00f1f8ccd5b8ce745e4b6e3b2a3c0f63d483640cbcacf
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/zh-cn/listings/ee68b12e-30b4-4904-8f80-3cc43c1e6002
    - kind: docs
      href: /docs/zh/guides/ue-tools/simple-byte-conversion-guide/
  compatibility:
    - platforms:
        - Windows (Win64)
        - macOS
        - Linux
        - Android
        - iOS
      requirements:
        - UE 5.2–5.8
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

See the [usage guide](/en/docs/guides/ue-tools/simple-byte-conversion-guide/) for steps and parameters.
