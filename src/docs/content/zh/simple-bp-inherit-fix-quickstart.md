---
title: 安装与首次修复
type: doc
slug: simple-bp-inherit-fix-quickstart
draft: false
sitePublish: true
tags:
  - 蓝图
  - 继承链
workIds:
  - simple-bp-inherit-fix
docPage:
  work: simple-bp-inherit-fix
  group: getting-started
  slug: quickstart
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-bp-inherit-fix/docs/quickstart/
lang: zh
translationKey: doc:simple-bp-inherit-fix:quickstart
---

## 安装与启用

安装：通过 Epic Games 启动器，将 SimpleBPInheritFix 安装到项目使用的 UE 版本。

启用：打开项目，在编辑器的插件窗口中查找并启用 SimpleBPInheritFix，按提示重启编辑器。

## 首次修复

先在可恢复的项目版本中确认异常：父蓝图的组件无法剪切或删除，或者子蓝图的组件修改影响了父蓝图。这些症状不一定都由同一个原因引起，可先阅读[可识别的异常](/zh/works/simple-bp-inherit-fix/docs/find-components/)。

1. 在内容浏览器中右键单击受影响的 Actor 蓝图，选择 **Component Repair → Fix Inheritance Pollution**。
2. 在输出日志中筛选 `LogSBIF`，查看发现的异常组件、涉及的蓝图以及签出和修复结果。修复会检查完整继承链，可能涉及父级与子级资产。
3. 核对待保存的蓝图，再手动保存。签出失败时先处理文件写入权限，不要把内存修复当作已经保存。

## 适用范围

插件处理组件模板的 `CreationMethod` 被错误标记为 `Instance` 的继承污染。非 Actor 蓝图、Construction Script 动态创建的组件，以及其他类型的蓝图错误不在此修复范围内。

详细的签出处理与修复说明见[修复继承组件](/zh/works/simple-bp-inherit-fix/docs/repair-components/)。
