---
title: 截取蓝图图表
type: doc
slug: mcp-blueprint-graph-screenshots
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-blueprint
docPage:
  work: mcp-blueprint
  group: features
  slug: graph-screenshots
  order: 3
documentKind: product-manual
websiteRoute: /zh/works/mcp-blueprint/docs/graph-screenshots/
lang: zh
translationKey: doc:mcp-blueprint:graph-screenshots
---

## 打开图表并截图

先用 `OpenAsset` 打开蓝图，打开要截取的图后再用 `CaptureGraphScreenshot`。想展示结构就截完整图表；要看某段连线就聚焦相应节点。也可复用指定视口。分享图片前，请确认标题、Pin 和连线清晰可读。

截图工具要求已初始化的蓝图图表编辑器控件。未打开图表编辑器或图表控件尺寸为零时，截图请求会被拒绝。

## 计算函数截图

从左向右读 `CalculateScore`：Add 先把基础分和奖励分相加，Multiply 再乘以倍率，最右侧是返回节点。

![正常 Blueprint Editor 中的 CalculateScore](/media-occurrence/doc%3Amcp-blueprint%3Agraph-screenshots%3Amedia%3A1)

## 完整订单结算图截图

`EvaluateOrderBatchV2` 展示一个订单结算函数如何在同一张图中处理订单累计、折扣、运费、税费、积分、风险分数和最终结果。阅读全图时，可以先沿彩色注释框定位各段逻辑，再放大查看节点和连线。

![正常 Blueprint Editor 中的完整订单结算流程](/media-occurrence/doc%3Amcp-blueprint%3Agraph-screenshots%3Amedia%3A2)
