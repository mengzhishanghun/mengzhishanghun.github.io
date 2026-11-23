---
title: Convert Structs, Byte Arrays, and JSON
type: doc
slug: simple-byte-conversion-struct-and-json
draft: false
sitePublish: true
tags:
  - Blueprints
  - Serialization
workIds:
  - simple-byte-conversion
documentKind: product-manual
websiteRoute: /en/works/simple-byte-conversion/docs/struct-and-json/
lang: en
translationKey: doc:simple-byte-conversion:struct-and-json
sourceHash: 2ba5fe2496ba4fd45390f12d1684c52f304550cc6cf2b9a68a6d4f1c779bddb6
translationStatus: translated
generatedBodyHash: 0bfa153c0be5f299c561b94c53fbd77e6dacb0788bbb1a35c771db2220010171
docPage:
  work: simple-byte-conversion
  group: features
  slug: struct-and-json
  order: 2
---

## Choose a Struct Conversion Node

Choose the node pair by what the receiver can read. Use JSON when you need to inspect fields or exchange data with another program. For binary messages, first agree on the struct and byte format on both sides.

The plugin supports any `USTRUCT` exposed to Blueprints:

- Convert to/from byte arrays: `Struct To Bytes` / `Bytes To Struct`
- Convert to/from JSON strings: `Struct To JsonString` / `JsonString To Struct`

The conversions use Unreal reflection to read and write fields. Check JSON field names and floating-point formatting against your data.

> ⚠️ Unsupported: Structs containing object references such as `UObject*`, `TSoftObjectPtr`, or `TWeakObjectPtr`, or asset handles such as `FSoftObjectPath`.

- StructToBytes / BytesToStruct: Convert between structs and binary byte arrays.
- StructToJsonString / JsonStringToStruct: Convert between structs and JSON strings.

| Feature | SimpleByteConversion | Native UE FJsonObjectConverter |
|------------------|-------------------------------------|-------------------------------|
| Field names preserved | ✅ Yes | ❌ Converted to camelCase |
| Float/Double precision | Float: 9 decimal places; double: 17 significant digits | Depends on field type and serialization path |
| Full Blueprint support | ✅ Yes | ⚠️ Partial support / C++ required |

- `StringToBytes` and `BytesToString` use UTF-8 for safe cross-platform conversion
- Combine `StructToBytes` and `StructToJsonString` for debugging and network messages

## Generic Struct Parameters and CustomThunk

**CustomThunk**

Blueprints cannot pass generic structs directly. Use `CustomThunk` with `CustomStructureParam` to declare a generic struct parameter:

```cpp
UFUNCTION(BlueprintPure, CustomThunk,
    meta = (CustomStructureParam = "Struct", DisplayName = "Struct To Bytes"),
    Category = "SimpleByteConversion|Struct")
static void StructToBytes(const int32& Struct, TArray<uint8>& Bytes);
DECLARE_FUNCTION(execStructToBytes);
```

You can connect a custom struct in Blueprint. The implementation identifies its type when it serializes the value.

A generic parameter can accept any custom struct at the pin. The implementation still has to recognize supported field types and account for references, dynamic storage and version compatibility. Arbitrary structs cannot safely be copied byte for byte or restored in another process. The declaration omits the execution function.

`CustomStructureParam` marks the generic parameter. The `int32` in the declaration is a reflection placeholder. Callers pass a struct, without casting it to an integer. The thunk consumes VM arguments in declaration order and checks the `FStructProperty` and address before converting anything. Do not call `CastFieldChecked` expecting a null return on failure. Keep the declaration, VM read order and output direction consistent. Only the parsing steps are shown here; the full thunk was not compiled.

## JSON Field Names and Floating-Point Precision

The original example addresses two issues observed in UE's default JSON output:

1. Field names can include internal suffixes, such as `MyField_5_A3B2C1D4`.
2. Float output can lose precision; the example describes output with only six significant digits.

The custom `FExactPrintPolicy` below illustrates numeric formatting. Field name cleanup is a separate step.

