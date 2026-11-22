---
title: 基础类型与字节数组互转
type: doc
slug: simple-byte-conversion-primitive-bytes
draft: false
sitePublish: true
tags:
  - 蓝图
  - 序列化
workIds:
  - simple-byte-conversion
docPage:
  work: simple-byte-conversion
  group: conversion
  slug: primitive-bytes
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-byte-conversion/docs/primitive-bytes/
lang: zh
translationKey: doc:simple-byte-conversion:primitive-bytes
---

## 支持的类型与节点

基础类型提供 **ToBytes** 和 **FromBytes** 双向转换：

| 类型 | 转字节 | 从字节还原 |
| --- | --- | --- |
| int32 | `IntToBytes` | `BytesToInt` |
| int64 | `Int64ToBytes` | `BytesToInt64` |
| float | `FloatToBytes` | `BytesToFloat` |
| double | `DoubleToBytes` | `BytesToDouble` |
| bool | `BoolToBytes` | `BytesToBool` |
| FString | `StringToBytes` | `BytesToString` |

所有节点均为 `BlueprintPure`，可以直接在蓝图中作为纯函数使用，无需执行引脚。

这些节点可用于自定义协议、轻量存储和二进制通信。下面的 C++ 片段用于说明原理。

## 蓝图转换示例

![](/media-occurrence/doc%3Asimple-byte-conversion%3Aprimitive-bytes%3Amedia%3A1)

![](/media-occurrence/doc%3Asimple-byte-conversion%3Aprimitive-bytes%3Amedia%3A2)

![](/media-occurrence/doc%3Asimple-byte-conversion%3Aprimitive-bytes%3Amedia%3A3)

## 内存表示、字节序与 UTF-8

以下是基础类型转换的 C++ 原理示例：

```cpp
// 以 int32 为例，直接内存拷贝
void ByteConverter::IntToBytes(int32 Value, TArray<uint8>& OutBytes)
{
    OutBytes.SetNumUninitialized(sizeof(int32));
    FMemory::Memcpy(OutBytes.GetData(), &Value, sizeof(int32));
}
```

示例使用 `FMemory::Memcpy` 复制基础类型的内存表示。字符串转换使用 UTF-8 编码，自动处理 Null Terminator，确保跨平台兼容。

UTF-8 只约定文本编码，不会自动定义整个通信协议。发送端与接收端还需约定长度、终止符是否计入数据及空字符串的处理方式；接收端不能假设字节数组中一定有可读的终止符。上面的 int32 示例使用本机内存表示，也没有规定跨平台字节序。
