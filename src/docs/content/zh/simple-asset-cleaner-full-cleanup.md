---
title: 手动全量清理
type: doc
slug: simple-asset-cleaner-full-cleanup
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
  slug: full-cleanup
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/simple-asset-cleaner/docs/full-cleanup/
lang: zh
translationKey: doc:simple-asset-cleaner:full-cleanup
---

## 扫描整个项目

全量清理适合定期维护、接手旧项目或重大版本迭代前整理。它会删除已提交的未引用文件。先确认版本控制中有可恢复的提交，在测试分支试运行，并提前告知团队。

1. 打开 `Editor > Project Settings > General > Simple Asset Cleaner`。
2. 点击 `Clean All Source Control Assets`，等待进度条完成。
3. 查看日志，确认清理了哪些资产。

## 清理结果

| 资源状态 | 自动清理（提交时） | 手动全量清理 |
| --- | --- | --- |
| 新添加的未引用资源 | 回滚（本地保留） | 回滚（本地保留） |
| 已提交的未引用资源 | 不处理 | 删除（服务器+本地） |
| 被引用的资源 | 正常提交 | 保留 |
| 插件和引擎资源 | 不处理 | 不处理 |
