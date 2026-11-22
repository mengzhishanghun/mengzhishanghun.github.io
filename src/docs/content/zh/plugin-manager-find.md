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
  group: workflows
  slug: find
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/plugin-manager/docs/find/
lang: zh
translationKey: doc:plugin-manager:find
---

UE 插件管理工具，统一管理 UE 项目及其关联引擎中的所有插件。

## 功能

### 插件浏览
- **自动扫描** - 扫描项目、商城（Marketplace）、引擎插件
- **标签分类** - 插件按来源分为三个标签页：
  - **项目** - 项目 Plugins 目录下的插件
  - **商城** - 通过 Fab 下载安装的插件
  - **引擎** - UE 引擎自带的插件
- **分类管理** - 标签页实时显示各分类数量
- **引擎识别** - 支持安装版（注册表）和源码版（GUID）引擎
- **搜索过滤** - 按名称/作者/分类/描述/依赖/被依赖搜索
  - 不区分大小写
  - 支持空格分隔多关键词（同时匹配）
- **排序** - 点击列标题排序，箭头指示排序方向
- **依赖分析** - 查看插件依赖和被依赖关系
- **冲突检测** - 同名插件冲突时显示红色"冲突"状态

## 使用

1. 下载 Release 中的 `UEPluginManager.exe`，放入 UE 项目目录下运行
2. 工具自动扫描项目和引擎插件
3. 使用搜索框和标签页定位插件
4. 点击插件查看详情和依赖关系
5. 使用右侧按钮管理插件状态
