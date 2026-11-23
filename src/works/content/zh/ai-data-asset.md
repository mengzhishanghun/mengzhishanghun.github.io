---
title: AIDataAsset
description: 让 AI 通过 JSON 修改复杂的 DataAsset 数据，实时同步到 UE，支持基础类型和大多数结构体。
type: work
slug: ai-data-asset
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
order: 14
status: 正式文档
workInfo:
  channels:
    - kind: sale
      href: https://www.fab.com/listings/e6c92c8b-6e87-4f2f-9975-1c0d85621c60
    - kind: docs
      href: /zh/works/ai-data-asset/docs/setup/
featured: false
draft: false
sitePublish: false
tags:
  - DataAsset
  - JSON
  - AI 系列
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/20159718
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/20159718
docIds:
  - ai-data-asset-setup
  - ai-data-asset-sync
  - ai-data-asset-ai-edit
coverAlt: AIDataAsset封面
websiteCoverUrl: /media/covers/works/ai-data-asset-20261101.webp
sourceDate: 2026-05-25
lang: zh
translationKey: ai-data-asset
---

## 作品简介

AIDataAsset 让 AI 通过 JSON 读取和修改复杂的 DataAsset 数据，并在 UE 编辑器运行时自动同步回资产。开启自动同步后，插件会处理导出、文件监听和回写，无需每次手动导入导出。

它支持常见基础类型和大多数结构体。把批量字段修改和嵌套配置交给 AI，可以少在编辑器里逐项展开和填写字段。

## 背景与目标

DataAsset 以 UE 资产格式保存，AI 工具难以直接读取和修改其中字段。字段多、迭代频繁时，手工搬运 AI 生成的结果会产生大量重复工作。

AIDataAsset 用 JSON 连接外部工具和 UE 资产，让数据修改可以交给 AI，检查和测试仍在游戏工程中完成。

## 核心能力

### DataAsset 与 JSON 往返

将已有 DataAsset 的属性导出为 JSON，再把外部修改同步回资产。字段名与编辑器中的名称保持对应，浮点数按字段类型格式化，往返后仍需按允许误差核对。

### 变化监听与同步控制

编辑器运行期间自动监听资产和 JSON 的变化，并避免双向同步反复触发。启动时也会检查两端文件，按修改时间选择同步方向。

### 编辑器修改保障

导入支持撤销和重做，并结合版本控制签出与资产保存处理修改。保存失败会提示警告，资产仍需在编辑器中处理，不能把内存更新当作已保存。

## 适用场景

需要生成关卡配置、批量调整角色数值或修改嵌套结构体时，可以让 AI 读取并修改 JSON，再回到 UE 中检查和测试。LLM、强化学习系统或 Python 等外部工具都可以参与这条数据处理流程。

策划也可以借助 Excel 等工具集中处理数据。需要团队审查时，可将 JSON 输出到适合版本管理的目录，用文本差异查看字段变化；默认的 Saved 输出目录通常只作为同步中间目录。

## 使用流程

以角色数据 `DA_Demo` 为例，可以把 `MaxHealth` 从 100 调到 120，并把 `CritRate` 改为 0.1。

1. 在 UE 中创建 DataAsset，开启自动同步，让插件生成对应的 JSON。默认输出目录为 `Saved/AIDataAsset/`。
2. 把文件路径和要改的字段告诉 AI。保留原有 JSON 结构，包括 `NativeClass`，只修改本次需要调整的值。
3. 保持编辑器运行，保存 JSON 后查看已有资产里的数值。若日志提示保存失败，处理签出或写入权限后再保存资产。

![](/media-occurrence/work%3Aai-data-asset%3Amedia%3A1)

![](/media-occurrence/work%3Aai-data-asset%3Amedia%3A2)

完整示例见[用 AI 编辑资产数据](/zh/works/ai-data-asset/docs/ai-edit/)。

## 适用范围与边界

JSON 用来修改 UE 中已有的 DataAsset，单独添加 JSON 不会创建新资产。自动监听只在编辑器运行且自动同步开启时生效。

启动同步按文件修改时间选择方向，不会合并两端各自修改的字段。资产需要可写；无效 JSON 或字段结构变化可能导致导入失败。同步完成也不代表数据符合游戏规则，仍需在项目中验证。

安装和输出配置见[安装与同步设置](/zh/works/ai-data-asset/docs/setup/)；启动规则和删除行为见[同步 DataAsset 与 JSON](/zh/works/ai-data-asset/docs/sync/)。


## 技术说明

JSON 选型、转换 API、数值格式与异步同步的处理见[使用文档](/zh/works/ai-data-asset/docs/sync/)。

## 兼容性

- Unreal Engine 5.2–5.8

## 技术说明来源

双向同步实现说明于 2026-05-25 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/20159718)。

## 联系与支持

如有使用问题或合作需求，请前往联系页面。

- **联系入口：** [联系与合作](https://mzsh.me/contact/)
