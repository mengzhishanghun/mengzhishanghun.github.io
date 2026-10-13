---
title: SimpleByteConversion User Guide
description: Conversion interfaces for basic types, structs, byte arrays, and JSON strings.
type: doc
slug: simple-byte-conversion-guide
categoryId: ue-tools
categoryName: UE Tools
categoryOrder: 0
order: 0
status: Official Documentation
date: 2026-03-25
draft: false
sitePublish: false
tags:
  - SimpleByteConversion
  - UE Tools
sourcePlatform: CNBlogs
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19770934
links:
  - label: Original CNBlogs article
    href: https://www.cnblogs.com/mengzhishanghun/p/19770934
workIds:
  - simple-byte-conversion
lang: en
translationKey: doc:simple-byte-conversion-guide:supplement:1
sourceHash: 36287edb8c6d8e301b2a2eb98a6a962d3ca8b65abaf14dd52c7b9c98c04076e3
translationStatus: translated
generatedBodyHash: 93cc7a987c6df152d62bca8d3edcf47652f91a5745a9ee898c0289f24460cd79
---

# SimpleByteConversion User Guide

## Basic Type Nodes

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

## Struct Nodes

- StructToBytes / BytesToStruct: Convert between structs and binary byte arrays.
- StructToJsonString / JsonStringToStruct: Convert between structs and JSON strings.

## Installation and Usage

### Step 1: Install the Plugin

Copy the plugin folder into your project's `Plugins` directory and restart the editor.

### Step 2: Use in Blueprints

All nodes are under the `SimpleByteConversion` category:

-   **Basic types**: Search for `IntToBytes`, `FloatToBytes`, etc.
-   **Structs**: Search for `StructToBytes`, `StructToJsonString`, etc.

### Step 3: Use in C++

In C++, call the `ByteConverter` utility class directly:

```cpp
#include "ByteConverter.h"

// 基础类型
TArray<uint8> Bytes;
ByteConverter::IntToBytes(42, Bytes);

// 结构体
FMyStruct Data;
ByteConverter::StructToBytes(&Data, FMyStruct::StaticStruct(), Bytes);

// JSON
FString JsonStr;
ByteConverter::StructToJsonString(&Data, FMyStruct::StaticStruct(), JsonStr);
```

## Call Examples

### Scenario 1: UDP/TCP Network Communication

Before sending over the network, encode the structured data as a byte array:

```
1. Define a struct (e.g. FPlayerState: position, health, state)
2. Use StructToBytes to convert the struct to TArray<uint8>
3. Send the byte array over UDP/TCP
4. Use BytesToStruct on the receiving end to restore the struct
```

### Scenario 2: Exchanging Data with Python

Use JSON for cross-language data exchange:

```
1. UE: StructToJsonString converts game data to a JSON string
2. Send it to the Python program over TCP/WebSocket
3. Python: parse directly with json.loads()
4. Reverse the process: Python json.dumps() → UE JsonStringToStruct
```

### Scenario 3: Data Persistence

Serialize game saves to binary files:

```
1. Convert the save struct to a byte array with StructToBytes
2. Write to disk with FFileHelper::SaveArrayToFile
3. Load the byte array with FFileHelper::LoadFileToArray when reading
4. Restore the save struct with BytesToStruct
```

## Usage Boundaries

Both ends must agree on fields, encoding, and data format. For cross-language interaction, check conversion results using a fixed dataset first.

---

Originally published on 2026-03-25 on [CNBlogs](https://www.cnblogs.com/mengzhishanghun/p/19770934).
