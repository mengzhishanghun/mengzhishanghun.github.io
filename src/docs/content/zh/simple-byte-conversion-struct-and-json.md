---
title: 转换结构体与 JSON
type: doc
slug: simple-byte-conversion-struct-and-json
draft: false
sitePublish: true
tags:
  - 蓝图
  - 序列化
workIds:
  - simple-byte-conversion
docPage:
  work: simple-byte-conversion
  group: workflows
  slug: struct-and-json
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/simple-byte-conversion/docs/struct-and-json/
lang: zh
translationKey: doc:simple-byte-conversion:struct-and-json
---

## 🧱 结构体 ↔ 字节数组 / Json 字符串

插件支持任何暴露给蓝图的 `USTRUCT`：

- 与字节数组互转：`Struct To Bytes` / `Bytes To Struct`
- 与 JSON 字符串互转：`Struct To JsonString` / `JsonString To Struct`

此功能使用 Unreal 的反射系统自动序列化和反序列化字段，同时保留原始命名和浮点精度。

> ⚠️ 不支持：包含对象引用的结构体，如 `UObject*`、`TSoftObjectPtr`、`TWeakObjectPtr`，或资源句柄如 `FSoftObjectPath`。

### JSON 转换优势：

| 特性              | SimpleByteConversion                | UE 原生 FJsonObjectConverter |
|------------------|-------------------------------------|-------------------------------|
| 字段名保留        | ✅ 是                              | ❌ 转为 camelCase             |
| Float/Double 精度 | ✅ float(9位), double(17位)         | ❌ 默认精度较低               |
| 完整蓝图支持      | ✅ 是                              | ⚠️ 部分支持 / 需要 C++        |

---

## ✅ 提示

- `StringToBytes` 和 `BytesToString` 使用 UTF-8 编码，确保跨平台安全转换
- 结合使用 `StructToBytes` 和 `StructToJsonString` 可用于调试和网络消息

---

## 结构体节点

- StructToBytes / BytesToStruct：结构体与二进制字节数组之间转换。
- StructToJsonString / JsonStringToStruct：结构体与 JSON 字符串之间转换。

### 泛型结构体参数与 CustomThunk

**关键技术：CustomThunk**

蓝图中无法直接传递泛型结构体。可以用 `CustomThunk` 和 `CustomStructureParam` 声明通用结构体参数：

```cpp
UFUNCTION(BlueprintPure, CustomThunk,
    meta = (CustomStructureParam = "Struct", DisplayName = "Struct To Bytes"),
    Category = "SimpleByteConversion|Struct")
static void StructToBytes(const int32& Struct, TArray<uint8>& Bytes);
DECLARE_FUNCTION(execStructToBytes);
```

这意味着你可以在蓝图中直接拖入**任何自定义结构体**，在执行函数中识别结构体类型并完成序列化。

这里的“任何自定义结构体”描述泛型参数的接入方式，不表示任意结构体都能安全地整块拷贝或跨进程还原。实际转换仍须识别支持的字段类型，并处理对象引用、动态内存和版本兼容。声明本身也不包含完整的执行函数。

通过 `CustomThunk` 与 `CustomStructureParam` 可以实现通用的结构体参数。`CustomStructureParam` 标注泛型结构体参数，声明中的 int32 是反射占位，不是让调用者把结构体强转为整数。Thunk 按声明顺序消费 VM 参数，检查 `FStructProperty` 和地址，完成参数读取后才执行转换。不要在未检查前用 `CastFieldChecked` 期待它“失败返回空”。声明、VM 读取顺序和输出方向必须一致；以下只展示解析核心，未编译完整 Thunk。

### JSON 字段名与浮点数输出

UE 默认的 JSON 序列化存在两个问题：

1.  **字段名带有引擎内部后缀**（如 `MyField_5_A3B2C1D4`）
2.  **浮点数精度丢失**（float 只保留6位有效数字）

原文采用自定义 `FExactPrintPolicy` 和字段名清洗解决了这两个问题：

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

输出的 JSON 字段名干净、数值精度完整，可以直接被 Python、C# 等外部程序解析。

字段名后缀和数值输出同样需要核对实际类型与序列化路径；不能将上面的“字段名带后缀”或“float 只保留 6 位有效数字”视为所有 UE JSON 输出的统一规则。清洗字段名还需要保留与真实反射属性的对应关系，避免重名或导入时无法还原。

代码注释写的是“float 保留 9 位”，但 `%.9f` 实际输出小数点后 9 位，不等于 9 位有效数字；`%.17g` 使用 17 位有效数字。固定小数位也不能为所有量级的 float 保证无损往返。这个片段只定义打印策略，没有展示完整序列化调用路径，仍需确认实际写出时使用了该策略，不能只凭策略声明认定精度问题已经解决。

### 解析 JSON 后再写入结构体

以下片段展示解析与复制的核心步骤：

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

StructType 和 Destination 需预先校验，目标必须是已初始化且类型匹配的结构。解析前写一个空 JsonObject 再转换，并没有读取 InputJson。`{}` 是合法 JSON 对象，但是否可接受取决于必填字段规则，不等于输入一定错误或全部字段有效。

### 步骤3：C++ 中使用

在 C++ 中可以直接调用 `ByteConverter` 工具类：

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

### 场景3：数据持久化

二进制保存流程只适用于双方已约定且受转换实现支持的数据，不是把任意带动态内存的结构体整块落盘：

将游戏存档序列化为二进制文件：

```
1. 将存档结构体通过 StructToBytes 转为字节数组
2. 使用 FFileHelper::SaveArrayToFile 写入磁盘
3. 读取时 FFileHelper::LoadFileToArray 加载字节数组
4. BytesToStruct 还原为存档结构体
```

## 使用边界

传输两端需要约定字段、编码与数据格式。跨语言交互时应先用一组固定数据检查转换结果。

FString、TArray 和对象引用含有动态存储或地址信息。整块 memcpy 既不能跨进程恢复，也可能破坏生命周期，引发双重释放。基础整数的内存表示也受字节序、宽度和协议约定影响。持久化要选择明确格式，定义 schema 版本、字段、编码和校验；反射 JSON 只覆盖支持的字段类型，不自动解决所有对象引用与版本兼容。

### 往返检查与示例限制

用含 FString 和 TArray 的结构往返 JSON，比较字段；给坏 JSON 或缺必填字段应保持目标原值。记录序列化格式的版本，并测试未知字段和数值范围。浮点数是否满足需求要比较实际输出与允许误差，不能笼统声称所有转换都“精度丢失严重”。本文未在 UE 中编译、运行或测试跨版本数据。

泛型结构体取参用于识别真实反射类型和地址；声明中的 int32 是反射占位，不应把结构体强转成整数。浮点数精度问题需结合具体引擎版本、字段类型和输出策略判断，不能笼统理解为所有 FJsonObjectConverter 转换都严重丢失精度。

---

原文于 2026-03-25 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/19770934)。
