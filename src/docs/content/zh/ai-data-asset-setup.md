---
title: 安装与同步设置
type: doc
slug: ai-data-asset-setup
draft: false
sitePublish: true
tags:
  - DataAsset
  - JSON
workIds:
  - ai-data-asset
docPage:
  work: ai-data-asset
  group: setup
  slug: setup
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/ai-data-asset/docs/setup/
lang: zh
translationKey: doc:ai-data-asset:setup
---

## 安装

1. 将 `AIDataAsset` 文件夹复制到项目的 `Plugins/` 目录
2. 重启 Unreal 编辑器
3. 如未自动启用，在 编辑 > 插件 中启用

## 同步设置

打开 **项目设置 > 插件 > AIDataAsset**：

| 设置项 | 默认值 | 说明 |
|--------|--------|------|
| JSON Output Directory | `Saved/AIDataAsset` | JSON 文件存储目录（相对于项目根目录） |
| Enable Auto Sync | `true` | 开启/关闭自动同步 |

**输出目录与版本管理。** 默认的 `Saved/AIDataAsset/` 是自动同步的中间目录，通常不应加入版本管理。实际运行使用的数据仍保存在 UE 资产中。需要跟踪 JSON 时，可在这里修改 `JSON Output Directory`，设为项目内需要纳入版本管理的目录，再将生成的 JSON 加入版本管理。也可以让 AI 工具协助修改这项配置；修改后应确认实际输出位置。

## 界面语言

打开 **编辑 → 项目设置**，进入 AI DataAsset 设置页，将 **Language** 设置为 **English** 或 **中文**。默认语言为英文。面向用户的界面、提示、通知和功能日志会立即更新，无需重启编辑器；公开 API 名称以及模块启动/关闭日志始终保持英文。
