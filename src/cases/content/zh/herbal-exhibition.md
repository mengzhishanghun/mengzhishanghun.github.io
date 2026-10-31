---
title: 中药展示
description: 基于 UE 的中药交互展示项目，整合药材检索、图文与语音资料、三维模型、显微切片及外部内容维护。
type: case
slug: herbal-exhibition
categoryId: ue-projects
categoryName: UE项目
categoryOrder: 0
order: 5
status: 持续维护
featured: false
draft: false
sitePublish: true
tags:
  - 交互展示
  - 中药
  - 数据管理
coverAlt: 中药展示封面
websiteCoverUrl: /assets/cases/herbal-exhibition-cover.png
lang: zh
translationKey: herbal-exhibition
---

## 项目介绍

这是一个围绕中药资料浏览与交互展示的 UE 项目。用户可以按类别或名称查找药材，查看介绍、图片、语音和三维模型，并进入显微切片内容观察不同倍率的图像。

## 我负责的工作

- 整理药材数据、分类、地区与检索接口，让界面能够按当前选择展示内容。
- 接入图像、音频与多模型资料，处理选中内容及相关展示资源的异步预加载。
- 整理显微切片资料和 4×、10×、40× 倍率下的图像切换。
- 配套外部资料管理工具，支持新增、编辑中药与切片记录，并导入和校验相关素材。

## 交互展示与内容维护

展示端将资料查询与场景表现分开，内置内容和外部补充内容可以进入统一的浏览列表。药材模型按配置顺序切换，显微切片按实际配置的倍率和图片展示。

资料维护端提供图片、音频和自包含 GLB 模型的导入入口，保存时检查内容与资源。维护人员可以通过工具更新资料，重启展示程序后读取最新内容。

## 项目范围

本案例展示交互程序、数据组织、资源加载与资料维护方面的开发工作。药材知识、模型与图片等内容素材的制作不在这里归为个人开发成果。

外部资料工具支持 PNG、JPG、JPEG 图片，OGG、WAV、MP3 音频，以及自包含的 GLB 模型；具体素材需要符合展示端的格式要求。
