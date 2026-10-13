---
title: SimpleByteConversion 使用指南
description: 提供基础类型、结构体、字节数组与 JSON 字符串之间的转换接口。
type: doc
slug: simple-byte-conversion-guide
categoryId: ue-tools
categoryName: UE工具
categoryOrder: 0
order: 0
status: 正式文档
date: 2026-03-25
draft: false
sitePublish: false
tags:
  - SimpleByteConversion
  - UE工具
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19770934
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/19770934
workIds:
  - simple-byte-conversion
lang: zh
translationKey: doc:simple-byte-conversion-guide:supplement:1
---

# SimpleByteConversion 使用指南

## 基础类型节点

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

## 结构体节点

- StructToBytes / BytesToStruct：结构体与二进制字节数组之间转换。
- StructToJsonString / JsonStringToStruct：结构体与 JSON 字符串之间转换。

## 安装与使用

### 步骤1：安装插件

将插件文件夹复制到项目的 `Plugins` 目录，重启编辑器。

### 步骤2：在蓝图中使用

所有节点都在 `SimpleByteConversion` 分类下：

-   **基础类型**：搜索 `IntToBytes`、`FloatToBytes` 等
-   **结构体**：搜索 `StructToBytes`、`StructToJsonString` 等

### 步骤3：C++ 中使用

如果你在 C++ 中需要使用，可以直接调用 `ByteConverter` 工具类：

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

## 调用示例

### 场景1：UDP/TCP 网络通信

网络发送前，将需要传输的结构化数据编码为字节数组：

```
1. 定义一个结构体（如 FPlayerState：位置、血量、状态）
2. 使用 StructToBytes 将结构体转为 TArray<uint8>
3. 通过 UDP/TCP 发送字节数组
4. 接收端使用 BytesToStruct 还原为结构体
```

### 场景2：与 Python 程序交换数据

使用 JSON 格式进行跨语言数据交换：

```
1. UE 端：StructToJsonString 将游戏数据转为 JSON 字符串
2. 通过 TCP/WebSocket 发送给 Python 程序
3. Python 端：json.loads() 直接解析
4. 反向同理：Python json.dumps() → UE JsonStringToStruct
```

### 场景3：数据持久化

将游戏存档序列化为二进制文件：

```
1. 将存档结构体通过 StructToBytes 转为字节数组
2. 使用 FFileHelper::SaveArrayToFile 写入磁盘
3. 读取时 FFileHelper::LoadFileToArray 加载字节数组
4. BytesToStruct 还原为存档结构体
```

## 使用边界

传输两端需要约定字段、编码与数据格式。跨语言交互时应先用一组固定数据检查转换结果。

---

原文于 2026-03-25 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/19770934)。
