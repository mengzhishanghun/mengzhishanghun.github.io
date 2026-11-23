---
title: MCPLevelSequence
description: MCPLevelSequence 是开发中的 UE 编辑器 MCP 插件，围绕Level Sequence 序列资产编辑提供工具接口。当前功能与兼容性仍在验证。
type: work
slug: mcp-level-sequence
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
order: 20
status: 开发中
workInfo:
  stage: developing
  channels:
    - kind: docs
      href: /zh/works/mcp-level-sequence/docs/connect/
featured: false
draft: false
sitePublish: true
tags:
  - Level Sequence 序列资产编辑
  - MCP 系列
docIds:
  - mcp-level-sequence-connect
  - mcp-level-sequence-sequence-assets
  - mcp-level-sequence-sequence-preview
  - mcp-level-sequence-sequence-bindings
  - mcp-level-sequence-edit-sequence
  - mcp-level-sequence-sequence-keyframes
  - mcp-level-sequence-sequence-timing
coverAlt: MCPLevelSequence封面
websiteCoverUrl: /media/covers/works/mcp-level-sequence-20261101.webp
lang: zh
translationKey: mcp-level-sequence
---

## 作品简介

MCPLevelSequence 是开发中的 UE 编辑器 MCP 插件。外部 AI 工具可通过本机 HTTP 接口查找、创建并编辑 Level Sequence。序列操作和诊断反馈仍可能随开发调整。

## 开发方向

### 对象绑定与镜头切换

分页读取序列和绑定，使用 `BindingId` 定位对象，添加绑定或调整 Camera Cut。删除绑定或轨道会连带处理下级对象；删除绑定还会移除引用该子树的本地 Camera Cut 区段。动手前先检查引用，重名时使用明确的 ID。Spawnable 创建仍需独立验证后再开放。[序列资产](/zh/works/mcp-level-sequence/docs/sequence-assets/) · [对象绑定与镜头](/zh/works/mcp-level-sequence/docs/sequence-bindings/)

### 轨道、区段与关键帧

查看支持的轨道类型，添加、删除或调整区段。关键帧工具覆盖 Transform、Float/Fade 和 Bool 属性轨的对应通道。播放范围、关键帧和 Camera Cut 的帧数按 `TickResolution` 解释，输入前先核对序列设置。[轨道与区段](/zh/works/mcp-level-sequence/docs/edit-sequence/) · [关键帧](/zh/works/mcp-level-sequence/docs/sequence-keyframes/) · [播放范围与帧率](/zh/works/mcp-level-sequence/docs/sequence-timing/)

## 使用流程

例如，要调整已有序列的镜头切换，先按[连接说明](/zh/works/mcp-level-sequence/docs/connect/)让客户端连接编辑器显示的地址。查找目标序列，读出镜头绑定和切换区段，核对时间单位后再修改。可以[截取活动关卡编辑器视口](/zh/works/mcp-level-sequence/docs/sequence-preview/)检查当前画面。需要保留改动时调用 `SaveAsset`，它只保存指定 Level Sequence。写入要求有效的 `/Game/...` 路径；工具拒绝修改只读 MovieScene，也会在 PIE、保存或垃圾回收期间拒绝编辑。

## 开发状态

项目处于开发阶段。UE 5.2–5.8 的兼容性待确认，编译、编辑器运行、保存、关闭交互和完整 Undo 行为尚未全部验证。请先在目标引擎的项目副本中确认。[查看 MCPLevelSequence 教程](/zh/works/mcp-level-sequence/docs/connect/)

## 支持

反馈请发送至 [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com)。
