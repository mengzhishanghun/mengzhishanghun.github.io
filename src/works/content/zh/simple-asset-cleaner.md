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
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/listings/b0cf0a4d-c1a2-45f6-8bfb-7a92313379c2
    - kind: docs
      href: /zh/works/simple-asset-cleaner/docs/setup/
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
  - 引用分析
  - Simple 系列
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/19183435
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/19183435
docIds:
  - simple-asset-cleaner-setup
  - simple-asset-cleaner-clean-assets
  - simple-asset-cleaner-protect-assets
  - simple-asset-cleaner-add-dependencies
coverAlt: SimpleAssetCleaner封面
websiteCoverUrl: /media/covers/works/simple-asset-cleaner-20261101.webp
sourceDate: 2025-11-01
lang: zh
translationKey: simple-asset-cleaner
---

## 作品简介

SimpleAssetCleaner 从指定的根资产出发，沿直接和间接引用查找 Unreal Engine 项目中可能不再使用的资产。你可以在提交时处理新增候选，也可以扫描整个受版本控制的项目。

判断结果取决于根资源与保护路径如何设置，因此它适合配合项目资产管理规则使用。

## 背景与目标

制作过程中会留下测试材质、蓝图或其他暂时未被场景引用的资源。仅看文件名和目录，很难判断它们是否仍被核心内容间接依赖。

工具从项目认定的重要资源出发，确定可检查的引用范围，让团队在提交或集中清理前看到候选项，也提供特殊资源的配置入口。

## 核心能力

### 配置引用分析的起点

按项目设定的根资源和保护目录追踪引用链，再把未覆盖的资源列为候选。保留范围需要结合项目实际使用方式配置。

默认以地图（`UWorld`）为根。可以在 `Root Asset Classes` 增加根资产类型，在 `Custom Root Assets` 指定个别资源，或在 `Additional Root Paths` 保护整个目录。根资产直接引用的资产，以及沿引用链找到的项目资产，都会保留。

### 提交阶段处理候选文件

启用自动清理后，插件在提交过程中检查版本控制中的新增资产。候选未引用的新增文件会从提交列表回滚，本地文件仍保留，便于开发者检查后再决定去留。

这一入口针对日常提交，不会将所有历史文件从磁盘删除。

### 全量清理与日志

全量清理入口面向已纳入版本控制的资产，扫描结果可通过日志查看。与提交阶段的回滚不同，它可能把已提交的未引用资源从版本控制及本地删除。

详细日志选项便于首次配置时核对处理过程和候选范围。

只想检查少量文件时，可在内容浏览器中右键选中的资产或文件夹，在弹窗中核对并勾选候选项。和全量清理一样，右键清理可能删除已跟踪的未引用资产；尚未提交的新资产会还原并保留本地副本。

## 适用场景

适用于需要控制 UE 项目资产积累、在日常提交时检查测试资源，或在版本维护阶段集中核对历史资源的团队。

资源目录较多、存在间接引用时，先明确根资源和保护路径，有助于避免仅凭目录名称作判断。

## 使用流程

1. 启用插件并重启编辑器。在源代码管理设置中选用项目实际的提供者；插件会自动包装它，不用手动选择带 `_Proxy` 后缀的项。
2. 确认根资产和保护目录。例如，若地图引用材质，材质又引用纹理，两个资源都会保留。工具只清理项目 `/Content/`（`/Game/`）下的资产；插件、引擎资产和 C++ 文件不在范围内。
3. 首次在测试分支试用，开启 `Enable Verbose Logging` 查看候选和引用链。提交时也可检查尚未纳入版本控制的依赖，在弹窗确认要添加的文件；这和清理未引用资产是两项独立操作。

![](/media-occurrence/work%3Asimple-asset-cleaner%3Amedia%3A1)

[查看依赖检查步骤](/zh/works/simple-asset-cleaner/docs/add-dependencies/)

## 适用范围与边界

引用分析以已配置的根为前提。没有纳入根或保护路径、却仍由业务在特殊流程中使用的资产，需要项目自行识别并补充配置。

全量清理可能删除已提交文件，应在可恢复版本上核对日志与结果，再用于正式项目。

操作步骤和参数说明见 [使用教程](/zh/works/simple-asset-cleaner/docs/setup/)。

## 版本与使用支持

支持 Unreal Engine 5.2–5.8。已在 Windows 上测试，其他平台为理论兼容。报告问题时请附上引擎版本、版本控制系统、设置截图和启用详细日志后的输出。

如有使用问题或合作需求，请前往联系页面。

- **联系入口：** [联系与合作](https://mzsh.me/contact/)

## 文档出处

原文于 2025-11-01 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/19183435)。
