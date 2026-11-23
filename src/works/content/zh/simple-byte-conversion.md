---
title: SimpleByteConversion
description: 提供基础类型、结构体、字节数组与 JSON 字符串之间的转换接口。
type: work
slug: simple-byte-conversion
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
order: 1
status: 正式文档
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/zh-cn/listings/ee68b12e-30b4-4904-8f80-3cc43c1e6002
    - kind: docs
      href: /zh/works/simple-byte-conversion/docs/setup/
  compatibility:
    - platforms:
        - Windows (Win64)
        - macOS
        - Linux
        - Android
        - iOS
      requirements:
        - UE 5.2–5.8
featured: false
draft: false
sitePublish: false
tags:
  - 蓝图
  - 序列化
  - Simple 系列
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19770934
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/19770934
docIds:
  - simple-byte-conversion-setup
  - simple-byte-conversion-primitive-bytes
  - simple-byte-conversion-struct-and-json
coverAlt: SimpleByteConversion封面
websiteCoverUrl: /media/covers/works/simple-byte-conversion-20261101.webp
sourceDate: 2026-03-25
lang: zh
translationKey: simple-byte-conversion
---

## 作品简介

SimpleByteConversion 为 UE 蓝图提供常用数据到字节数组、结构体到字节数组，以及结构体与 JSON 字符串的双向转换接口。

它让需要网络传输、文件存储或外部程序交换数据的蓝图逻辑，能够先取得明确的字节或文本表示，再交给相应的通信与存储环节。

## 背景与目标

蓝图中处理整数、浮点数或自定义结构体时，直接得到可发送的字节数组并不方便。不同来源的数据还可能采用二进制或 JSON 表示。

插件把这些基础转换整理成可调用节点，减少各项目为同类数据重复编写接口的工作，并将转换与后续传输、持久化操作分开。

## 核心能力

### 基础类型与字节数组

提供 int32、int64、float、double、bool 和 FString 的 ToBytes / FromBytes 成对接口。基础数值按其内存表示写入字节数组，字符串使用 UTF-8。

发送前将值转成字节，接收端用对应的节点还原同一类型。

### 结构体二进制转换

StructToBytes 与 BytesToStruct 面向自定义结构体。蓝图接口通过泛型结构体参数接收不同类型，再输出字节数组或还原结构体。

结构体类型与字段布局是转换双方共同的契约，接收端不能只凭字节长度猜测含义。

### 结构体 JSON 转换

StructToJsonString 与 JsonStringToStruct 在结构体和可读文本之间转换。

要让 Python 等外部程序读取字段，或需要直接查看内容，可以选 JSON。插件会处理字段名和浮点数的输出格式，实际字段与数值仍需核对。

## 适用场景

可用于 UE 项目在 UDP/TCP 通信前整理待发送数据，或在文件存储前把结构化状态转换为字节。

与外部程序交互时，可选 JSON 来核对字段；这些示例中的网络连接和文件读写应由其他模块完成。

## 使用流程

假设蓝图要交给网络模块一个 `int32` 的分数。在发送端，用对应的 ToBytes 节点生成字节数组；接收端按双方约定的数据格式取出这部分字节，再用对应的 FromBytes 节点还原 `int32`。

如果要交换多个字段，可改用[结构体与 JSON 节点](/zh/works/simple-byte-conversion/docs/struct-and-json/)。先用 `Struct To JsonString` 导出一份样例，核对字段和值；需要读回时，将 JSON 交给 `JsonString To Struct`，并使用匹配的结构体类型。节点位于蓝图中的 [`SimpleByteConversion` 分类](/zh/works/simple-byte-conversion/docs/setup/)。

## 适用范围与边界

转换接口本身不定义跨语言协议。含对象引用或资源句柄的结构体不在支持范围内。

发送端与接收端仍需约定类型、字段、编码和版本，并用固定样例验证往返结果。结构体变更后应重新检查旧数据的兼容性，不能把能成功调用转换节点等同于数据已正确解释。

操作步骤和参数说明见 [使用教程](/zh/works/simple-byte-conversion/docs/primitive-bytes/)。

## 兼容性、语言和支持

支持 Unreal Engine 5.2–5.8。

打开 **编辑 → 项目设置**，进入 SimpleByteConversion 设置页，将 **Language** 设置为 **English** 或 **中文**。默认语言为英文。面向用户的界面、提示、通知和功能日志会立即更新，无需重启编辑器；公开 API 名称以及模块启动/关闭日志始终保持英文。

如有使用问题或合作需求，请前往联系页面。

- **联系入口：** [联系与合作](https://mzsh.me/contact/)

## 配套插件

如果需要通过 TCP 或 UDP 收发结构化消息，可搭配 **SimpleTCPClient** 或 **SimpleUDP**。

## 文档出处

原文于 2026-03-25 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/19770934)。
