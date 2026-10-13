---
title: Fab 提交经验：把发布包和使用说明一起检查
description: 功能在开发工程里能用，不等于交付包能安装和复现。这份记录提炼过去的 UE 内容发布经验，不介绍具体插件产品，也不声称代表当前 Fab 审核规则。
type: blog
slug: ue-fab-submission-notes
categoryId: ue
categoryName: UE
categoryOrder: 0
order: 0
status: 已发布
featured: false
date: 2026-10-13
publishedAt: 2026-10-13
draft: false
sitePublish: true
tags: []
productIds: []
workIds: []
docIds: []
lang: zh
translationKey: ue-fab-submission-notes
---

# Fab 提交经验：把发布包和使用说明一起检查

## 问题与适用范围
功能在开发工程里能用，不等于交付包能安装和复现。这份记录提炼过去的 UE 内容发布经验，不介绍具体插件产品，也不声称代表当前 Fab 审核规则。

## 先准备可复现的交付
给候选发布包单独留一份目录，避免清理开发目录。检查描述符里的版本、模块类型、加载阶段、内容支持和目标平台是否与实际交付一致。文档应说明安装位置、支持的引擎版本、依赖、最短使用步骤及已知限制；许可和第三方依赖也要随包说明。

在干净测试项目中安装候选包，按文档完成最小功能，再分别检查承诺的 Editor 和打包目标。源码交付与预编译交付需要的文件不同，不能一律删除 `Binaries`，也不能假设设置 `Installed: true` 就能解决纯蓝图项目的编译问题。需要额外打包文件时检查 `FilterPlugin.ini` 是否与实际输出一致。

## 商品页与描述符
商品页说明支持环境和用户能完成的任务，演示图来自候选版本。文档链接应是真实可访问的文档地址，不把一句文件位置说明冒充 URL。原笔记中的字符上限、`FabURL` 与 `MarketplaceURL` 的兼容处理属于当时遇到的问题，本篇不把它们写成当前必需规则；提交当天以平台表单、官方要求和实际验证反馈为准。

## 一个检查例与限制
把候选 ZIP 解压到临时项目，确认教程引用的文件存在，依赖已注明，版本与描述一致，并记录实际测试的引擎和平台。本文未进行新的 Fab 上传或平台规则核验，因此不能据此承诺审核通过。
