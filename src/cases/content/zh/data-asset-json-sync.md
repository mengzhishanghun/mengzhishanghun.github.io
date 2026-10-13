---
title: 让 DataAsset 与 JSON 双向同步
description: 以 JSON 衔接外部 AI 工具与 DataAsset，处理双向同步中的字段转换、重复触发和写入问题。
type: case
slug: data-asset-json-sync
categoryId: ue-projects
categoryName: UE项目
categoryOrder: 0
order: 8
status: 已完成
featured: false
draft: false
sitePublish: true
tags:
  - DataAsset
  - JSON
  - AI
coverAlt: DataAsset、JSON 与外部 AI 或脚本的双向同步及自身写入过滤流程
websiteCoverUrl: /assets/cases/data-asset-json-sync.png
lang: zh
translationKey: data-asset-json-sync
---

## 背景介绍

在让 AI 参与游戏数据迭代的工作中，我采用 JSON 作为外部工具与 UE DataAsset 之间的中间格式。AI 处理文本数据，编辑器侧再把数据同步回资产，减少人工逐字段搬运。

案例重点是数据交换与同步流程。AI 生成的参数是否合理，仍需要在项目中运行、检查和审核。

## 复现环境

DataAsset 以 .uasset 保存，外部工具不便直接处理；JSON 则便于生成、阅读和文本对比。UE 侧利用 `FJsonObjectConverter` 承接属性与 JSON 的转换。

同步包含编辑器中的资产变化与磁盘上的 JSON 变化，资产写入还可能受到源码控制和文件只读状态影响。

## 具体问题

手动单向导入导出能完成基础交换，自动双向同步却增加了新的问题：字段名称转换、浮点表示、异步文件通知和可写性都可能影响结果。

尤其是编辑器导出 JSON 后，目录监听又把同一变化当作外部修改导入，容易产生重复触发。编辑器关闭期间两端都变化时，启动后的同步方向也需要判断。

## 解决方案

以 JSON 转换为基础，分别处理字段名与数值输出格式，避免把属性转换完全交给默认行为。具体字段仍应结合资产类型核对。字段转换与双向同步的实现过程，可[查看同步实现详情](https://mzsh.me/blog/cnblogs-20159718/)。

同步期间使用同步标记，同时追踪自身写入的文件路径。后者用于识别异步到达的文件变化通知，补足仅靠同步标记无法覆盖的时间差。

写入 DataAsset 前检查源码控制是否启用及资产的可写状态；同时考虑内容比对、撤销事务和目录监听生命周期，减少无意义写入并保留编辑器中的处理边界。

原方案以文件修改时间辅助判断同步方向。这适合通常只有一端修改的场景；两端同时修改时，时间比较不能代替字段级冲突判断，需要另行核对取舍。

## 最终总结

形成了让外部 AI 或脚本通过 JSON 参与 DataAsset 数据修改的双向同步方案，并记录了自动化中需要处理的关键环节。

不同属性的转换和数值往返需要按资产检查，两端同时修改时也需要核对冲突。同步完成后，仍应检查资产内容与实际运行结果。
