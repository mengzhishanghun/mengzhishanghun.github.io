---
title: 提交时清理未引用资产
type: doc
slug: simple-asset-cleaner-clean-assets
draft: false
sitePublish: true
tags:
  - 资产管理
  - 引用分析
workIds:
  - simple-asset-cleaner
docPage:
  work: simple-asset-cleaner
  group: cleanup
  slug: clean-assets
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-asset-cleaner/docs/clean-assets/
lang: zh
translationKey: doc:simple-asset-cleaner:clean-assets
---

## 识别未引用资产

插件只分析项目 `/Content/`（`/Game/`）下的资产，不处理插件资产（如 `/PluginName/Content/`）、引擎资产、C++ 源文件或头文件，也不处理 `/Content/` 之外的引用。地图、蓝图、数据资产等可作为根。根及其直接或间接引用会保留；无法从任一根到达的资产才是清理候选。

## 提交时自动清理

`Enable Auto Clean` 默认开启。创建资产并执行 **Add to Source Control** 后打开提交窗口。插件会检查新添加的文件，还原未引用的文件并保留本地副本；已跟踪的文件不受影响。

例如，10 个试作材质中只有 2 个被场景引用，另外 8 个会从待提交列表还原，仍可在本地使用。

## 右键清理选定资产

在 Content Browser 选中一个或多个资产或文件夹，右键打开 **Simple Asset Cleaner**，选择 **清理未引用资产**。检查弹窗候选并勾选要处理的文件。

## 自动和右键清理的差别

| 资产状态 | 提交时自动清理 | 右键"清理未引用资产" |
|---------|--------------|-------------------|
| 新添加 | 还原，**本地保留** | 还原，**本地保留** |
| 已跟踪 | 不处理 | **删除（服务器 + 本地）** |
