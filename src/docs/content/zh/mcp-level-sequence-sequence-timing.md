---
title: 设置播放范围与帧率
type: doc
slug: mcp-level-sequence-sequence-timing
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-level-sequence
docPage:
  work: mcp-level-sequence
  group: features
  slug: sequence-timing
  order: 6
documentKind: product-manual
websiteRoute: /zh/works/mcp-level-sequence/docs/sequence-timing/
lang: zh
translationKey: doc:mcp-level-sequence:sequence-timing
---

## 时间单位与帧率

所有 `StartFrame`、排他 `EndFrame`、关键帧位置和 Camera Cut 帧都使用序列的 `TickResolution`，不是 `DisplayRate`。`GetSequenceDetail` 会同时返回这两个有理数帧率。

`SetSequenceRates` 可独立或同时设置 Display Rate 与 Tick Resolution；每个帧率必须提供正整数分子和分母。修改 Tick Resolution 时，插件调用引擎的帧时间迁移能力，同步迁移播放/选择范围、Track、Section、Key 和 Marked Frame，以保持实际时间不变；不会递归修改 Subsequence 资产。

| 分组 | 工具 | 用途 |
|---|---|---|
| 时间 | `SetPlaybackRange`、`SetSequenceRates` | 设置播放范围、显示帧率和 Tick Resolution |

修改与保存工具只接受有效的 `/Game/...` Level Sequence 路径；只读发现、读取、打开、截图和关闭可访问其他已加载或可读取的序列位置。所有编辑工具会检查 PIE、保存和 GC 忙碌状态，拒绝只读 MovieScene，并通过编辑器事务支持 Undo。

## 调用示例

下面的请求将 Display Rate 设为 24 fps，并把 Tick Resolution 迁移为 24000 fps。此时一秒在界面上对应 24 个显示帧，在工具的帧参数中对应 24000。若从 0 开始设置一秒的播放范围，排他的结束边界应填 24000。

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "SetSequenceRates",
    "arguments": {
      "AssetPath": "/Game/Cinematics/MySequence",
      "DisplayRateNumerator": 24,
      "DisplayRateDenominator": 1,
      "TickResolutionNumerator": 24000,
      "TickResolutionDenominator": 1
    }
  }
}
```
