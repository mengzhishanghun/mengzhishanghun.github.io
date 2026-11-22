---
title: 配置交互、导航与动画
type: doc
slug: mcp-umg-events-navigation-animation
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-umg
docPage:
  work: mcp-umg
  group: workflows
  slug: events-navigation-animation
  order: 3
documentKind: product-manual
websiteRoute: /zh/works/mcp-umg/docs/events-navigation-animation/
lang: zh
translationKey: doc:mcp-umg:events-navigation-animation
---

### UMG 动画（11 个工具）

| 工具 | 说明 |
|------|------|
| ListAnimations | 列出全部动画 |
| GetAnimationDetail | 获取动画详情 |
| CreateAnimation | 创建动画 |
| DeleteAnimation | 删除动画 |
| AddAnimationTrack | 添加动画轨道 |
| RemoveAnimationTrack | 删除一个精确指定的动画属性轨道 |
| SetAnimationKeys | 设置动画关键帧 |
| DuplicateAnimation | 复制动画、轨道及 Widget 绑定 |
| SetAnimationPlaybackRange | 以秒设置动画播放区间 |
| EditAnimationKeys | 预演并精确删除、清空或平移选定关键帧 |
| RenameAnimation | 重命名现有动画 |

### 事件逻辑

| 工具 | 说明 |
|------|------|
| BindWidgetEvent | 绑定 Widget 事件 |
| UnbindWidgetEvent | 删除 Widget 事件绑定 |
| AddEventActions | 添加事件动作 |
| CreateWidgetBlueprint | 创建 Widget Blueprint |
| SaveWidgetBlueprint | 编译并精确保存一个 Widget Blueprint；不执行 Save All，也不保存其他脏包 |
| SetWidgetBlueprintSettings | 设置 Widget Blueprint 配置 |
| SetPropertyBinding | 设置 Widget 属性绑定 |
| ImportUITexture | 从本地 PNG/JPEG 导入带预算与覆盖门禁的 UI Texture2D |
| ImportUIFont | 从本地 TTF/OTF 导入配套的 FontFace 与 UFont 资产 |
| SaveUIAsset | 精确保存一个 Texture2D、FontFace 或 UFont 资产包 |

