---
title: SimpleAutoEnum
description: 通过宏将配置数组绑定到枚举范围，减少重复的初始化代码。
type: work
slug: simple-auto-enum
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
order: 8
status: 正式文档
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/zh-cn/listings/2d104382-60b1-4da6-86c6-ed93997f9c0a
    - kind: docs
      href: /zh/works/simple-auto-enum/docs/quickstart/
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
  - 配置管理
  - 枚举
  - Simple 系列
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19136345
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/19136345
docIds:
  - simple-auto-enum-quickstart
  - simple-auto-enum-config-binding
  - simple-auto-enum-blueprints-and-assets
coverAlt: SimpleAutoEnum封面
websiteCoverUrl: /media/covers/works/simple-auto-enum-20261101.webp
sourceDate: 2025-10-12
lang: zh
translationKey: simple-auto-enum
---

## 作品简介

SimpleAutoEnum 用宏声明配置数组与 UE 枚举之间的绑定，减少为每个枚举重复编写初始化和配置变更处理代码。

它支持一对一绑定，也可把多个数组放进同一枚举的不同范围，或让多个枚举共用一份配置数组。

## 背景与目标

在 UE 中把配置内容映射到枚举反射数据时，基础做法需要定义配置类、在子系统中初始化枚举，并为配置变化编写相似的更新逻辑。枚举和配置项增加后，这些代码容易重复且难以检查。

用宏声明各组绑定后，可以通过配置验证和日志检查它们是否按预期生效。

## 核心能力

### 声明数组与枚举的绑定

一对一场景下，宏将指定配置类中的数组映射到目标枚举。新增同类绑定时，使用方仍要定义目标枚举和配置属性，但不必为每一组重复组织完整的初始化调用。

用 C++ 定义 `UDeveloperSettings` 配置类和目标枚举，再用 `SIMPLE_BIND_ENUM_TO_CONFIG` 把类中的 `TArray<FString>` 绑定到枚举的指定边界之间。仅靠蓝图无法完成这些声明。

### 组合范围和共享数据源

需要一个枚举承载多组配置时，可为不同数组指定各自的枚举范围；多个枚举也能引用同一配置数组。这两类用法让绑定关系贴近配置结构，无需所有项目都采用单数组、单枚举的模式。

### 数据验证与日志

工具处理配置中的空值、重复值和范围边界，并记录绑定注册、处理结果及重复值等日志。使用方可据此检查配置是否按预期进入枚举；最终仍应在使用这些枚举的蓝图与业务流程中验证结果。

插件会过滤空字符串和纯空白项、合并重复项，并保护边界名称不被配置覆盖。绑定结果不符合预期时，可到 `LogSimpleAutoEnum` 查看处理记录。

## 适用场景

适合多个 UE 枚举由项目设置中的数组提供条目，且常要增补绑定或组合配置来源的 C++ 项目。它尤其用于减少同类枚举初始化逻辑的重复维护。

## 使用流程

1. 声明配置数组、枚举和起止边界，再写宏绑定。例如，将 `WeaponsList` 绑定到 `EWeaponType` 的 `None` 与 `MAX` 之间。
2. 在项目设置中为 `WeaponsList` 填入 `剑`、`斧`、`弓`、`法杖`。生成的条目位于两个边界之间，边界保留。
3. 核对项目设置中的输入与运行结果，再检查使用该枚举的蓝图和数据资产。

![](/media-occurrence/work%3Asimple-auto-enum%3Amedia%3A1)

![](/media-occurrence/work%3Asimple-auto-enum%3Amedia%3A2)

[查看蓝图和数据资产的使用限制](/zh/works/simple-auto-enum/docs/blueprints-and-assets/)

## 适用范围与边界

项目仍需正确定义配置类、目标枚举及范围边界，并核对空值和重复值处理是否符合业务预期。

动态改变枚举内容可能影响已有蓝图引用和持久化数据；具体兼容性必须由项目验证，不能仅凭绑定成功日志判断安全。

宏绑定、配置示例与手动初始化原理见 [使用教程](/zh/works/simple-auto-enum/docs/config-binding/)。

枚举名称或位置变化后，蓝图函数里的值可能不会自动更新；可右键函数并选择 **Refresh** 后复查。数据资产存的是枚举索引，重排已有条目可能让原有默认值指向另一个条目。已有数据需要兼容时，优先追加新条目。

## 版本、语言与使用支持

支持 Unreal Engine 5.2–5.8。

打开 **编辑 → 项目设置**，进入 SimpleAutoEnum 设置页，将 **Language** 设置为 **English** 或 **中文**。默认语言为英文。面向用户的界面、提示、通知和功能日志会立即更新，无需重启编辑器；公开 API 名称以及模块启动/关闭日志始终保持英文。

如有使用问题或合作需求，请前往联系页面。

- **联系入口：** [联系与合作](https://mzsh.me/contact/)

## 文档出处

原文于 2025-10-12 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/19136345)。
