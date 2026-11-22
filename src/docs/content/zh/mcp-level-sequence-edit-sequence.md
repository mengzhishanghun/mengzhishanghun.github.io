---
title: 编辑轨道、区段与通道
type: doc
slug: mcp-level-sequence-edit-sequence
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-level-sequence
docPage:
  work: mcp-level-sequence
  group: workflows
  slug: edit-sequence
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-level-sequence/docs/edit-sequence/
lang: zh
translationKey: doc:mcp-level-sequence:edit-sequence
---

## Track、Section 与 Channel

`AddTrack` 支持八类轨道：

- Binding 轨道：`MovieScene3DTransformTrack`、`MovieSceneFloatTrack`、`MovieSceneBoolTrack`、`MovieSceneSkeletalAnimationTrack`。
- 根级或 Binding 轨道：`MovieSceneAudioTrack`、`MovieSceneEventTrack`。
- 仅根级轨道：`MovieSceneCameraCutTrack`、`MovieSceneFadeTrack`。

Float 与 Bool 属性轨要求 `PropertyName`，可用 `PropertyPath` 指定嵌套属性。Skeletal Animation Section 要求 `AnimationAssetPath`，并验证为 `AnimSequenceBase`；Audio Section 要求 `SoundAssetPath`，并验证为 `SoundBase`。Event Track 目前只创建 Section 容器，不创建 Director Blueprint endpoint 或事件 payload。

关键帧工具支持三类 Channel：Transform 使用 Double，Float/Fade 使用 Float，Bool 属性轨使用 Bool。`GetSequenceDetail` 返回 Track 与 Section 结构，但不枚举 Channel；调用关键帧工具时应使用对应 Track 类型约定的 `ChannelName`。

## 时间单位与帧率

所有 `StartFrame`、排他 `EndFrame`、关键帧位置和 Camera Cut 帧都使用序列的 `TickResolution`，不是 `DisplayRate`。`GetSequenceDetail` 会同时返回这两个有理数帧率。

`SetSequenceRates` 可独立或同时设置 Display Rate 与 Tick Resolution；每个帧率必须提供正整数分子和分母。修改 Tick Resolution 时，插件调用引擎的帧时间迁移能力，同步迁移播放/选择范围、Track、Section、Key 和 Marked Frame，以保持实际时间不变；不会递归修改 Subsequence 资产。

## 分页与输出上限

- `ListSequences`：默认 100，单页最多 500。
- `ListBindings`：默认 100，单页最多 500，并按 BindingId 稳定排序。
- `GetKeyframes`：默认 200，单页最多 1000，并提供 `NextOffset`。
- `GetSequenceDetail`：用 `Offset` 与 `MaxItems` 对 Binding/Track/Section 的稳定组合遍历分页。
- `CaptureSequencerView`：最多 16 Mi 像素，压缩后的 PNG 最多 8 MiB。

分页响应会返回总数、当前 Offset、是否还有更多数据和可用的 `NextOffset`。客户端应继续分页，不要假设一次返回完整资产。

## 写入、事务与资产生命周期

修改与保存工具只接受有效的 `/Game/...` Level Sequence 路径；只读发现、读取、打开、截图和关闭可访问其他已加载或可读取的序列位置。所有编辑工具会检查 PIE、保存和 GC 忙碌状态，拒绝只读 MovieScene，并通过编辑器事务支持 Undo。

编辑成功只会将包标记为 dirty，不会隐式保存。调用 `SaveAsset` 只保存指定 Level Sequence 的 package。`CloseAsset` 发出关闭请求后会再次查询该资产及其子对象的编辑器实例；若编辑器拒绝关闭，工具会返回失败而不是误报成功。

删除 Binding 或 Track 会级联处理其下级对象；删除 Binding 还会在同一事务中移除引用该子树的本地 Camera Cut Section。遇到无效、锁定、只读或无法安全解析的非本地 Camera Cut 序列引用时会拒绝破坏性操作。名称选择器存在重名时会报歧义；优先使用 `ListBindings` 返回的 `BindingId` 和 `GetSequenceDetail` 返回的 `TrackName`。

## 调用示例

下面的请求将 Display Rate 设为 24 fps，并把 Tick Resolution 迁移为 24000 fps：

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

推荐流程是先调用 `ListSequences` 和 `GetSequenceDetail`，再用稳定 ID/名称执行修改，最后显式调用 `SaveAsset`。
