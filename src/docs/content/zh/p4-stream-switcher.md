---
title: P4StreamSwitcher 使用文档
description: 安装与配置 P4StreamSwitcher，管理流工作区、普通同步、离线目录及工作区回收。
type: doc
slug: p4-stream-switcher
categoryId: open-source-tools
categoryName: 开源工具
categoryOrder: 1
draft: false
sitePublish: true
tags:
  - Perforce
  - 版本控制
workIds:
  - p4-stream-switcher
documentKind: product-manual
websiteRoute: /docs/zh/tools/p4-stream-switcher/
lang: zh
translationKey: p4-stream-switcher
---

# P4StreamSwitcher 使用文档

P4StreamSwitcher 用于在 Windows 上选择 Perforce 流工作区并打开 P4V。仅适用于 `//depot/project/branch` 形式的两层流结构。

## 安装与连接

准备 Windows、带 Tkinter 的 Python 3.10 或更高版本、Perforce CLI 和 P4V。服务器账户需有访问目标流、创建和删除客户端所需的权限，并完成登录。当前主机至少应有一个属于当前用户的流客户端，Host 为当前主机，且关联 Stream。

从[公开源码仓库](https://github.com/MZSH-Tools/P4StreamSwitcher)取得文件后，在项目目录安装依赖并启动：

```powershell
python -m pip install p4python platformdirs
python Main.py
```

启动前，在自己的 Perforce 环境中配置 P4PORT、P4USER，并用正常登录流程建立有效会话。工具连接失败时检查服务器、账户及网络；没有可用流客户端时，先在 P4V 中完成客户端配置。

仓库尚未声明许可证，公开可读不代表获得任意再分发或商用授权。

## 功能与设置

| 功能 | 用法与影响 |
| --- | --- |
| 工作区标识 | 输入个人标识并点击保存，生成“标识_项目_分支”；O 表示有效，X 表示为空或冲突。更换标识时，确认提示可能批量重命名旧工作区。 |
| 最大工作区 | 设置池上限，最小为 1，默认 5；已满时尝试回收最旧工作区。 |
| 项目与分支 | 项目列表来自 mainline 流，分支列表来自所选项目；不支持任意深度流结构。 |
| 名称预览 | 黑色表示已有工作区，灰色表示待创建。 |
| 工作区目录 | 点击选择目录；按流缓存路径，界面区分路径来源，自动生成的默认路径需要确认。 |
| 离线目录 | 需要接入已有本地文件时选择；差异会 reconcile 到默认 changelist。 |
| 创建 P4CONFIG | 默认启用，切换时创建或更新根目录 .p4config，写入服务器、用户、客户端。其他命令要读取它，仍需相应的 P4CONFIG 环境配置。 |
| 自动删除空文件夹 | 默认启用；修改时会更新当前标识下本地工作区的 rmdir 选项，同步时清理空目录。 |
| 换行符 | 选择 local、unix、mac、win 或 share，默认 win，按团队客户端规范选择；设置会保存并用于新建工作区；启动时还会按保存值检查并修正当前标识下已有本地工作区的换行符。 |
| 删除工作区 | 删除所选服务器客户端并清理对应本地缓存记录；确认前核对名称，有已打开文件时会阻止删除。 |
| 状态与日志 | 查看服务器、用户、已用/最大工作区数、进度及信息、警告、错误日志。 |

## 第一次切换

1. 输入并保存唯一的工作区标识。标识已被其他主机使用时换一个标识，或先与使用者协调。
2. 选择目标项目、分支，核对生成的工作区名称。
3. 选择本地目录，确认要使用普通模式还是离线模式。使用已有文件夹前先备份需要保留的本地内容。
4. 检查池上限、.p4config、rmdir 和换行符设置。
5. 点击“切换并打开 P4V”，按提示确认默认目录或新建目录。
6. 在 P4V 中检查当前客户端与变更列表，再继续正常开发流程。

## 已有工作区与重新同步

已有工作区在目录未手动改变、没有待同步标记时直接打开 P4V，不执行文件同步。这不等于更新到服务器最新版本，后续更新可在 P4V 中处理。

如果手动改变已有工作区的目录，工具会更新服务器 Root 并执行同步；非手动路径与服务器不一致时以服务器 Root 为准。上次同步出错会保留待同步标记，下次切换重新尝试，应先查看日志和目录状态再重试。

## 普通模式

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

## 离线目录模式

在需要接入已有本地目录时勾选“离线目录”，确认目录后切换。工具创建客户端或进入待同步流程后，先更新 have list，再以本地文件为准执行 reconcile，将新增、修改和删除放入默认 changelist。

完成后在 P4V 中逐项检查差异，按项目流程决定提交或撤销。工具不会自动提交。仅勾选离线选项不会强制一个无需同步的已有工作区重新 reconcile。

## 工作区回收与删除

池满时按本机保存的使用时间戳选择最旧客户端。候选有已打开文件，或检测到 P4V 正在运行时，自动回收会停止；先检查并处理变更，必要时关闭 P4V 后再操作。不要为通过检查盲目撤销工作。

“删除工作区”是单独入口，会弹出确认并检查已打开文件；它不包含自动回收路径中的 P4V 运行检查，使用前自行关闭相关会话。删除的是服务器客户端及工具缓存记录，不是清空整个本地目录。

池管理限于当前用户、当前主机、符合命名规则的工作区。未登记到 Perforce 的本地修改仍需自行保护。

## 配置保存与常见问题

工具在用户缓存目录保存标识、池上限、选项、使用时间戳，以及每个流的目录、离线选项和同步状态。Windows 通常位于 %LOCALAPPDATA% 下；不要把这些本机记录作为项目共享配置。

- 连接失败：检查 P4PORT、P4USER、登录状态和服务器可达性。
- 未检测到流客户端：在 P4V 中确认客户端属于当前用户、Host 为当前主机并关联 Stream。
- 提示标识未保存：点击保存，再执行切换；处理可能出现的重命名提示。
- 项目或分支未出现：确认权限及两层流结构，项目需有 mainline 流。
- 同步失败：查看错误日志，保留需保护的文件，解决连接、权限或路径问题后再重试。

## 相关内容

- [作品介绍](</zh/works/p4-stream-switcher/>)
- [开发案例](</zh/cases/perforce-workspace-pool/>)
- [Python 切流工具博客](</zh/blog/python-perforce-stream-switch-safety/>)
