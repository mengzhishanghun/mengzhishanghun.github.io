---
title: 安装与首次绑定
type: doc
slug: simple-auto-enum-quickstart
draft: false
sitePublish: true
tags:
  - 配置管理
  - 枚举
workIds:
  - simple-auto-enum
docPage:
  work: simple-auto-enum
  group: getting-started
  slug: quickstart
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-auto-enum/docs/quickstart/
lang: zh
translationKey: doc:simple-auto-enum:quickstart
---

## 安装与准备

安装：通过 Epic Games 启动器，将 SimpleAutoEnum 安装到项目使用的 UE 版本。

启用：在编辑器的插件窗口中查找并启用 SimpleAutoEnum，按提示重启编辑器。

首次接入需要 C++：配置类继承自 `UDeveloperSettings`，提供 `TArray<FString>` 属性；目标枚举需要起止边界。仅使用蓝图无法完成这些声明。

## 完成一组绑定

1. 按[声明枚举和配置数组](/zh/works/simple-auto-enum/docs/config-binding/)创建配置类、数组和带边界的枚举。
2. 用 `SIMPLE_BIND_ENUM_TO_CONFIG` 绑定枚举类型、起止边界、配置类和数组属性。
3. 在该配置类对应的项目设置页中填入数组条目。以武器列表为例，可以先填入“剑”“斧”“弓”。
4. 对照配置与运行结果，确认条目位于预期边界之间。未出现的条目可先检查空值、重复项和边界，再查看 `LogSimpleAutoEnum`。

## 继续使用

多组数组可以分别绑定同一枚举的不同范围，多个枚举也可以共享同一数组。各类绑定的完整代码和参数仍在[枚举绑定文档](/zh/works/simple-auto-enum/docs/config-binding/)中查阅。

已有蓝图和数据资产中的枚举值需要另外检查。更改名称或顺序可能影响原有数据；需要保留兼容性时优先追加条目。详见[在蓝图和数据资产中使用枚举](/zh/works/simple-auto-enum/docs/blueprints-and-assets/)。
