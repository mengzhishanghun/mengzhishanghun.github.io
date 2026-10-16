---
title: SimpleConfigExclude
description: 在项目设置中管理配置文件的默认、包含和排除状态，并复制排除文件。
type: work
slug: simple-config-exclude
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
order: 11
status: 正式文档
featured: false
draft: false
sitePublish: false
tags:
  - 打包
  - 配置管理
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19770930
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/19770930
docIds:
  - simple-config-exclude-guide
sourceDate: 2026-03-25
lang: zh
translationKey: simple-config-exclude
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/listings/05c2cb8f-cabc-45ef-84e0-9eac988b5a35
    - kind: docs
      href: /docs/zh/guides/ue-tools/simple-config-exclude-guide/
  compatibility:
    - platforms:
        - Windows (Win64)
        - macOS
        - Linux
      requirements:
        - UE 5.2–5.8
---
## 作品简介

SimpleConfigExclude 是面向 UE 项目打包配置的编辑器插件。它在项目设置中列出 Config 目录下的 ini 文件，允许逐项选择默认、强制包含或排除，并把选择同步到打包使用的 Staging 规则。

被排除的文件也可按需复制到另一个目标目录，供后续部署使用。

## 背景与目标

同一个项目常有调试、测试和正式环境所需的不同配置。手工维护 DefaultGame.ini 中的包含和排除条目时，需要同时顾及文件路径、已有规则以及编辑器缓存。

插件的目标是让使用者逐个文件选择“哪些配置随包发布”，同时提供另行交付排除项的入口。

## 核心能力

### 三态配置选择

每个配置文件可设为 Default、Allowed 或 Disallowed。Default 跟随 UE 原有行为，Allowed 和 Disallowed 则分别对应明确的包含、排除意图。

项目设置中的列表来自 Config 目录扫描，便于对照实际文件检查遗漏项。

### Staging 规则同步

插件读取 DefaultGame.ini 的 Staging 区段，识别现有规则，并在状态调整后写回相应条目。写入前会处理版本控制签出或只读状态，写回后重新加载配置，使设置面板与磁盘内容保持对应。

因为这是项目配置文件变更，仍应纳入正常的版本审查。

### 排除文件复制

不随基础包发布、但某些部署环境仍需要的 ini 文件，可以通过工具复制到指定目录。复制目标和是否清理目标 Config 目录需要由使用者确认，输出文件也应按实际部署环境核对。

## 适用场景

适合把调试配置从正式包中排除，或为测试与生产环境准备不同配置集。项目可以先生成不含特定文件的基础包，再按环境另行处理被排除项；这种方式有助于把打包规则和部署步骤分开核查。

## 适用范围与边界

插件管理 Config 下 ini 文件的打包规则和复制动作。

排除配置不等于完成敏感信息保护，目标目录中的副本仍需按项目权限管理。状态调整会修改 DefaultGame.ini；发布前应检查实际包内容、复制目标及版本控制差异。
