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
featured: false
draft: false
sitePublish: false
tags:
  - Perforce
  - 版本控制
links:
  - label: GitHub
    href: https://github.com/MZSH-Tools/P4CaseSync
lang: zh
translationKey: p4-case-sync
---

## 作品简介

P4CaseSync 在 Perforce 提交前检查已打开文件的路径大小写。它以本地磁盘上的真实路径为参照，核对指定 changelist 或 default 中的文件，并提供预览、人工微调和应用修正的入口。

目标是让将要提交的 Perforce 路径与实际目录和文件名称一致。

## 背景与目标

在 Windows 工作区中，路径大小写差异可能不影响本地文件访问，却会在 Perforce 路径、跨平台同步或后续协作中留下不一致。逐个打开文件核对目录层级容易遗漏。

工具把本地真实路径与已打开文件列表放在一起比较，让提交者先看清差异，再决定需要怎样修正。

## 核心能力

### 读取待提交文件

工具通过 Perforce CLI 获取指定 changelist 或 default 中的已打开文件。

检查只针对当前要处理的提交内容，便于在正式提交前核对路径，无需扫描整个仓库中的无关文件。

### 对照本地真实大小写

工具结合路径映射和本地磁盘目录，逐级检查文件路径的实际大小写。列表用颜色区分未变化、自动修正和人工修改，使用者可以集中查看需要处理的条目及修正后的目标路径。

### 人工调整与应用核验

自动建议之外，使用者可手动微调目标路径。应用修改后，工具再次检查一致性。

实际修正可能涉及 `p4 move`，因此列表中的目标路径应在执行前核实，执行后再按正常 Perforce 流程检查待提交内容。

## 适用场景

适用于 Windows 与其他区分大小写的平台共同维护同一 Perforce 项目，或在提交前发现文件、目录名称与 Perforce 记录不一致的情况。

对一次包含多个路径变化的 changelist，集中预览更容易发现漏项。

## 适用范围与边界

工具依赖可用的 Perforce CLI、正确的工作区映射和登录状态。

路径修正属于版本控制操作，可能改变已打开文件的记录；应在应用前核对目标列表，并在应用后复查 changelist。它只处理路径一致性，不替代内容评审或提交权限检查。
