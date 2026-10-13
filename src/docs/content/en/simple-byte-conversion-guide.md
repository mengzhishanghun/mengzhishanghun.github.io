---
title: SimpleByteConversion User Manual
description: Complete English product manual for SimpleByteConversion
type: doc
slug: simple-byte-conversion-guide
categoryId: ue-plugins
categoryName: UE Plugins
categoryOrder: 0
draft: false
sitePublish: true
tags:
  - Blueprints
  - Serialization
workIds:
  - simple-byte-conversion
documentKind: product-manual
websiteRoute: /docs/zh/guides/ue-tools/simple-byte-conversion-guide/
lang: en
translationKey: simple-byte-conversion-guide
supplementSources:
  - docs/content/en/supplements/simple-byte-conversion-guide-1.md
sourceHash: c0220a3370735057b86606da154181782f3c4ae4f13cdf4f4bb4d651aef41551
translationStatus: translated
generatedBodyHash: 4bac18f699b361fd0e75be09fbf9f1b3afee09967bd1026f1aae622eaf64138f
---

# 📘 SimpleByteConversion Plugin Tutorial (Blueprint Edition)

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

## 🧱 Structs ↔ Byte Arrays / Json Strings

The plugin supports any `USTRUCT` exposed to Blueprints:

- Convert to/from byte arrays: `Struct To Bytes` / `Bytes To Struct`
- Convert to/from JSON strings: `Struct To JsonString` / `JsonString To Struct`

Unreal's reflection system automatically serializes and deserializes fields while preserving original naming and floating-point precision.

> ⚠️ Unsupported: Structs containing object references such as `UObject*`, `TSoftObjectPtr`, or `TWeakObjectPtr`, or asset handles such as `FSoftObjectPath`.

### JSON Conversion Advantages:

| Feature | SimpleByteConversion | Native UE FJsonObjectConverter |
|------------------|-------------------------------------|-------------------------------|
| Field names preserved | ✅ Yes | ❌ Converted to camelCase |
| Float/Double precision | ✅ float (9 digits), double (17 digits) | ❌ Lower default precision |
| Full Blueprint support | ✅ Yes | ⚠️ Partial support / C++ required |

---

## 🧪 Blueprint Node Overview (Image)

- All nodes are `BlueprintPure` — no execution pins required
- Easily compose them for networking, file access, or custom protocols

![](/media-occurrence/doc%3Asimple-byte-conversion-guide%3Amedia%3A1)

---

### Blueprint Example:

![](/media-occurrence/doc%3Asimple-byte-conversion-guide%3Amedia%3A2)

![](/media-occurrence/doc%3Asimple-byte-conversion-guide%3Amedia%3A3)

![](/media-occurrence/doc%3Asimple-byte-conversion-guide%3Amedia%3A4)

---

## ✅ Tips

- `StringToBytes` and `BytesToString` use UTF-8 for safe cross-platform conversion
- Combine `StructToBytes` and `StructToJsonString` for debugging and network messages

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
