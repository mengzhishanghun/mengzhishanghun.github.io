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
featured: false
draft: false
sitePublish: false
tags:
  - 资产管理
  - 命名规范
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19770922
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/19770922
docIds:
  - simple-asset-namer-guide
sourceDate: 2026-03-25
lang: zh
translationKey: simple-asset-namer
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/listings/f7c4474c-9a9d-455a-a948-d46d557b457d
    - kind: docs
      href: /docs/zh/guides/ue-tools/simple-asset-namer-guide/
  compatibility:
    - platforms:
        - Windows (Win64)
        - macOS
        - Linux
      requirements:
        - UE 5.2–5.8
---
## 作品简介

SimpleAssetNamer 为 UE 资产提供基于类型和路径的命名规则。它既能在创建、导入或手动改名时检查新名称，也能对已有目录中的资产进行批量重命名。

规则包括前后缀、分隔符和历史词缀，处理结果会区分成功、跳过与错误。

## 背景与目标

项目中的蓝图、网格、材质等资产经常需要使用不同前缀。人工命名容易出现大小写、分隔符和旧规则混用，已有资产较多时，逐个整理也很费力。

插件将命名约定整理成可配置规则，并提供路径筛选，让团队限定规则生效的位置，逐步处理已有资产。

## 核心能力

### 按类型生成名称

可为不同资产类型设置前缀和后缀，并指定生成名称时使用的分隔符。工具会尝试识别原名称中的现有词缀，提取核心名称后再套用当前规则；历史词缀列表用于识别旧写法，避免简单叠加产生重复前缀。

### 自动与批量处理

自动处理可覆盖资产创建、导入和手动改名后的检查，批量入口则面向已存在的文件夹。两种方式都依据当前规则生成目标名称，适合分别处理新增资产和已有资产，不需要把整库一次性改完。

### 路径与结果控制

包含路径和排除路径决定哪些资产进入处理范围。批量操作后，结果对话框列出成功、跳过与错误项及原因，例如名称已经符合规则、缺少匹配规则或目标名称已存在。使用者可据此修正规则或缩小范围。

## 适用场景

适合在多人项目中执行统一的资产命名约定，也适合从旧前后缀迁移到新规则。对逐步引入规范的项目，可先限制在某些内容目录验证结果，再扩大到其他目录。

## 适用范围与边界

重命名会改变资产名称并可能影响引用，尤其是批量操作前应核对路径、规则和版本控制状态。

工具报告的是命名执行结果，项目仍需检查引用、关卡和脚本是否按预期工作。没有匹配规则或目标名称冲突的资产不能假定会自动处理。
