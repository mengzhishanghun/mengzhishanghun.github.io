---
title: 驾驶过程记录与 UE 回放管理
description: 采集驾驶操作与车辆状态，保存成绩统计，并配套管理 UE Network Replay 录制文件。
type: case
slug: driving-session-replay
categoryId: ue-projects
categoryName: UE项目
categoryOrder: 0
status: 归档
featured: false
draft: false
sitePublish: true
tags:
  - 仿真
  - 驾驶记录
  - 回放
lang: zh
translationKey: driving-session-replay
---

## 记录操作过程，也保留可查看的回放

驾驶模拟中的过程数据和场景回放，解决的是两类需求：前者便于查看操作、状态与成绩，后者用于重新观看 UE 场景。我参与的实现分别处理 JSON 数据采集和 UE Network Replay 管理，让它们作为配套机制使用。

## 驾驶数据与成绩统计

过程采集记录方向盘、刹车、油门、速度、头部朝向、车辆位置与姿态，以及档位和转向灯。系统每 3000 帧整理成曲线，按误差阈值简化关键帧，再保存为 JSON，供后续读取和分析。

成绩数据另行保存，包含成绩标签、转向和起步次数、完成时间、反应时间及日期，并提供记录筛选。这部分与连续的驾驶过程数据分开组织，方便分别查询一次训练的统计结果和操作变化。

## 复用 UE Network Replay

场景回放复用 UE 的 Network Replay，封装开始录制、播放、枚举记录、重命名和删除等操作。回放管理负责选择和维护录制文件，过程 JSON 则保存业务数据。

两种机制的用途各自明确。当前实现范围不包含用过程 JSON 还原全部场景的自研回放引擎；具体项目仍需确认哪些 Actor 和状态进入 UE 回放。

## 相关需求

如果驾驶训练或其他仿真项目需要过程留档、成绩查询与场景回看，可以先列出采集字段、统计规则和需要重现的状态。我可以协助拆分数据记录与引擎回放的职责，并接入现有界面。

欢迎[联系我聊聊](/zh/contact/)。
