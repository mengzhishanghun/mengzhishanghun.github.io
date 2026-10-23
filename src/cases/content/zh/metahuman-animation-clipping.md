---
title: 处理 MetaHuman 头身动画叠加时的穿模
description: 调整头部动画的 Additive Settings，并通过脚本蓝图批量处理同类动画设置。
type: case
slug: metahuman-animation-clipping
categoryId: ue-projects
categoryName: UE项目
categoryOrder: 0
order: 9
status: 已完成
featured: false
draft: false
sitePublish: true
tags:
  - MetaHuman
  - 动画
  - 批量处理
coverAlt: 头部与身体动画经 Additive Settings 调整后进行预览核对的流程
websiteCoverUrl: /assets/cases/metahuman-animation-clipping.png
lang: zh
translationKey: metahuman-animation-clipping
---

## 背景介绍

在参与 MetaHuman 项目时，我遇到头部与身体同时播放不同动画后，脖子附近出现穿模的问题。我先调整头部动画资产的设置，再将同类设置整理为批量操作。

单个动画的处理方法参考了公开教程。我在 UE 5.6 中实际使用过，并通过脚本蓝图批量处理同类设置。

## 复现环境

场景使用 Unreal Engine 5.6 与 MetaHuman，头部和身体分别播放动画。原始记录中，LevelSequence 暂时没有观察到相同问题。

参考视频基于 UE 5.2，实际项目使用 UE 5.6。这次项目验证不能代表所有版本与动画组合的结果。

## 具体问题

头身动画同时播放时，脖子附近出现穿模，影响角色外观的连贯性。现象与头部动画的叠加设置有关，需要检查动画资产，而不只关注角色场景中的播放操作。

同类动画较多时，逐个打开资产修改相同设置耗时，也容易遗漏，需要把重复处理整理为批量步骤。

## 解决方案

处理方法参考了《Combine Face and Body Animations - Metahumans in Unreal Engine 5.2》，可[查看参考视频](https://www.youtube.com/watch?v=ddQKMTKGpTE)。先打开对应头部动画的 Asset Details，调整 Additive Settings。

原始截图中的设置为：`Additive Anim Type` 选择 `Mesh Space`，`Base Pose Type` 选择 `Frame from this animation`，`Ref Frame Index` 为 `0`。这些值对应记录中的头部动画处理场景，应用到其他动画前仍应检查适用性。

在单个动画设置确认后，通过脚本蓝图组织批量修改。脚本蓝图的创建、设置、运行函数及效果截图，可[查看批量处理步骤](https://mzsh.me/blog/cnblogs-19136316/)。


该方法在 UE 5.6 中亲测可用；同类动画设置可通过批量处理，减少逐个修改的重复操作。

这一结果针对头身分别播放动画时观察到的脖子穿模；LevelSequence 的记录只是当时未发现同样现象，不能据此推断所有播放路径均已验证。

## 相关需求

如果你的 MetaHuman 在头身动画叠加时出现穿模，或需要批量调整动画资产设置，我可以协助核对播放方式、动画叠加设置与批量处理流程。

可以提供引擎版本、动画来源和问题视频，先确认是否与本案例属于同类问题。

有相关需求，欢迎[联系我聊聊](https://mzsh.me/zh/contact/)。
