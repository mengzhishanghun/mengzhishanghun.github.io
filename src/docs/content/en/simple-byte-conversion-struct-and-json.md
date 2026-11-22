---
title: Convert Structs and JSON
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
sourceHash: 45efb03615ab36d65de48935d9a8cfb0ac89af6f160c993e3c010d39bbe7f7d4
translationStatus: translated
generatedBodyHash: 401a2b3ba58c57a029410f87e5afcf926999ee08808ae1581c5b91f130e5720c
docPage:
  work: simple-byte-conversion
  group: workflows
  slug: struct-and-json
  order: 2
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

## ✅ Tips

- `StringToBytes` and `BytesToString` use UTF-8 for safe cross-platform conversion
- Combine `StructToBytes` and `StructToJsonString` for debugging and network messages

---

## Struct Nodes

- StructToBytes / BytesToStruct: Convert between structs and binary byte arrays.
- StructToJsonString / JsonStringToStruct: Convert between structs and JSON strings.

### Generic struct parameters with CustomThunk

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

### JSON field names and floating-point output

The original example addresses two issues observed in UE's default JSON output:

1. Field names can include internal suffixes, such as `MyField_5_A3B2C1D4`.
2. Float output can lose precision; the example describes output with only six significant digits.

The original implementation cleans up field names and uses a custom `FExactPrintPolicy`:

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

The intent is to give Python, C# and other programs clean keys and numeric output with enough precision to read the values back.

Check the actual field types and serialization path before assuming the suffixes or six-digit output apply. Keep a mapping from each cleaned key to its reflected property so keys cannot collide and can be restored on import.

Despite the comment about retaining nine digits for `float`, `%.9f` writes nine digits after the decimal point. `%.17g` uses 17 significant digits. A fixed number of decimal places cannot preserve every `float` on a round trip. The example defines only the print policy. Check that the serializer actually calls it before relying on its output.

### Parse JSON before writing to the struct

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

### Scenario 3: Data Persistence

Use this binary save flow only for data the conversion supports and whose format the reader and writer have agreed on. Do not use it to dump an arbitrary struct with dynamic storage:

Serialize game saves to binary files:

```
1. Convert the save struct to a byte array with StructToBytes
2. Write to disk with FFileHelper::SaveArrayToFile
3. Load the byte array with FFileHelper::LoadFileToArray when reading
4. Restore the save struct with BytesToStruct
```

## Usage Boundaries

Both ends must agree on fields, encoding, and data format. For cross-language interaction, check conversion results using a fixed dataset first.

`FString`, `TArray` and object references contain dynamic storage or addresses. A whole-struct `memcpy` cannot restore them in another process and can cause lifetime errors such as a double free. Primitive integers still depend on byte order, width and the protocol. For stored data, specify the schema version, fields, encoding and validation. Reflection-based JSON covers supported fields; references and version compatibility need separate handling.

### Round-trip checks and example limits

Round-trip a struct containing `FString` and `TArray` through JSON and compare the fields. Malformed JSON or a missing required field should leave the destination unchanged. Record the format version and test unknown fields and numeric limits. Compare the actual float output with your application's allowed error. None of the examples were compiled or run in UE, and cross-version data was not tested.

Generic struct arguments expose the reflected type and its address. The declared `int32` is a placeholder; do not cast the struct to an integer. Any loss of floating-point precision depends on the engine version, the field and the output policy. The example does not establish that every `FJsonObjectConverter` conversion loses significant precision.

---

Originally published on 2026-03-25 on [CNBlogs](https://www.cnblogs.com/mengzhishanghun/p/19770934).
