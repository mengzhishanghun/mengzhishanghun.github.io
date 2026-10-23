---
title: 管理 Perforce 分支工作区与本地缓存
description: 用工作区池组织分支切换，区分服务端同步与离线目录接入，明确缓存保护和清理边界。
type: case
slug: perforce-workspace-pool
categoryId: desktop-automation
categoryName: 桌面与自动化
categoryOrder: 1
status: 开发案例
featured: false
draft: false
sitePublish: true
tags:
  - Perforce
  - 开发工具
productIds:
  - p4-stream-switcher
coverAlt: 管理 Perforce 分支工作区与本地缓存示意图
websiteCoverUrl: /assets/cases/perforce-workspace-pool.png
lang: zh
translationKey: perforce-workspace-pool
---

## 背景与约束

P4StreamSwitcher 面向多项目、多分支的 Perforce 开发环境。工作区数量需要控制，分支目录又可能包含 UE 的本地缓存；反复手动修改客户端配置，容易把工作区、流和本地目录的对应关系弄混。

本案例说明工具源码中的处理方案，适用范围为 Windows 和 `//depot/project/branch` 两层流结构。

## 问题拆分

切换目标分支包含几个不同动作：定位工作区、决定是否创建客户端、选择目录，以及判断目录应从服务器更新还是保留本地内容。把这些动作当成一次无条件同步，会忽略已有工作区和离线目录的区别。

池满时还需要回收客户端。只按名称删除，无法反映使用先后和已打开文件状态。

## 实现方案

工具用“标识_项目_分支”建立工作区身份，并按流保存目录、离线选项和待同步标记。已有工作区在无需同步时直接打开 P4V；手动改变 Root 或上次同步未完成时，重新进入同步流程。

工作区池以本机时间戳选择淘汰候选，删除前检查候选的已打开文件及 P4V 是否运行。标识冲突检查用于避免不同主机共用同一标识；普通自建工作区不按这个命名规则纳入池管理。

目录处理分为两条路径：普通模式先更新 have list，应用默认缓存保护和 .p4ignore 规则，清理多余文件，再下载内容不同或缺失的文件；离线模式更新 have list 后执行 reconcile，将本地新增、修改和删除放入默认 changelist，交给使用者检查。

## 结果与边界

该方案提供了工作区选择、数量管理和两种目录处理方式，并将日志与同步状态显示在界面中。它没有提供自动备份，也不能仅凭“没有已打开文件”证明磁盘上不存在未登记修改。

普通模式清理可能删除未忽略的本地额外文件，离线模式也会改变待提交记录。因此，目录选择和模式确认是使用前必须完成的步骤。这里不把源码中的能力描述当成生产环境测试结论，也不承诺缓存零损失或固定性能收益。

## 相关内容

- [P4StreamSwitcher 作品](</zh/works/p4-stream-switcher/>)
- [使用文档](</zh/docs/tools/p4-stream-switcher/>)
- [Python 切流工具博客](</zh/blog/python-perforce-stream-switch-safety/>)

## 相关需求

如果你的 Perforce 工作流涉及多个分支目录、本地缓存或离线目录接入，可以先查看 P4StreamSwitcher 及使用文档；需要适配现有命名、目录或切换规则时，也可以联系我讨论。

可以说明流结构、工作区数量和需要保留的本地内容，先核对同步、清理及待提交记录的处理边界。

有相关需求，欢迎[联系我聊聊](https://mzsh.me/zh/contact/)。
