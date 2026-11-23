---
title: MCPAnimation
description: MCPAnimation 是开发中的 UE 编辑器 MCP 插件，围绕动画蓝图、状态机与动画资产提供工具接口。当前功能与兼容性仍在验证。
type: work
slug: mcp-animation
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
order: 16
status: 开发中
workInfo:
  stage: developing
  channels:
    - kind: docs
      href: /zh/works/mcp-animation/docs/connect/
featured: false
draft: false
sitePublish: true
tags:
  - 动画蓝图、状态机与动画资产
  - MCP 系列
docIds:
  - mcp-animation-connect
  - mcp-animation-find-assets
  - mcp-animation-animation-blueprint
  - mcp-animation-montage-and-blendspace
  - mcp-animation-animation-notifies
  - mcp-animation-animation-blend-spaces
coverAlt: MCPAnimation封面
websiteCoverUrl: /media/covers/works/mcp-animation-20261101.webp
lang: zh
translationKey: mcp-animation
---

## 作品简介

MCPAnimation 是开发中的 UE 编辑器 MCP 插件，让外部 AI 工具通过本机 HTTP 接口查找、检查和编辑动画资产。目前仍在验证可用的操作和诊断反馈。

## 开发方向

### 动画蓝图与状态机

可以读取已有蓝图的 AnimGraph、状态、过渡和 Conduit，也可以按指定 Skeleton 创建动画蓝图。可以增删状态、添加过渡并设置支持的过渡规则。只有能确认唯一的 Sequence Player 直接驱动状态结果时，工具才会替换动画；复杂状态图需要在编辑器里手动处理。[查看动画蓝图与状态机文档](/zh/works/mcp-animation/docs/animation-blueprint/)

### 动画资产与采样

检查 Skeleton 的骨骼、虚拟骨骼与 Slot Group，或读取 AnimSequence 的时长、采样率和 Notify。曲线和压缩设置只提供摘要，不支持写入，也不导出完整关键帧或逐骨骼轨道。[查看动画资产文档](/zh/works/mcp-animation/docs/find-assets/)

从 AnimSequence 创建 Montage 后，可增删或调整区段；也可以查找 Notify 类，在 Montage 或 AnimSequence 上添加或移除通知。BlendSpace 有独立的采样点编辑工具。[Montage 区段](/zh/works/mcp-animation/docs/montage-and-blendspace/) · [动画 Notify](/zh/works/mcp-animation/docs/animation-notifies/) · [BlendSpace 采样点](/zh/works/mcp-animation/docs/animation-blend-spaces/)

## 使用流程

例如，要替换状态机中某个状态的动画，先按[连接说明](/zh/works/mcp-animation/docs/connect/)使用编辑器显示的地址接入客户端，再用规范资产路径读取状态机并确认目标。修改后编译动画蓝图，查看图表诊断；确认结果后调用 `SaveAsset` 写入磁盘。写入仅限有效的 `/Game` 路径，编辑器正在 PIE、保存或垃圾回收时会拒绝写入。

## 开发状态

项目处于开发阶段。UE 5.2–5.8 相关版本仍在开发，兼容性待确认，各版本的测试尚未全部完成。工具用于编辑器内的动画资产工作，不处理 Sequencer 或 Control Rig，也不提供运行时网络复制、项目构建或插件打包。

## 支持

反馈请发送至 [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com)。
