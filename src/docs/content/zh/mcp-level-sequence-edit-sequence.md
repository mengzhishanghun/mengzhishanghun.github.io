---
title: 编辑序列轨道与区段
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
  group: features
  slug: edit-sequence
  order: 4
documentKind: product-manual
websiteRoute: /zh/works/mcp-level-sequence/docs/edit-sequence/
lang: zh
translationKey: doc:mcp-level-sequence:edit-sequence
---

## 支持的轨道和区段类型

| 分组 | 工具 | 用途 |
|---|---|---|
| Track | `ListTrackTypes`、`AddTrack`、`RemoveTrack` | 查询、添加和级联删除轨道 |
| Section | `AddSection`、`RemoveSection`、`SetSectionRange` | 创建、删除和调整 Section 范围 |

`AddTrack` 支持八类轨道：

- Binding 轨道：`MovieScene3DTransformTrack`、`MovieSceneFloatTrack`、`MovieSceneBoolTrack`、`MovieSceneSkeletalAnimationTrack`。
- 根级或 Binding 轨道：`MovieSceneAudioTrack`、`MovieSceneEventTrack`。
- 仅根级轨道：`MovieSceneCameraCutTrack`、`MovieSceneFadeTrack`。

先用 `ListTrackTypes` 选轨道类型，确认轨道应放在根级还是指定对象绑定下，再添加轨道和区段。修改已有区段时，先在详情中定位它所在的轨道。

Float 与 Bool 属性轨要求 `PropertyName`，可用 `PropertyPath` 指定嵌套属性。Skeletal Animation Section 要求 `AnimationAssetPath`，并验证为 `AnimSequenceBase`；Audio Section 要求 `SoundAssetPath`，并验证为 `SoundBase`。Event Track 目前只创建 Section 容器，不创建 Director Blueprint endpoint 或事件 payload。

## 事务、删除与局限

修改与保存工具只接受有效的 `/Game/...` Level Sequence 路径；只读发现、读取、打开、截图和关闭可访问其他已加载或可读取的序列位置。所有编辑工具会检查 PIE、保存和 GC 忙碌状态，拒绝只读 MovieScene，并通过编辑器事务支持 Undo。

删除 Track 会级联移除其下级对象。重名选择器会返回歧义；使用 `GetSequenceDetail` 返回的 `TrackName`。

当前没有用于创建或导航 Subsequence 的写入工具。

本插件不提供任意 Track/Class、Folder、Tag、选择状态或骨骼级高级操作；官方实验 Toolset 的范围更广。

区段起止帧按序列的 `TickResolution` 解释，见[时间单位与帧率](/zh/works/mcp-level-sequence/docs/sequence-timing/)。
