---
title: 转换结构体、字节数组与 JSON
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
  group: features
  slug: struct-and-json
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/simple-byte-conversion/docs/struct-and-json/
lang: zh
translationKey: doc:simple-byte-conversion:struct-and-json
---

## 选择结构体转换节点

先按接收端能处理的格式选节点：需要核对字段或与外部程序交换数据时，优先考虑 JSON；使用二进制时，先确认双方对结构体和字节格式的约定。

插件支持任何暴露给蓝图的 `USTRUCT`：

- 与字节数组互转：`Struct To Bytes` / `Bytes To Struct`
- 与 JSON 字符串互转：`Struct To JsonString` / `JsonString To Struct`

转换使用 Unreal 反射读写字段。JSON 的字段名和浮点数格式仍需按实际数据核对。

> ⚠️ 不支持：包含对象引用的结构体，如 `UObject*`、`TSoftObjectPtr`、`TWeakObjectPtr`，或资源句柄如 `FSoftObjectPath`。

- StructToBytes / BytesToStruct：结构体与二进制字节数组之间转换。
- StructToJsonString / JsonStringToStruct：结构体与 JSON 字符串之间转换。

| 特性              | SimpleByteConversion                | UE 原生 FJsonObjectConverter |
|------------------|-------------------------------------|-------------------------------|
| 字段名保留        | ✅ 是                              | ❌ 转为 camelCase             |
| Float/Double 精度 | float 输出 9 位小数，double 输出 17 位有效数字 | 取决于字段类型与序列化路径               |
| 完整蓝图支持      | ✅ 是                              | ⚠️ 部分支持 / 需要 C++        |

- `StringToBytes` 和 `BytesToString` 使用 UTF-8 编码，确保跨平台安全转换
- 结合使用 `StructToBytes` 和 `StructToJsonString` 可用于调试和网络消息

## 泛型结构体参数与 CustomThunk

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

## JSON 的字段名和浮点精度

UE 默认的 JSON 序列化存在两个问题：

1.  **字段名带有引擎内部后缀**（如 `MyField_5_A3B2C1D4`）
2.  **浮点数精度丢失**（float 只保留6位有效数字）

下面用自定义 `FExactPrintPolicy` 说明浮点数打印策略；字段名清洗需要单独处理。

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

Python、C# 等程序可以解析 JSON；解析成功后，仍要核对键名与数值是否符合双方约定。

字段名后缀和数值输出同样需要核对实际类型与序列化路径；不能将上面的“字段名带后缀”或“float 只保留 6 位有效数字”视为所有 UE JSON 输出的统一规则。清洗字段名还需要保留与真实反射属性的对应关系，避免重名或导入时无法还原。

代码注释写的是“float 保留 9 位”，但 `%.9f` 实际输出小数点后 9 位，不等于 9 位有效数字；`%.17g` 使用 17 位有效数字。固定小数位也不能为所有量级的 float 保证无损往返。这个片段只定义打印策略，没有展示完整序列化调用路径，仍需确认实际写出时使用了该策略，不能只凭策略声明认定精度问题已经解决。

## 先解析 JSON，再写入结构体

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

## 在 C++ 中调用

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

## 示例：通过 UDP/TCP 发送数据

原生通信通道之外，实际项目还需要消息序列化，即结构体与字节数组的双向转换。转换解决数据表示问题，连接、收发与协议管理仍由通信模块负责。

网络发送前，将需要传输的结构化数据编码为字节数组：

```
1. 定义一个结构体（如 FPlayerState：位置、血量、状态）
2. 使用 StructToBytes 将结构体转为 TArray<uint8>
3. 通过 UDP/TCP 发送字节数组
4. 接收端使用 BytesToStruct 还原为结构体
```

## 示例：与 Python 交换 JSON

使用 JSON 格式进行跨语言数据交换：

```
1. UE 端：StructToJsonString 将游戏数据转为 JSON 字符串
2. 通过 TCP/WebSocket 发送给 Python 程序
3. Python 端：json.loads() 直接解析
4. 反向同理：Python json.dumps() → UE JsonStringToStruct
```

## 示例：持久化数据

二进制保存流程只适用于双方已约定且受转换实现支持的数据，不是把任意带动态内存的结构体整块落盘：

将游戏存档序列化为二进制文件：

```
1. 将存档结构体通过 StructToBytes 转为字节数组
2. 使用 FFileHelper::SaveArrayToFile 写入磁盘
3. 读取时 FFileHelper::LoadFileToArray 加载字节数组
4. BytesToStruct 还原为存档结构体
```

## 格式约定与往返检查

传输两端需要约定字段、编码与数据格式。跨语言交互时应先用一组固定数据检查转换结果。

FString、TArray 和对象引用含有动态存储或地址信息。整块 memcpy 既不能跨进程恢复，也可能破坏生命周期，引发双重释放。基础整数的内存表示也受字节序、宽度和协议约定影响。持久化要选择明确格式，定义 schema 版本、字段、编码和校验；反射 JSON 只覆盖支持的字段类型，不自动解决所有对象引用与版本兼容。

用包含 `FString` 和 `TArray` 的结构体做 JSON 往返测试并逐项比对。JSON 无法解析或缺少必填字段时，目标值应保持原样；同时检查未知字段、数值范围和可接受的浮点误差。示例未经 Unreal Engine 编译或运行验证，也未测试跨版本数据。
