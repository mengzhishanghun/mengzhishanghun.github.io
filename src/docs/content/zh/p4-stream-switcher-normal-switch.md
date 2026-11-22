---
title: 普通切流与重新同步
type: doc
slug: p4-stream-switcher-normal-switch
draft: false
sitePublish: true
tags:
  - Perforce
  - 版本控制
workIds:
  - p4-stream-switcher
docPage:
  work: p4-stream-switcher
  group: switching
  slug: normal-switch
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/p4-stream-switcher/docs/normal-switch/
lang: zh
translationKey: doc:p4-stream-switcher:normal-switch
---

## 第一次普通切流

1. 输入并保存唯一的工作区标识。标识已被其他主机使用时，先换一个标识或与使用者协调。
2. 选择项目和分支，核对工作区名称。预览中的黑色表示已有工作区，灰色表示将创建。
3. 选择本地目录。使用已有目录前，先备份要保留的本地内容。若要以该目录里的文件为准，改用[离线目录模式](/zh/works/p4-stream-switcher/docs/offline-switch/)。
4. 检查池上限、.p4config、rmdir 和换行符设置。
5. 点击“切换并打开 P4V”，按提示确认默认目录或新建目录。
6. 在 P4V 中检查当前客户端与变更列表。

## 打开已有工作区与重新同步

已有工作区在目录未手动改变、没有待同步标记时直接打开 P4V，不执行文件同步。这不等于更新到服务器最新版本，后续更新可在 P4V 中处理。

如果手动改变已有工作区的目录，工具会更新服务器 Root 并执行同步；非手动路径与服务器不一致时以服务器 Root 为准。上次同步出错会保留待同步标记，下次切换重新尝试，应先查看日志和目录状态再重试。

## 普通同步的清理范围

新建工作区或需要同步时，工具配置客户端、更新 have list，然后读取 .p4ignore，清理多余文件，并用 diff -se 和 diff -sd 找出内容不同或缺失的文件，下载相应文件后打开 P4V。

这条流程会删除不在 have list 中、且未被忽略规则保护的本地文件，并可能覆盖目标版本不同的文件。不要把需要保留的唯一副本放入尚未检查的目标目录。

默认保护 Saved/、Intermediate/、DerivedDataCache/、Binaries/、.vs/、.vscode/、.idea/、.git/、.p4config 和 *.log。其他需要保留的文件可在根目录 .p4ignore 中添加规则：

```text
MyCache/
*.tmp
Config/Local/*
!keep.txt
```

以 / 结尾匹配目录名，普通规则可匹配文件名或路径，! 表示取消忽略。工具使用自身的模式匹配，不能把这些规则当成完整的备份保障。

## 项目、分支和同步排查

- 项目或分支未出现：确认权限及两层流结构，项目需有 mainline 流。
- 同步失败：查看错误日志，保留需保护的文件，解决连接、权限或路径问题后再重试。
