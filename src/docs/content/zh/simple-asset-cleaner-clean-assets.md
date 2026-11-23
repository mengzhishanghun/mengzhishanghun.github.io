---
title: 清理未引用资产
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
  group: features
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

如果只想整理这次待提交的新资产，用提交时的自动清理。右键清理的范围虽由选区决定，处理已跟踪文件时仍会删除文件；确认选择前，先区分候选中哪些是新添加项、哪些已经受版本控制。

在 Content Browser 选中一个或多个资产或文件夹，右键打开 **Simple Asset Cleaner**，选择 **清理未引用资产**。检查弹窗候选并勾选要处理的文件。

## 扫描整个项目

全量清理适合定期维护、接手旧项目或重大版本迭代前整理。全量清理会删除已提交的未引用文件。先通知团队，确认有可恢复的版本，再在测试分支试运行。

1. 打开 `Editor > Project Settings > General > Simple Asset Cleaner`。
2. 点击 `Clean All Source Control Assets`，等待进度条完成。
3. 查看日志，确认清理了哪些资产。

## 清理结果

| 资产状态 | 提交时自动清理 | 右键清理选定资产 | 手动全量清理 |
| --- | --- | --- | --- |
| 新添加的未引用资产 | 还原，保留本地副本 | 还原，保留本地副本 | 还原，保留本地副本 |
| 已跟踪的未引用资产 | 不处理 | 删除（服务器和本地） | 删除已提交的未引用资产（服务器和本地） |
| 被引用的资产 | 正常提交 | 保留 | 保留 |
| 插件和引擎资产 | 不处理 | 不处理 | 不处理 |
