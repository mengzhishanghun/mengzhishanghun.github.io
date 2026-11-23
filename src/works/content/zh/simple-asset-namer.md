---
title: SimpleAssetNamer
description: 按资产类型和路径规则处理自动命名与批量重命名。
type: work
slug: simple-asset-namer
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
order: 10
status: 正式文档
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/listings/f7c4474c-9a9d-455a-a948-d46d557b457d
    - kind: docs
      href: /zh/works/simple-asset-namer/docs/setup/
  compatibility:
    - platforms:
        - Windows (Win64)
        - macOS
        - Linux
      requirements:
        - UE 5.2–5.8
featured: false
draft: false
sitePublish: false
tags:
  - 资产管理
  - 命名规范
  - Simple 系列
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19770922
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/19770922
docIds:
  - simple-asset-namer-setup
  - simple-asset-namer-naming-rules
  - simple-asset-namer-rename-assets
coverAlt: SimpleAssetNamer封面
websiteCoverUrl: /media/covers/works/simple-asset-namer-20261101.webp
sourceDate: 2026-03-25
lang: zh
translationKey: simple-asset-namer
---

## 作品简介

SimpleAssetNamer 为 UE 资产提供基于类型和路径的命名规则。它既能在创建、导入或手动改名时检查新名称，也能对已有目录中的资产进行批量重命名。

你可以设置前后缀和分隔符，也可以指定要识别的旧词缀。重命名结果按成功、跳过和错误分开显示。

## 背景与目标

项目中的蓝图、网格、材质等资产经常需要使用不同前缀。人工命名容易出现大小写、分隔符和旧规则混用，已有资产较多时，逐个整理也很费力。

插件将命名约定整理成可配置规则，并提供路径筛选，让团队限定规则生效的位置，逐步处理已有资产。

## 核心能力

### 按类型生成名称

按资产类型应用前后缀与分隔符规则，也能识别历史词缀，帮助从旧命名约定迁移。

### 自动与批量处理

创建或导入时的自动改名，与手动改名后的自动检查，可以分别开关。对已有资产，可从内容浏览器选中一组资产或一个文件夹，按同一套规则批量处理。

### 路径与结果控制

通过路径筛选限定处理范围，并分别报告成功、跳过和错误结果，便于检查未处理的资产。

## 适用场景

适合在多人项目中执行统一的资产命名约定，也适合从旧前后缀迁移到新规则。对逐步引入规范的项目，可先限制在某些内容目录验证结果，再扩大到其他目录。

## 使用流程

1. [安装插件并打开设置](/zh/works/simple-asset-namer/docs/setup/)，核对资产类型、词缀和路径范围。例如，用默认蓝图前缀 `BP` 试一下：`MyCharacter` 应改为 `BP_MyCharacter`。
2. 整理已有资产时，先试一小批。右键选中的资产，选择 **Simple Asset Namer → Auto Rename**；处理整个文件夹时，使用 **Auto Rename All Assets**。
3. 在结果窗口核对原名和新名，再查看跳过和错误的原因。批量改名后检查资产引用。

具体操作见[自动与批量重命名](/zh/works/simple-asset-namer/docs/rename-assets/)。

## 适用范围与边界

重命名会改变资产名称并可能影响引用，尤其是批量操作前应核对路径、规则和版本控制状态。

工具报告的是命名执行结果，项目仍需检查引用、关卡和脚本是否按预期工作。没有匹配规则或目标名称冲突的资产不能假定会自动处理。

操作步骤和参数说明见 [使用教程](/zh/works/simple-asset-namer/docs/naming-rules/)。

## 兼容性与使用支持

支持 Unreal Engine 5.2–5.8。

如有使用问题或合作需求，请前往联系页面。

- **联系入口：** [联系与合作](https://mzsh.me/contact/)

## 文档出处

原文于 2026-03-25 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/19770922)。
