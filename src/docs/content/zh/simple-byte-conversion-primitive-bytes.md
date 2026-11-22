---
title: 转换基础类型与字节数组
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
  group: workflows
  slug: primitive-bytes
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-byte-conversion/docs/primitive-bytes/
lang: zh
translationKey: doc:simple-byte-conversion:primitive-bytes
---

**支持的虚幻引擎版本**：5.2–5.8

**SimpleByteConversion** 是一个为 Unreal Engine 蓝图系统设计的轻量级字节数据转换插件。  
支持**原生类型和结构体与字节/Json 之间的双向转换**，所有功能均以蓝图节点暴露。

---

## 🔧 插件初始化

插件启用后自动生效。  
所有功能通过蓝图节点访问，无需管理子系统或插件生命周期。

---

## 🔣 支持的类型转换

### 📦 原生类型 ↔ 字节数组

| 类型         | 转换支持 |
|-------------|---------|
| `int32`     | 转为/转自字节 |
| `int64`     | 转为/转自字节 |
| `float`     | 转为/转自字节 |
| `double`    | 转为/转自字节 |
| `bool`      | 转为/转自字节 |
| `FString`   | 转为/转自字节（UTF-8 编码） |

这些函数适用于自定义协议、轻量存储或二进制通信。

### 蓝图示例：

(插入图片: BasicTypeConversion.jpg)

---

## 🧪 蓝图节点概览（图片）

- 所有节点均为 `BlueprintPure`——无需执行引脚
- 可组合用于网络、文件存取或自定义协议

![](/media-occurrence/doc%3Asimple-byte-conversion%3Aprimitive-bytes%3Amedia%3A1)

---

### 蓝图示例：

![](/media-occurrence/doc%3Asimple-byte-conversion%3Aprimitive-bytes%3Amedia%3A2)

![](/media-occurrence/doc%3Asimple-byte-conversion%3Aprimitive-bytes%3Amedia%3A3)

![](/media-occurrence/doc%3Asimple-byte-conversion%3Aprimitive-bytes%3Amedia%3A4)

---

## 🔧 推荐配套插件

与 **SimpleTCPClient** 和 **SimpleUDP** 插件配合使用效果极佳。  
一起使用可通过 TCP/UDP 发送结构化消息并解码。

---

## 版本历史



打开 **编辑 → 项目设置**，进入 SimpleByteConversion 设置页，将 **Language** 设置为 **English** 或 **中文**。默认语言为英文。面向用户的界面、提示、通知和功能日志会立即更新，无需重启编辑器；公开 API 名称以及模块启动/关闭日志始终保持英文。

## 支持

如有使用问题或合作需求，请前往联系页面。

- **联系入口：** [联系与合作](https://mzsh.me/contact/)

## SimpleByteConversion 使用指南

网络通信、数据持久化和与外部程序交互都可能需要把数据转换为字节数组。插件为蓝图提供基础类型、泛型结构体及 JSON 转换入口：原生蓝图如何获得相应节点取决于项目启用的功能和插件，跨语言交换还需约定编码与数据格式。

下面先说明插件节点，再结合 C++ 原理示例解释内存表示、反射取参和 JSON 处理。原理片段不等于完整插件 API，也不能把获得结构体地址理解为任意结构体都能整块复制。

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

### 基础类型的内存表示与字符编码

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

## 安装与使用

### 步骤1：安装插件

将插件文件夹复制到项目的 `Plugins` 目录，重启编辑器。

### 步骤2：在蓝图中使用

所有节点都在 `SimpleByteConversion` 分类下：

-   **基础类型**：搜索 `IntToBytes`、`FloatToBytes` 等
-   **结构体**：搜索 `StructToBytes`、`StructToJsonString` 等

## 调用示例

### 场景1：UDP/TCP 网络通信

原生通信通道之外，实际项目还需要消息序列化，即结构体与字节数组的双向转换。转换解决数据表示问题，连接、收发与协议管理仍由通信模块负责。

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
