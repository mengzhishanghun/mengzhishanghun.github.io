---
title: P4CaseSync
description: 在提交前对照本地真实路径，检查并修正 Perforce 已打开文件的路径大小写。
type: work
slug: p4-case-sync
categoryId: open-source-tools
categoryName: 开源工具
categoryOrder: 1
order: 0
status: 正式文档
workInfo:
  channels:
    - kind: open-source
      href: https://github.com/MZSH-Tools/P4CaseSync
    - kind: docs
      href: /zh/works/p4-case-sync/docs/setup/
featured: false
draft: false
sitePublish: false
tags:
  - Perforce
  - 版本控制
links:
  - label: GitHub
    href: https://github.com/MZSH-Tools/P4CaseSync
docIds:
  - p4-case-sync-setup
  - p4-case-sync-check-and-fix
  - p4-case-sync-build-and-environment
  - p4-case-sync-reuse-environment
  - p4-case-sync-updates-2025-10-16
coverAlt: P4CaseSync封面
websiteCoverUrl: /media/imported/works/p4-case-sync-cover-v2.png
lang: zh
translationKey: p4-case-sync
---

## 作品简介

P4CaseSync 用于在 Perforce 提交前核对文件路径的大小写。选定 changelist 或使用 `default` 后，工具会用本地磁盘上的实际路径检查其中已打开的文件。先预览建议，必要时手动调整，再应用修正。

目标是让将要提交的 Perforce 路径与实际目录和文件名称一致。

## 背景与目标

在 Windows 工作区中，路径大小写差异可能不影响本地文件访问，却会在 Perforce 路径、跨平台同步或后续协作中留下不一致。逐个打开文件核对目录层级容易遗漏。

工具把本地真实路径与已打开文件列表放在一起比较，让提交者先看清差异，再决定需要怎样修正。

## 核心能力

### 读取待提交文件

工具通过 Perforce CLI 获取指定 changelist 或 default 中的已打开文件。

检查只针对当前要处理的提交内容，便于在正式提交前核对路径，无需扫描整个仓库中的无关文件。

### 对照本地真实大小写

对照本地真实目录逐级检查大小写，并集中预览建议路径与人工调整结果。

### 人工调整与应用核验

自动建议之外，使用者可手动微调目标路径。应用修改后，工具再次检查一致性。

实际修正可能涉及 `p4 move`，因此列表中的目标路径应在执行前核实，执行后再按正常 Perforce 流程检查待提交内容。

## 适用场景

适用于 Windows 与其他区分大小写的平台共同维护同一 Perforce 项目，或在提交前发现文件、目录名称与 Perforce 记录不一致的情况。

对一次包含多个路径变化的 changelist，集中预览更容易发现漏项。

## 适用范围与边界

工具依赖可用的 Perforce CLI、正确的工作区映射和登录状态。

路径修正属于版本控制操作，可能改变已打开文件的记录；应在应用前核对目标列表，并在应用后复查 changelist。它只处理路径一致性，不替代内容评审或提交权限检查。

操作步骤和参数说明见 [使用教程](/zh/works/p4-case-sync/docs/check-and-fix/)。

## 许可证

MIT License

## 反馈与贡献

感谢所有使用与反馈 **P4CaseSync** 的开发者。遇到问题欢迎提 Issue，或提交 PR 参与改进。
