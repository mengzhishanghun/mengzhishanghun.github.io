---
title: SimpleAssetCleaner
description: 根据根资源与引用关系识别候选未引用资产，提供提交时处理与全量清理入口。
type: work
slug: simple-asset-cleaner
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
order: 7
status: 正式文档
featured: false
draft: false
sitePublish: false
tags:
  - 资产管理
  - 引用分析
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19183435
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/19183435
docIds:
  - simple-asset-cleaner-guide
sourceDate: 2025-11-01
lang: zh
translationKey: simple-asset-cleaner
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/listings/b0cf0a4d-c1a2-45f6-8bfb-7a92313379c2
    - kind: docs
      href: /docs/zh/guides/ue-tools/simple-asset-cleaner-guide/
  compatibility:
    - platforms:
        - Windows (Win64)
        - macOS
        - Linux
      requirements:
        - UE 5.2–5.8
---
## 作品简介

SimpleAssetCleaner 为 Unreal Engine 项目提供基于引用关系的候选未引用资产检查。它从配置的根资源出发追踪直接与间接引用，在提交阶段处理候选文件，也提供面向整个受版本控制项目的清理入口。

判断结果取决于根资源与保护路径如何设置，因此它适合配合项目资产管理规则使用。

## 背景与目标

制作过程中会留下测试材质、蓝图或其他暂时未被场景引用的资源。仅看文件名和目录，很难判断它们是否仍被核心内容间接依赖。

工具从项目认定的重要资源出发，确定可检查的引用范围，让团队在提交或集中清理前看到候选项，也提供特殊资源的配置入口。

## 核心能力

### 配置引用分析的起点

可按根资源类型、自定义根资源和附加根路径确定保留范围。默认根类型包含地图资源；项目也可将重要蓝图、数据资产或指定目录纳入根与保护范围。

工具沿这些起点追踪引用链，未落在链上的资源才进入候选集合。根配置越贴近项目实际使用方式，候选结果越有参考价值。

### 提交阶段处理候选文件

启用自动清理后，插件在提交过程中检查版本控制中的新增资产。候选未引用的新增文件会从提交列表回滚，本地文件仍保留，便于开发者检查后再决定去留。

这一入口针对日常提交，不会将所有历史文件从磁盘删除。

### 全量清理与日志

全量清理入口面向已纳入版本控制的资产，扫描结果可通过日志查看。与提交阶段的回滚不同，它可能把已提交的未引用资源从版本控制及本地删除。

详细日志选项便于首次配置时核对处理过程和候选范围。

## 适用场景

适用于需要控制 UE 项目资产积累、在日常提交时检查测试资源，或在版本维护阶段集中核对历史资源的团队。

资源目录较多、存在间接引用时，先明确根资源和保护路径，有助于避免仅凭目录名称作判断。

## 适用范围与边界

引用分析以已配置的根为前提。没有纳入根或保护路径、却仍由业务在特殊流程中使用的资产，需要项目自行识别并补充配置。

全量清理可能删除已提交文件，应在可恢复版本上核对日志与结果，再用于正式项目。
