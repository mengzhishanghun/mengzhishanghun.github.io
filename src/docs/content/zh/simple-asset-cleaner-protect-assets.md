---
title: 配置根资产与保护范围
type: doc
slug: simple-asset-cleaner-protect-assets
draft: false
sitePublish: true
tags:
  - 资产管理
  - 引用分析
workIds:
  - simple-asset-cleaner
docPage:
  work: simple-asset-cleaner
  group: protection
  slug: protect-assets
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-asset-cleaner/docs/protect-assets/
lang: zh
translationKey: doc:simple-asset-cleaner:protect-assets
---

## 按资产类型保护

在 `Root Asset Classes` 中指定根资产类型，默认是 `UWorld`（`.umap` 地图）。按项目需要可加 `UBlueprint`、`UDataAsset` 或 `UDataTable`，例如保留作为核心资产的 GameMode、PlayerController 或配置数据。这里也会匹配父类和派生类。

## 单独指定根资产

在 `Custom Root Assets` 中列出类型规则未覆盖的关键资产，如 `/Game/Core/GameMode.GameMode`、`/Game/Core/MainGameMode` 或 `/Game/Config/GlobalSettings`。

## 按目录保护

在 `Additional Root Paths` 中列出要保护的目录，如 `/Game/Core/`、`/Game/Config/`、`/Game/Managers/` 或 `/Game/Essential/`。目录内的所有资产及其引用都会保留。

## 追踪根资产的引用

根资产和从根直接或间接引用的项目资产会保留。下例的地图是根，引用链上的材质、纹理和蓝图都不清理。插件和引擎资产、C++ 文件以及项目 `/Content/` 以外的内容不在清理范围内。

```
地图 A (根资源)
  ├─ 引用了材质 M1
  │   └─ 引用了纹理 T1 ✅ 保留
  └─ 引用了蓝图 BP1
      └─ 引用了材质 M2 ✅ 保留

材质 M3 ❌ 未被任何根资源引用 → 清理
```

## 团队配置与首次试用

先保护关键地图、蓝图、配置数据和目录，再逐步增补类型。把团队共用设置纳入版本控制，并随项目迭代复查。首次可在测试分支试用并打开详细日志；全量清理前要有可回滚的提交。
