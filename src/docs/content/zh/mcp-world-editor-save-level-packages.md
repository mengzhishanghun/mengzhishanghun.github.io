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
  group: features
  slug: save-level-packages
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/save-level-packages/
lang: zh
translationKey: doc:mcp-world-editor:save-level-packages
---

## 选择并保存包

先用 `GetDirtyPackages` 找出要保存的包。只关心当前关卡时选 `CurrentLevel`，需要比较全部已加载脏包时选 `AllLoaded`。`CurrentLevel` 包含当前 Level 已加载的外部对象包，以及当前关卡单独存在且为 dirty 的 Map BuiltData 包。`SavePackages` 需要精确 `PackageNames`，默认 `DryRun=true`；先预览所选包的 `PlanHash`，再以 `DryRun=false` 和同一哈希执行。空包保存可能删除现有文件，须显式设置 `AllowDeleteEmptyPackages`。启用源控提供器时，此工具会拒绝本地写入。执行后逐包查看结果。若清单仍有 dirty 包，先核对这些包是否属于本次要保存的改动，再决定是否另做一次预览。旧 `SaveLevel` 无参数调用继续保存当前 Level 及引擎纳入的外部对象包，结果同时报告真实 Level 包路径和残留脏包。磁盘保存不属于编辑器 Undo。
