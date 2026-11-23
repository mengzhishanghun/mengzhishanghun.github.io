---
title: 查找插件与依赖
type: doc
slug: plugin-manager-find
draft: false
sitePublish: true
tags:
  - UnrealEngine
  - 插件
  - 依赖分析
workIds:
  - plugin-manager
docPage:
  work: plugin-manager
  group: features
  slug: find
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/plugin-manager/docs/find/
lang: zh
translationKey: doc:plugin-manager:find
---

## 按来源筛选

插件按来源分为 **项目**（项目 `Plugins` 目录）、**商城**（通过 Fab 安装）和 **引擎**（UE 自带）三个标签页，各页会显示实时数量。

![UEPluginManager 引擎插件列表](/media-occurrence/doc%3Aplugin-manager%3Afind%3Amedia%3A1)

在示例工程 DocsDemo 中选择“引擎”标签页，可按名称、作者、分类和状态浏览已安装的引擎插件。

## 搜索、排序与依赖

打开相应标签页，在搜索框中输入名称、作者、分类、描述、依赖项或依赖它的插件的关键词。搜索不区分大小写；用空格分隔多个词时，结果必须匹配所有词。

点击列标题排序，箭头显示当前排序方向。选中插件可查看详情、它依赖的插件和依赖它的插件。同名项会显示红色的 **冲突** 状态。

![UEPluginManager 搜索 EnhancedInput 并查看依赖](/media-occurrence/doc%3Aplugin-manager%3Afind%3Amedia%3A2)

输入 EnhancedInput 后选中插件，右侧会显示它的描述、依赖插件以及依赖它的插件。图中读取的是 UE 5.7 的本地插件信息。
