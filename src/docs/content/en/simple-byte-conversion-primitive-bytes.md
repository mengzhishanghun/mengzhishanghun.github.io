---
title: Convert Primitive Values and Byte Arrays
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
sourceHash: 2ed626d64f0254c15060eafc9695e02051d9230c82b0aaa78083a0c9ab312964
translationStatus: translated
generatedBodyHash: 374230310ca7f801c2cb95667c26ef4d4a0de06f356e004c7d8a56b897dd500e
docPage:
  work: simple-byte-conversion
  group: workflows
  slug: primitive-bytes
  order: 1
---

**Supported Unreal Engine versions**: 5.2–5.8

**SimpleByteConversion** is a lightweight byte-data conversion plugin for Unreal Engine's Blueprint system.  
It supports **two-way conversion between native types/structs and bytes/Json**, with every feature exposed as a Blueprint node.

---

## 🔧 Plugin Initialization

The plugin takes effect automatically after being enabled.  
All functionality is accessed through Blueprint nodes; no subsystem or plugin lifecycle management is needed.

---

## 🔣 Supported Type Conversions

### 📦 Native Types ↔ Byte Arrays

| Type | Conversion support |
|-------------|---------|
| `int32` | To/from bytes |
| `int64` | To/from bytes |
| `float` | To/from bytes |
| `double` | To/from bytes |
| `bool` | To/from bytes |
| `FString` | To/from bytes (UTF-8 encoding) |

These functions suit custom protocols, lightweight storage, and binary communication.

### Blueprint Example:

(Insert image: BasicTypeConversion.jpg)

---

## 🧪 Blueprint Node Overview (Image)

- All nodes are `BlueprintPure` — no execution pins required
- Easily compose them for networking, file access, or custom protocols

![](/media-occurrence/doc%3Asimple-byte-conversion%3Aprimitive-bytes%3Amedia%3A1)

---

### Blueprint Example:

![](/media-occurrence/doc%3Asimple-byte-conversion%3Aprimitive-bytes%3Amedia%3A2)

![](/media-occurrence/doc%3Asimple-byte-conversion%3Aprimitive-bytes%3Amedia%3A3)

![](/media-occurrence/doc%3Asimple-byte-conversion%3Aprimitive-bytes%3Amedia%3A4)

---

## 🔧 Recommended Companion Plugins

Works well with **SimpleTCPClient** and **SimpleUDP**.  
Together, they let you send structured messages over TCP/UDP and decode them easily.

---

## Version History



Open **Edit → Project Settings**, go to SimpleByteConversion settings, and set **Language** to **English** or **Chinese**. English is the default. User-facing interfaces, prompts, notifications, and functional logs update immediately without restarting the editor; public API names and module startup/shutdown logs always remain in English.

## Support

For usage questions or collaboration inquiries, visit the contact page.

- **Contact:** [Contact and Collaboration](https://mzsh.me/contact/)

## SimpleByteConversion User Guide

Network messages, saved data and exchanges with other programs may need to be encoded as byte arrays. The plugin exposes Blueprint nodes for primitive values, generic structs and JSON. The built-in nodes available to your project depend on which features and plugins it enables. When exchanging data between languages, agree on an encoding and format first.

The C++ examples explain memory layout, reflection and JSON processing. They show parts of the implementation; the examples do not list the full plugin API. A struct address alone does not make the struct safe to copy byte for byte.

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

### Primitive memory layout and text encoding

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

## Installation and Usage

### Step 1: Install the Plugin

Copy the plugin folder into your project's `Plugins` directory and restart the editor.

### Step 2: Use in Blueprints

All nodes are under the `SimpleByteConversion` category:

-   **Basic types**: Search for `IntToBytes`, `FloatToBytes`, etc.
-   **Structs**: Search for `StructToBytes`, `StructToJsonString`, etc.

## Call Examples

### Scenario 1: UDP/TCP Network Communication

A communication channel still needs a message format. Struct-to-byte conversion handles how the data is represented; the communication module handles connections, sending, receiving and the protocol.

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
