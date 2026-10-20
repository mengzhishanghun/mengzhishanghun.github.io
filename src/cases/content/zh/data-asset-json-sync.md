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

UE 的 `FJsonObjectConverter::UStructToJsonObject` 与 `JsonObjectToUStruct` 提供属性和 JSON 对象之间的转换入口。只需要手动、单向交换时，可以做编辑器按钮：先导出 JSON，外部工具修改后再手动导入，不必启用持续监听。具体属性类型与软引用仍需结合引擎版本和资产定义检查。

历史实现为浮点输出定制 PrintPolicy，对 float 使用 `%.9f`，对 double 使用 `%.17g`。这些格式分别限定小数位数与有效数字位数；`%.9f` 不能对全部 float 范围保证精确往返，应以实际数值范围和序列化测试判断，不能把历史文章的“完全一致”当作验证结论。

字段名转换也需要明确约定。历史方案处理 `MaxHealth` 导出为 `maxHealth` 的命名变化：导出后递归调整 JSON 字段的首字母，导入前作反向处理。缩写、嵌套结构和名称冲突需要按实际字段核对，不能假设首字母转换对所有资产都可逆。

以 JSON 转换为基础，分别处理字段名与数值输出格式，避免把属性转换完全交给默认行为。具体字段仍应结合资产类型核对。

同步期间使用同步标记，同时追踪自身写入的文件路径。后者用于识别异步到达的文件变化通知，处理仅靠同步标记无法覆盖的时间差。

写入 DataAsset 前检查源码控制是否启用及资产的可写状态；同时考虑内容比对、撤销事务和目录监听生命周期，减少无意义写入并保留编辑器中的处理边界。

原方案以文件修改时间辅助判断同步方向。这适合通常只有一端修改的场景；两端同时修改时，时间比较不能代替字段级冲突判断，需要另行核对取舍。


这套双向同步方案让外部 AI 或脚本通过 JSON 参与 DataAsset 数据修改，记录中也说明了自动化需要处理的关键环节。

不同属性的转换和数值往返需要按资产检查，两端同时修改时也需要核对冲突。同步完成后，仍应检查资产内容与实际运行结果。

## 相关需求

如果你希望用 AI 或脚本批量修改 UE DataAsset，或建立 JSON 导入导出流程，我可以协助梳理字段结构、转换规则和编辑器侧的同步操作。

可以提供示例资产、JSON 格式及期望的同步方式，再确定采用手动交换还是自动监听，并明确冲突处理办法。

有相关需求，欢迎[联系我聊聊](https://mzsh.me/zh/contact/)。