主动启用的 Editor 模块 `MCPUMGMVVM` 另注册 `GetMVVMViewDetails`、`ValidateMVVMBindingAdvanced`、`SetMVVMBinding`、`RemoveMVVMBinding`、`UpdateMVVMViewModelContext`、`RemoveMVVMViewModelContext`。原生 MVVM 可用并不代表增强模块已加载；详见[可选 UI 框架](https://mzsh.me/zh/works/mcp-umg/docs/components-styles/#optionaluiframeworks)。

图片到 UMG 的完整顺序与 Schema 见 [参考图到 UMG 工作流](https://mzsh.me/zh/works/mcp-umg/docs/layout/#imagetoumg)；运行中实例的令牌、输入、列表、操作与诊断见[运行时交互与诊断](https://mzsh.me/zh/works/mcp-umg/docs/preview-runtime/#runtimeworkflow)。导航、组件、预览、样式与字体见 [导航](#navigation)、[组件](https://mzsh.me/zh/works/mcp-umg/docs/components-styles/#components)、[预览](https://mzsh.me/zh/works/mcp-umg/docs/preview-runtime/#preview)、[通用控件样式](https://mzsh.me/zh/works/mcp-umg/docs/components-styles/#commonstyles)；主题、预览矩阵、动画和组件提取见 [主题](https://mzsh.me/zh/works/mcp-umg/docs/components-styles/#themes)、[预览矩阵](https://mzsh.me/zh/works/mcp-umg/docs/preview-runtime/#previewmatrix)、[动画工作流](#animationworkflow)、[组件提取](https://mzsh.me/zh/works/mcp-umg/docs/components-styles/#componentextraction)；批量迁移、性能与可选框架见 [批量属性迁移](https://mzsh.me/zh/works/mcp-umg/docs/batch-migration/#batchmigration)、[性能结构诊断](https://mzsh.me/zh/works/mcp-umg/docs/preview-runtime/#performance)、[可选 UI 框架](https://mzsh.me/zh/works/mcp-umg/docs/components-styles/#optionaluiframeworks)。

## Navigation

### UMG 导航工具

`SetWidgetNavigation` 为 Widget Blueprint 模板中的单个控件配置原生 `UWidgetNavigation` 数据；不会发送输入、改变运行时焦点或保存资产。调用成功后资产仅在内存中标脏，需要时再调用 `SaveWidgetBlueprint` 保存。

#### 读取当前六方向

```json
{"BlueprintPath":"/Game/UI/WBP_Menu","WidgetName":"PlayButton"}
```

调用 `GetWidgetNavigation` 会始终返回 `Up`、`Down`、`Left`、`Right`、`Next`、`Previous` 六个方向。没有配置导航对象时，六个方向均报告为 `Escape`。

#### 局部更新与预检

`Rules` 只更新提供的方向，其余原有方向不变。支持 `Escape`、`Stop`、`Wrap`、`Explicit` 和 `Custom`。`Explicit` 的目标必须是同一个 `WidgetTree` 内、且不是自身的控件；`Custom` 必须提供 Widget Blueprint 生成类中已有、签名为 `UWidget* Function(EUINavigation)` 的 `CustomFunction`。

```json
{
  "BlueprintPath":"/Game/UI/WBP_Menu",
  "WidgetName":"PlayButton",
  "Rules":{
    "Down":{"Rule":"Explicit","TargetWidget":"OptionsButton"},
    "Next":{"Rule":"Wrap"}
  },
  "dryRun":true
}
```

去掉 `dryRun` 或传入 `false` 后，所有方向会先完成验证，再在一个事务中一次写入。要恢复某个方向的默认逃逸规则，只提交该方向：

```json
{"BlueprintPath":"/Game/UI/WBP_Menu","WidgetName":"PlayButton","Rules":{"Down":{"Rule":"Escape"}}}
```

无效方向、缺失/跨树/自身显式目标，或不存在的自定义函数都会在写入前失败，且不会修改任何对象。

## AnimationWorkflow

### 动画工作流

`DuplicateAnimation` 深拷贝源动画的 MovieScene、轨道和 Widget 绑定，源动画不变；新名称必须唯一。`SetAnimationPlaybackRange` 以秒设置 `[StartSeconds, EndSeconds)`，所有参数先验证后在一个事务中写入。两者均只标脏，不保存。

`SetAnimationKeys` 的 Cubic 键可使用 `TangentMode`（`Auto`、`User`、`Break`）和有限数值 `ArriveTangent`、`LeaveTangent`；Linear 或 Constant 携带切线会被拒绝，且不修改资产。

`GetAnimationDetail` 同时返回 Cubic 键的切线模式与入/出切线。`Auto` 由引擎计算切线；手工斜率请使用 `User` 或 `Break`。切线必须是 JSON 数字且在 float 可表示范围内。

`GetAnimationDetail` 还分页返回绑定 GUID、轨道/区段索引及 Float、Bool、Byte 通道的键详情。先用它确定精确位置，再用 `EditAnimationKeys` 删除、清空或平移一个通道中的键。请求需要 `BindingGuid`、`WidgetName`（Slot 绑定另传 `SlotWidgetName`）、`TrackIndex`、`SectionIndex`、`ChannelType` 和 `ChannelIndex`。`Operation` 为 `Delete`、`Clear` 或 `Shift`；用整数 tick 帧数组 `Frames`，或同时给出含端点的 `StartSeconds`、`EndSeconds` 选择键。`Clear` 不带选择器时清空整个通道；`Shift` 还需 `ShiftSeconds`，目标不得碰撞现有键或超出播放范围。

`bDryRun` 默认 `true`，返回本次区段的 `Fingerprint` 和受影响键数。实际应用时传 `bDryRun:false` 与该值作为 `ExpectedFingerprint`；过期指纹会被拒绝。修改后蓝图仍需显式保存。

```json
{"BlueprintPath":"/Game/UI/WBP_Menu","SourceAnimationName":"FadeIn","NewAnimationName":"FadeInFast"}
```

`RenameAnimation` 使用 `BlueprintPath`、现有 `AnimationName` 和唯一的 `NewAnimationName` 重命名动画；新名称不能与控件、其他动画或蓝图成员冲突。若父类原生 `BindWidgetAnim` 或 `BindWidgetAnimOptional` 属性使用旧名称，或有已知外部资产引用该 Widget Blueprint，工具会拒绝重命名；图表字符串引脚含旧动画名时也会拒绝，需要先人工复核这些依赖。重命名后仍需显式保存。

```json
{"BlueprintPath":"/Game/UI/WBP_Menu","AnimationName":"FadeIn","NewAnimationName":"FadeInFast"}
```
