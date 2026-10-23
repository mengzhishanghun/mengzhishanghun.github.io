---
title: P4StreamSwitcher
description: 管理 Perforce 流工作区池，在分支间切换、复用本地目录，并区分普通同步与离线目录接入。
type: work
slug: p4-stream-switcher
categoryId: open-source-tools
categoryName: 开源工具
categoryOrder: 1
order: 1
status: 源码公开
workInfo:
  channels:
    - kind: docs
      href: /docs/zh/tools/p4-stream-switcher/
  compatibility:
    - platforms:
        - Windows
      requirements:
        - Python 3.10+、Tkinter、P4Python、platformdirs
        - Perforce CLI、P4V 及有效服务器账户
        - 两层流结构 //depot/project/branch
featured: false
draft: false
sitePublish: true
tags:
  - Perforce
  - 版本控制
links:
  - label: 公开源码仓库
    href: https://github.com/MZSH-Tools/P4StreamSwitcher
coverAlt: P4StreamSwitcher示意图
websiteCoverUrl: /assets/covers/p4-stream-switcher.png
lang: zh
translationKey: p4-stream-switcher
---

## 作品简介

P4StreamSwitcher 是面向 Windows 的 Perforce 流工作区切换工具，使用 Python、Tkinter 和 P4Python。选择项目和分支后，工具按个人标识生成工作区名称，管理工作区数量，并打开对应的 P4V 客户端。

适用于 `//depot/project/branch` 形式的两层流结构。源码已公开，仓库尚未声明许可证。

## 解决的问题

多项目、多分支开发需要反复选择客户端和本地目录。为每个分支长期保留工作区，又会占用可用工作区数量。UE 项目还包含 Saved、Intermediate 和 DerivedDataCache 等本地缓存，目录复用时需要区分版本文件与缓存。

工具把工作区命名、目录缓存、池上限和同步方式放在同一界面，减少手动配置客户端的步骤。

## 核心能力

- 以“标识_项目_分支”命名工作区，检查跨主机标识冲突；保存新标识时可确认批量重命名旧工作区。
- 设置工作区池上限；达到上限后按本机时间戳选择最旧工作区，检查已打开文件与 P4V 进程后再尝试淘汰。
- 已有工作区在目录未手动改变且没有待同步标记时直接打开 P4V；需要同步时进入相应同步流程。
- 普通模式结合 have list、差异检测和忽略规则清理、下载文件；离线模式以本地目录为准，将差异 reconcile 到默认 changelist。
- 按流缓存目录和离线选项，支持创建 .p4config、设置 rmdir 和换行符，并显示状态与分级日志。

## 使用边界

普通同步会删除不在 have list 中且未被忽略规则保护的本地文件。使用已有目录前，应检查目录内容并备份需要保留的文件。离线模式会打开新增、修改和删除记录，需要在 P4V 中人工检查。

工作区池按命名格式管理当前主机、当前用户的工作区；这些检查不等同于完整的本地修改备份。工具不会代替用户提交变更，也没有测量数据支持固定的切换提速比例。

## 相关内容

- [使用文档](</zh/docs/tools/p4-stream-switcher/>)
- [工作区池开发案例](</zh/cases/perforce-workspace-pool/>)
- [Python 切流工具博客](</zh/blog/python-perforce-stream-switch-safety/>)
- [公开源码仓库](https://github.com/MZSH-Tools/P4StreamSwitcher)
