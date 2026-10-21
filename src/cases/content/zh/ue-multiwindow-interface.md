---
title: 在 UE 中创建独立多窗口界面
description: 用 Slate 原生窗口承载 UMG，提供窗口生命周期、位置尺寸、显隐与 DPI 控制。
type: case
slug: ue-multiwindow-interface
categoryId: ue-projects
categoryName: UE项目
categoryOrder: 0
status: 归档
featured: false
draft: false
sitePublish: true
tags:
  - UMG
  - 多窗口
  - 界面工具
lang: zh
translationKey: ue-multiwindow-interface
---

## 主画面之外的控制界面

UE 工具或仿真程序有时需要把控制面板放到独立窗口，避免操作区占用主画面。我实现的 MultiWindow 工具使用 Slate 创建原生窗口，并在窗口里承载 UMG，让现有界面可以作为单独的操作面板使用。

## 创建窗口与管理生命周期

`CreateMultiWindow` 负责创建 Slate 窗口并接入 UMG。MultiWindowActor 管理窗口位置、尺寸、标题和显隐，也提供最大化、最小化、关闭与激活事件，以及 DPI 相关处理。

这些控制让程序可以按业务流程打开面板、调整布局，并在窗口关闭或激活时响应。界面内容仍由 UMG 组织，窗口管理单独处理。

## 适用范围

这项实现面向独立工具窗口和控制面板。多窗口界面与多镜头渲染需要分别设计；如果窗口还要展示独立相机画面，需要继续评估视口、渲染与资源开销。

实际接入时，也要结合运行平台、窗口关闭方式和 DPI 设置确认交互表现。

## 相关需求

如果 UE 程序需要单独的参数面板、调试窗口或操作界面，可以先提供界面内容、窗口关系和运行环境。我可以协助接入 UMG，处理窗口控制和事件联动。

欢迎[联系我聊聊](/zh/contact/)。
