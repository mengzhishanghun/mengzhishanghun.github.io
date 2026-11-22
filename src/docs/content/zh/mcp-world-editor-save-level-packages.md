---
title: 保存关卡包
type: doc
slug: mcp-world-editor-save-level-packages
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
docPage:
  work: mcp-world-editor
  group: levels
  slug: save-level-packages
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/save-level-packages/
lang: zh
translationKey: doc:mcp-world-editor:save-level-packages
---

## 选择并保存包

`GetDirtyPackages` 可按 `CurrentLevel` 或 `AllLoaded` 范围列出已加载脏包；`CurrentLevel` 包含当前 Level 已加载的外部对象包，以及当前关卡单独存在且为 dirty 的 Map BuiltData 包。`SavePackages` 需要精确 `PackageNames`，默认 `DryRun=true`；先预览所选包的 `PlanHash`，再以 `DryRun=false` 和同一哈希执行。空包保存可能删除现有文件，须显式设置 `AllowDeleteEmptyPackages`。启用源控提供器时，本地保存合同会拒绝实际写入；保存结果逐包报告，并列出仍为 dirty 的包。旧 `SaveLevel` 无参数调用继续保存当前 Level 及引擎纳入的外部对象包，结果同时报告真实 Level 包路径和残留脏包。磁盘保存不属于编辑器 Undo。
