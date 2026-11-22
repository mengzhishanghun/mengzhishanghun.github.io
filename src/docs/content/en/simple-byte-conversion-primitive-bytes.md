---
title: Convert Primitive Types to and from Bytes
type: doc
slug: simple-byte-conversion-primitive-bytes
draft: false
sitePublish: true
tags:
  - Blueprints
  - Serialization
workIds:
  - simple-byte-conversion
documentKind: product-manual
websiteRoute: /en/works/simple-byte-conversion/docs/primitive-bytes/
lang: en
translationKey: doc:simple-byte-conversion:primitive-bytes
sourceHash: 9b434cdfbe283534a7d96d71cab017192b2900142d3df8a4f9de0afe8932ddbd
translationStatus: translated
generatedBodyHash: d629e4e059d429d3b5a4265da3ec4db1899fa2baafec7c5056b7af12969ccfbf
docPage:
  work: simple-byte-conversion
  group: conversion
  slug: primitive-bytes
  order: 1
---

## Supported Types and Nodes

Basic types provide two-way **ToBytes** and **FromBytes** conversion:

| Type | To bytes | Restore from bytes |
| --- | --- | --- |
| int32 | `IntToBytes` | `BytesToInt` |
| int64 | `Int64ToBytes` | `BytesToInt64` |
| float | `FloatToBytes` | `BytesToFloat` |
| double | `DoubleToBytes` | `BytesToDouble` |
| bool | `BoolToBytes` | `BytesToBool` |
| FString | `StringToBytes` | `BytesToString` |

All nodes are `BlueprintPure` and can be used directly as pure Blueprint functions without execution pins.

Use these nodes for custom protocols, lightweight storage, and binary communication. The C++ snippet below illustrates how the conversion works.

## Blueprint Conversion Example

![](/media-occurrence/doc%3Asimple-byte-conversion%3Aprimitive-bytes%3Amedia%3A1)

![](/media-occurrence/doc%3Asimple-byte-conversion%3Aprimitive-bytes%3Amedia%3A2)

![](/media-occurrence/doc%3Asimple-byte-conversion%3Aprimitive-bytes%3Amedia%3A3)

## Memory Layout, Byte Order, and UTF-8

This C++ example shows how to convert a primitive value:

```cpp
// 以 int32 为例，直接内存拷贝
void ByteConverter::IntToBytes(int32 Value, TArray<uint8>& OutBytes)
{
    OutBytes.SetNumUninitialized(sizeof(int32));
    FMemory::Memcpy(OutBytes.GetData(), &Value, sizeof(int32));
}
```

The example uses `FMemory::Memcpy` to copy a primitive value's memory representation. String conversion uses UTF-8 and handles the null terminator for use across platforms.

UTF-8 defines the text encoding. Both endpoints still need to agree on the length, whether it includes the terminator and how to represent empty strings. The receiver cannot assume that an arbitrary byte array contains a readable terminator. The `int32` example uses the host's representation and specifies no byte order for cross-platform use.
