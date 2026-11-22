---
title: 使用离线目录切流
type: doc
slug: p4-stream-switcher-offline-switch
draft: false
sitePublish: true
tags:
  - Perforce
  - 版本控制
workIds:
  - p4-stream-switcher
docPage:
  work: p4-stream-switcher
  group: switching
  slug: offline-switch
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/p4-stream-switcher/docs/offline-switch/
lang: zh
translationKey: doc:p4-stream-switcher:offline-switch
---

## 用本地文件切换并检查差异

在需要接入已有本地目录时勾选“离线目录”，确认目录后切换。工具创建客户端或进入待同步流程后，先更新 have list，再以本地文件为准执行 reconcile，将新增、修改和删除放入默认 changelist。

完成后在 P4V 中逐项检查差异，按项目流程决定提交或撤销。工具不会自动提交。仅勾选离线选项不会强制一个无需同步的已有工作区重新 reconcile。
