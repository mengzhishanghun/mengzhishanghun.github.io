---
title: AIDataAsset
description: 将 DataAsset 属性与 JSON 文件关联，供外部程序读取和修改游戏数据。
type: work
slug: ai-data-asset
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
order: 14
status: 正式文档
featured: false
draft: false
sitePublish: false
tags:
  - DataAsset
  - JSON
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/20159718
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/20159718
sourceDate: 2026-05-25
lang: zh
translationKey: ai-data-asset
---

## 作品简介

AIDataAsset 将 Unreal Engine 的 DataAsset 属性映射到 JSON 文件，让外部程序通过可读写的文本参与游戏数据调整。编辑器中的资产变化可以导出为 JSON，外部修改也可导回资产。

它面向需要在 UE 与脚本、数据工具或 AI 程序之间交换配置的工作流。

## 背景与目标

DataAsset 以 UE 资产格式保存，外部程序难以直接理解其中字段。若每次外部生成数据后都要手工搬入编辑器，字段多、迭代频繁时，容易产生重复工作。

JSON 既能被常见程序处理，也能在版本控制中查看文本差异。这个作品的目标是建立两端数据通道，并处理双向同步带来的精度、命名和循环触发问题。

## 核心能力

### DataAsset 与 JSON 往返

将 DataAsset 属性导出为对应 JSON，并在 JSON 变化后把数据导入资产。字段名处理使文本中的属性与编辑器中看到的名称更容易对应；浮点数输出也考虑往返转换的精度。

JSON 是交换格式，实际运行所用的资产仍需在 UE 中正确更新和保存。

### 变化监听与同步控制

通过文件变化监听发现外部修改，同时区分自身写出的 JSON，避免导出触发导入、导入又触发导出的循环。

编辑器启动时两端可能都发生过变化，同步方向需要根据资产与文件状态判断；不能仅凭某一端存在就覆盖另一端。

### 编辑器修改保障

导入数据涉及 DataAsset 写入，插件结合版本控制签出与撤销事务处理编辑器内的修改。对比导出内容可减少无意义写入；资产删除和监听生命周期也属于这条数据通道需要管理的环节。

## 适用场景

适合把角色数值、技能配置等 DataAsset 数据交给外部脚本或工具批量编辑，再返回 UE 检查。也适合需要审查具体字段变更的团队，因为 JSON 差异比二进制资产变更更直观。

外部 AI 可以参与生成或修改 JSON，但数据正确性仍由项目方验证。

## 适用范围与边界

双向同步会改动资产和磁盘文件，必须确认两端何者为准，并保证资产可写。

时间戳判断适用于通常只在一端修改的情形；两端并发编辑、字段结构变化或无效 JSON 仍需人工处理。作品提供数据交换通道，不替代业务规则校验。
