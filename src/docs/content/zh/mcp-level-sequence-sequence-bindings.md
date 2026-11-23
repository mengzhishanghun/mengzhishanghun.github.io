---
title: 编辑对象绑定与 Camera Cut
type: doc
slug: mcp-level-sequence-sequence-bindings
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
  slug: sequence-bindings
  order: 3
documentKind: product-manual
websiteRoute: /zh/works/mcp-level-sequence/docs/sequence-bindings/
lang: zh
translationKey: doc:mcp-level-sequence:sequence-bindings
---

## 对象绑定与镜头

| 分组 | 工具 | 用途 |
|---|---|---|
| Binding | `ListBindings`、`AddBinding`、`RemoveBinding` | 分页列出、添加和级联删除对象绑定 |
| Camera | `AddCameraCut`、`SetCameraCut` | 创建和修改 Camera Cut |

- `ListBindings`：默认 100，单页最多 500，并按 BindingId 稳定排序。

修改已有镜头切换前，用 `ListBindings` 找到镜头的 `BindingId`，再用 `GetSequenceDetail` 找到要调整的区段。已有区段用 `SetCameraCut`，新建区段用 `AddCameraCut`。

修改与保存工具只接受有效的 `/Game/...` Level Sequence 路径；只读发现、读取、打开、截图和关闭可访问其他已加载或可读取的序列位置。所有编辑工具会检查 PIE、保存和 GC 忙碌状态，拒绝只读 MovieScene，并通过编辑器事务支持 Undo。

删除 Binding 或 Track 会级联处理其下级对象；删除 Binding 还会在同一事务中移除引用该子树的本地 Camera Cut Section。遇到无效、锁定、只读或无法安全解析的非本地 Camera Cut 序列引用时会拒绝破坏性操作。名称选择器存在重名时会报歧义；优先使用 `ListBindings` 返回的 `BindingId` 和 `GetSequenceDetail` 返回的 `TrackName`。

当前不提供 Spawnable 创建。

Camera Cut 帧数按序列的 `TickResolution` 解释，见[时间单位与帧率](/zh/works/mcp-level-sequence/docs/sequence-timing/)。
