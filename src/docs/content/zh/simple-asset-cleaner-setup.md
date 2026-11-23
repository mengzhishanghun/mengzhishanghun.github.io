---
title: 安装并配置版本控制
type: doc
slug: simple-asset-cleaner-setup
draft: false
sitePublish: true
tags:
  - 资产管理
  - 引用分析
workIds:
  - simple-asset-cleaner
docPage:
  work: simple-asset-cleaner
  group: getting-started
  slug: setup
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-asset-cleaner/docs/setup/
lang: zh
translationKey: doc:simple-asset-cleaner:setup
---

## 安装并启用插件

1.  将插件文件夹复制到项目的 `Plugins` 目录
    
    ```
    YourProject/
    └── Plugins/
        └── SimpleAssetCleaner/
    ```
    
2.  打开项目，在 `Edit > Plugins` 中搜索 `SimpleAssetCleaner`
    
3.  勾选启用，重启编辑器

## 选择版本控制提供者

在 `Editor > Preferences > Source Control` 中选择项目实际使用的提供者。插件通过 UE API 接入 Perforce、Git、Subversion、Plastic SCM 等 UE 支持的系统，并在后台自动包装提供者，以便在提交时检查资产。不要手动选择 `Perforce_Proxy`、`Git_Proxy` 或其他以 `_Proxy` 结尾的代理。

![](/media-occurrence/doc%3Asimple-asset-cleaner%3Asetup%3Amedia%3A1)

## 打开项目设置

打开 **编辑器 > 项目设置 > General > Simple Asset Cleaner**。`Language` 默认是 English，切换中文后界面和日志立即更新，无需重启。

![](/media-occurrence/doc%3Asimple-asset-cleaner%3Asetup%3Amedia%3A2)

## 首次提交前检查

第一次检查时，选一项明确引用的资产和一项写明要保留的根资产作为对照；如果其中任何一项出现在清理候选里，先确认根配置和引用链，再继续提交。

先确认要保留的根资产和目录。默认以地图为根，不清理项目外的插件和引擎资产。检查设置后再使用 `Enable Auto Clean`；首次可在测试分支打开提交窗口，检查候选的处理结果。使用 `Clean All Source Control Assets` 可扫描整个项目，这个入口可能删除本地及版本控制中的文件。

## 详细日志

`Enable Verbose Logging` 默认关闭。首次试用或排查异常时，在项目设置中打开它，即可查看扫描文件、未引用候选、清理操作和引用链。不再需要时关闭。
