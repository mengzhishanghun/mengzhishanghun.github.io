---
title: Windows UE 5.6 与 Cursor：先跑通构建，再处理编辑体验
description: 这是一份 Windows、UE 5.6 的配置经历整理。原记录未留下完整 Cursor 和扩展版本，因此不能视为当前版本兼容性承诺。目标是用 Cursor 编辑 UE C++，并保留独立可用的编译与调试入口。
type: blog
slug: ue-cursor-workflow-notes
categoryId: ue
categoryName: UE
categoryOrder: 0
order: 0
status: 已发布
featured: false
date: 2026-10-13
publishedAt: 2026-10-13
draft: false
sitePublish: true
tags: []
productIds: []
workIds: []
docIds: []
lang: zh
translationKey: ue-cursor-workflow-notes
---

Cursor+UE从0开始，入坑到退坑指南
===

本教程仅提供Windows下安装方法，测试环境为UE5.6版本

# 环境部署

已经安装了编译环境，可以正常运行VS或者Rider的可以跳过这一步
## 下载安装编译器工具集

[Microsoft Visual C++ （MSVC）编译器工具集](https://visualstudio.microsoft.com/downloads/)。

![](/media-occurrence/blog%3Aue-cursor-workflow-notes%3Amedia%3A1)

## 配置VS

![](/media-occurrence/blog%3Aue-cursor-workflow-notes%3Amedia%3A2)

勾选如图三个选项后点击安装

# 配置Cursor

### 下载安装 Cursor

[Cursor：用 AI 编码的最佳方式](https://cursor.com/cn)
## 打开扩展界面

![](/media-occurrence/blog%3Aue-cursor-workflow-notes%3Amedia%3A3)
## 安装中文语言包

![](/media-occurrence/blog%3Aue-cursor-workflow-notes%3Amedia%3A4)

搜索Chinese，第一个点击安装，安装后会提示重启，点击重启即可。
## 安装C++ C#扩展

![](/media-occurrence/blog%3Aue-cursor-workflow-notes%3Amedia%3A5)

搜索C++ 安装C/C++扩展 和 C#扩展

最终扩展应该是这样的

![](/media-occurrence/blog%3Aue-cursor-workflow-notes%3Amedia%3A6)

这些通常在安装完C/C++以及C#后自动安装的，如果没有你可以重启尝试或者自己手动安装

## 设置VSCode为默认源码编辑器

![](/media-occurrence/blog%3Aue-cursor-workflow-notes%3Amedia%3A7)

## 重新生成VSCode工作区

![](/media-occurrence/blog%3Aue-cursor-workflow-notes%3Amedia%3A8)

## 设置为通过Cursor打开工作区

![](/media-occurrence/blog%3Aue-cursor-workflow-notes%3Amedia%3A9)

## 设置IntelliSense

![](/media-occurrence/blog%3Aue-cursor-workflow-notes%3Amedia%3A10)

## 调试与运行

打开调试面板

![](/media-occurrence/blog%3Aue-cursor-workflow-notes%3Amedia%3A11)

选择Editor Development模式
![](/media-occurrence/blog%3Aue-cursor-workflow-notes%3Amedia%3A12)

点击左侧箭头或者按F5开始编译

![](/media-occurrence/blog%3Aue-cursor-workflow-notes%3Amedia%3A13)

等待编译结束

# 报错解决

## cppvsdbg不支持

![](/media-occurrence/blog%3Aue-cursor-workflow-notes%3Amedia%3A14)

# 参考文档

[为虚幻引擎设置Visual Studio Code | 虚幻引擎 5.6 文档 | Epic Developer Community](https://dev.epicgames.com/documentation/zh-cn/unreal-engine/setting-up-visual-studio-code-for-unreal-engine)

[为虚幻引擎C++项目设置Visual Studio开发环境 | 虚幻引擎 5.6 文档 | Epic Developer Community](https://dev.epicgames.com/documentation/zh-cn/unreal-engine/setting-up-visual-studio-development-environment-for-cplusplus-projects-in-unreal-engine)

[How to Setup Cursor IDE for Unreal Engine](https://www.youtube.com/watch?v=9Km1GyYCnh4)