```cpp
// 高精度输出：float 保留9位，double 保留17位
template <typename CharT>
struct FExactPrintPolicy : TCondensedJsonPrintPolicy<CharT>
{
    static void WriteFloat(FArchive* Stream, float V)
    {
        FString S = FString::Printf(TEXT("%.9f"), V);
        TCondensedJsonPrintPolicy<CharT>::WriteString(Stream, S);
    }
    static void WriteDouble(FArchive* Stream, double V)
    {
        FString S = FString::Printf(TEXT("%.17g"), V);
        TCondensedJsonPrintPolicy<CharT>::WriteString(Stream, S);
    }
};
```

Python, C#, and other programs can parse the JSON. After parsing, check that keys and values match the agreed format.

Check the actual field types and serialization path before assuming the suffixes or six-digit output apply. Keep a mapping from each cleaned key to its reflected property so keys cannot collide and can be restored on import.

Despite the comment about retaining nine digits for `float`, `%.9f` writes nine digits after the decimal point. `%.17g` uses 17 significant digits. A fixed number of decimal places cannot preserve every `float` on a round trip. The example defines only the print policy. Check that the serializer actually calls it before relying on its output.

## Parse JSON Before Writing to the Struct

The example shows the main parsing and copy steps:

```cpp
TSharedPtr<FJsonObject> Parsed;
const auto Reader = TJsonReaderFactory<>::Create(InputJson);
if (!FJsonSerializer::Deserialize(Reader, Parsed) || !Parsed.IsValid())
{
    return false;
}
FStructOnScope Temporary(StructType);
if (!FJsonObjectConverter::JsonObjectToUStruct(
        Parsed.ToSharedRef(), StructType, Temporary.GetStructMemory(), 0, 0))
{
    return false;
}
// 必填字段和业务值验证通过后再复制到已初始化目标。
StructType->CopyScriptStruct(Destination, Temporary.GetStructMemory());
```

Validate `StructType` and `Destination` first; the destination must be an initialized struct of the right type. Converting an empty `JsonObject` beforehand does not read `InputJson`. `{}` is valid JSON. Whether it is acceptable depends on which fields are required.

## Call from C++

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

## Example: Send Data over UDP or TCP

A communication channel still needs a message format. Struct-to-byte conversion handles how the data is represented; the communication module handles connections, sending, receiving and the protocol.

Before sending over the network, encode the structured data as a byte array:

```
1. Define a struct (e.g. FPlayerState: position, health, state)
2. Use StructToBytes to convert the struct to TArray<uint8>
3. Send the byte array over UDP/TCP
4. Use BytesToStruct on the receiving end to restore the struct
```

## Example: Exchange JSON with Python

Use JSON for cross-language data exchange:

```
1. UE: StructToJsonString converts game data to a JSON string
2. Send it to the Python program over TCP/WebSocket
3. Python: parse directly with json.loads()
4. Reverse the process: Python json.dumps() → UE JsonStringToStruct
```

## Example: Persist Data

Use this binary save flow only for data the conversion supports and whose format the reader and writer have agreed on. Do not use it to dump an arbitrary struct with dynamic storage:

Serialize game saves to binary files:

```
1. Convert the save struct to a byte array with StructToBytes
2. Write to disk with FFileHelper::SaveArrayToFile
3. Load the byte array with FFileHelper::LoadFileToArray when reading
4. Restore the save struct with BytesToStruct
```

## Format Requirements and Round-Trip Checks

Both ends must agree on fields, encoding, and data format. For cross-language interaction, check conversion results using a fixed dataset first.

`FString`, `TArray` and object references contain dynamic storage or addresses. A whole-struct `memcpy` cannot restore them in another process and can cause lifetime errors such as a double free. Primitive integers still depend on byte order, width and the protocol. For stored data, specify the schema version, fields, encoding and validation. Reflection-based JSON covers supported fields; references and version compatibility need separate handling.

Round-trip a struct containing `FString` and `TArray` through JSON and compare its fields. Malformed JSON or missing required fields should leave the destination unchanged. Check unknown fields, numeric bounds, and your allowed floating-point error. The examples were not compiled or run in Unreal Engine, and cross-version data was not tested.
