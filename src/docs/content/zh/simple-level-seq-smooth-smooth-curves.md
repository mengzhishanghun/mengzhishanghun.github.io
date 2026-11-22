---
title: 平滑 Sequencer 曲线
type: doc
slug: simple-level-seq-smooth-smooth-curves
draft: false
sitePublish: true
tags:
  - 动画
  - 动作捕捉
  - 滤波
workIds:
  - simple-level-seq-smooth
docPage:
  work: simple-level-seq-smooth
  group: workflows
  slug: smooth-curves
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-level-seq-smooth/docs/smooth-curves/
lang: zh
translationKey: doc:simple-level-seq-smooth:smooth-curves
---

场景序列数据滤波处理插件，内置 12 种平滑算法，覆盖动捕/后处理/AI 全场景。

## 兼容性

- Unreal Engine 5.2–5.8
- 版本 1.1.0（Version 2）

## 功能特性

- **12 种平滑算法**：覆盖时域、频域、状态估计、自适应、AI 专用等方向
- **内容浏览器集成**：右键 LevelSequence 资产即可使用滤波功能
- **ControlRig 支持**：直接处理 ControlRig 参数段（Transform 和 Scalar）
- **灵活输出**：可选覆盖原序列或创建新序列
- **批量处理**：一次处理多个序列，自动保持一致的后缀命名
- **自动帧率检测**：自动读取序列帧率

## 安装

1. 将 `SimpleLevelSeqSmooth` 文件夹复制到项目的 `Plugins/` 目录
2. 重启 Unreal 编辑器
3. 如未自动启用，在 编辑 > 插件 中启用

## 使用方法

1. 在内容浏览器中右键选择一个或多个 LevelSequence 资产
2. 从右键菜单中选择 **Smooth**
3. 选择平滑算法并调整参数
4. 选择输出方式（覆盖原序列或创建新序列）
5. 点击 **确定** 应用

## 依赖

- ControlRig 插件（默认已启用）

## 支持的引擎版本

- Unreal Engine 5.2–5.8

## 版本历史



打开 **编辑 → 项目设置**，进入 Simple Level Sequence Smooth 设置页，将 **Language** 设置为 **English** 或 **中文**。默认语言为英文。面向用户的界面、提示、通知和功能日志会立即更新，无需重启编辑器；公开 API 名称以及模块启动/关闭日志始终保持英文。

## 联系方式

如有使用问题或合作需求，请前往联系页面。

- **联系入口：** [联系与合作](https://mzsh.me/contact/)
