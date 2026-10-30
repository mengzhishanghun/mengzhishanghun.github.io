---
title: MCPUMG 使用文档
description: MCPUMG 的安装、连接、工具用法与限制
type: doc
slug: mcp-umg-guide
categoryId: ue-plugins
categoryName: UE插件
categoryOrder: 0
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-umg
documentKind: product-manual
websiteRoute: /docs/zh/guides/ue-tools/mcp-umg-guide/
lang: zh
translationKey: mcp-umg-guide
---

# MCPUMG

MCPUMG 是一款由 MCP（Model Context Protocol，模型上下文协议）驱动的 Unreal Engine UMG AI 编辑插件。

## 概述

MCPUMG 通过运行在 Unreal Editor 内的 HTTP 服务器，向 AI 助手提供 Widget 专用的可视化编辑能力。AI 工具可以通过标准协议发现、创建和修改 Widget 树、属性、插槽、动画与事件。

## 安装与更新

1. 关闭所有正在使用目标引擎版本的 Unreal Editor 实例。
2. 选择与引擎版本匹配的 MCPUMG 安装包，将其内容复制到该引擎安装目录下的 `Engine/Plugins/Marketplace/MCPUMG`。
3. 打开复制后的 `MCPUMG.uplugin`，保留 `"Installed": true`，并添加或设置 `"EnabledByDefault": true`；打包后处理可能会移除此字段。
4. 重启编辑器。除非在项目设置中关闭 `bAutoStart`，插件会自动启动。

更新 MCPUMG 时，请先关闭编辑器，再使用匹配版本的新安装包完整替换现有 `MCPUMG` 目录。不要混用不同引擎版本的文件。

## 工具（基础版 71 个；主动启用 MVVM 增强模块后另增 6 个）

### 发现与读取

| 工具 | 说明 |
|------|------|
| ListWidgetBlueprints | 列出 Widget Blueprint（便捷入口） |
| GetWidgetTree | 获取 Widget 树结构 |
| GetWidgetProperties | 获取 Widget 属性 |
| SearchWidgetClasses | 搜索可用的 Widget 类 |
| CaptureWidgetScreenshot | 将 Widget 设计视图截取为 PNG |
| CaptureRuntimeWidgetScreenshot | 按实际 Slate 窗口几何截取 PIE/Game 中已存在的 Widget 实例为 PNG；不会创建 Widget 或注入预览状态 |
| GetUIDesignCapabilities | 获取图片到 UMG 规格版本、操作和安全限制 |
| ExportWidgetSpec | 导出稳定的 Widget 结构规格、revision 与 fingerprint |
| InspectWidgetLayout | 分页检查设计元数据或 PIE 实际布局、裁剪、文本与资源状态 |
| InspectWidgetHitTest | 只读检查目标中心或局部坐标的实际缓存命中路径；不注入输入 |
| CompareUIImages | 在不自动缩放、裁剪或对齐的前提下比较两张 UI 图片并返回热图 |
| CaptureWidgetPreviewMatrix | 按命名状态和尺寸渲染临时预览矩阵 |
| InspectWidgetPerformance | 读取有界的设计态 WidgetTree 复杂度信号 |
| ListRuntimeWidgets | 为同类运行中 Widget 实例签发短期令牌 |
| InspectWidgetRuntime | 读取命名的运行中 Widget 或分页 WidgetTree |
| GetRuntimeOperation | 查询有界运行时操作的进度与结果 |
| CancelRuntimeOperation | 请求取消尚未完成的运行时操作 |
| MeasureWidgetPerformance | 对运行中 Widget 子树采样 Slate CPU 工作 |
| CaptureWidgetTrace | 捕获有界的原生 Slate Trace |
| GetUIFrameworkCapabilities | 读取可用的 CommonUI 与 MVVM 操作 |
| GetMVVMView | 读取 Widget Blueprint 的 MVVM Context 与 Binding |
| ValidateMVVMBinding | 只读验证一个直接的 OneTime MVVM 属性关系 |

### Widget 树编辑

| 工具 | 说明 |
|------|------|
| AddWidget | 添加 Widget |
| RemoveWidget | 删除 Widget |
| RenameWidget | 重命名 Widget 并更新相关绑定 |
| ReparentWidget | 将 Widget 移动到新的父级 |
| DuplicateWidget | 复制 Widget 子树 |
| WrapWidget | 使用新的父容器包裹 Widget |
| SetWidgetProperties | 设置 Widget 属性 |
| SetSlotProperties | 设置插槽属性（布局参数） |
| SetListViewEntryClass | 为 ListView、TileView 或 TreeView 配置经过校验的 `IUserObjectListEntry` 条目类 |
| ApplyWidgetTreePatch | dry-run 或原子应用 Widget Spec v1 的整树/增量 Patch |
| SetWidgetStyle | 使用结构化 JSON 设置 Image、Border、TextBlock 与 Button 样式 |
| SetWidgetLayout | 结构化设置 SizeBox、Canvas、Box 与通用 Slot，支持 dryRun |
| SetWidgetNavigation | 局部设置原生 UMG 导航方向，不自动保存 |
| GetWidgetNavigation | 读取全部六个原生 UMG 导航方向 |
| SetWidgetInstanceProperties | 设置嵌套 UserWidget 实例的可编辑属性 |
| InteractWithWidget | 向运行中 Widget 发送限定范围的点击、滚轮、文本、拖动、拖放或导航输入 |
| ControlWidgetList | 查看或修改运行中列表的选择、展开与滚动 |
| SetNamedSlotContent | 创建、替换、清空或移动 Named Slot 内容 |
| CaptureWidgetPreview | 渲染临时 Widget 实例并返回离屏 PNG |
| ExtractWidgetComponent | 复制 Widget 子树，或提取后以新实例替换；可迁移受支持的依赖 |
| ApplyWidgetTheme | 预检并应用可移植的样式/主题对象 |
| ExportWidgetTheme | 导出指定 Widget 的可移植样式 |
| BatchSetWidgetProperties | 预检并批量应用多个 Widget Blueprint 的属性改动 |
| ConfigureCommonUIWidget | 配置一个受支持的既有 CommonUI Widget 实例 |
| AddMVVMViewModelContext | 添加受支持的 MVVM ViewModel Context |
| InspectCommonUI | 检查运行中的 CommonUI Widget |
| ControlCommonUI | 激活、停用、压入或移除受支持的运行中 CommonUI Widget |
| ConfigureCommonUIInput | 配置白名单内既有 CommonUI 输入资产引用 |

`SetListViewEntryClass` 只持久化条目类。Unreal 将 `UListView::ListItems` 标记为瞬态，因此条目数据仍应在 Blueprint 或运行时通过 `SetListItems`/`AddItem` 注入。

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

主动启用的 Editor 模块 `MCPUMGMVVM` 另注册 `GetMVVMViewDetails`、`ValidateMVVMBindingAdvanced`、`SetMVVMBinding`、`RemoveMVVMBinding`、`UpdateMVVMViewModelContext`、`RemoveMVVMViewModelContext`。原生 MVVM 可用并不代表增强模块已加载；详见[可选 UI 框架](#optionaluiframeworks)。

图片到 UMG 的完整顺序与 Schema 见 [参考图到 UMG 工作流](#imagetoumg)；运行中实例的令牌、输入、列表、操作与诊断见[运行时交互与诊断](#runtimeworkflow)。导航、组件、预览、样式与字体见 [导航](#navigation)、[组件](#components)、[预览](#preview)、[通用控件样式](#commonstyles)；主题、预览矩阵、动画和组件提取见 [主题](#themes)、[预览矩阵](#previewmatrix)、[动画工作流](#animationworkflow)、[组件提取](#componentextraction)；批量迁移、性能与可选框架见 [批量属性迁移](#batchmigration)、[性能结构诊断](#performance)、[可选 UI 框架](#optionaluiframeworks)。

## 配置

项目设置 > 插件 > MCPUMG：

| 设置 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| Port | int32 | 8765 | HTTP 端口（被占用时自动递增，最多重试 10 次） |
| bAutoStart | bool | true | 编辑器启动时自动启动服务器 |
| RequestTimeoutSeconds | int32 | 30 | 工具执行超时时间 |
| CompileTimeoutSeconds | int32 | 120 | 编译超时时间 |

## MCP 连接

插件会在 Unreal Editor 内运行 HTTP 服务器，AI 客户端通过 MCP 协议连接。

**MCP URL**：`http://127.0.0.1:8765/mcp`

编辑器打开时服务器会自动启动（可通过 `bAutoStart` 配置）。如果 8765 端口被占用，插件会自动递增端口，工具栏将显示实际 URL。

### 版本与保存排障

布局诊断新增父节点边界、有限深度裁切祖先与换行文字高度溢出线索；`Unverified*` 不是通过。属性 Set 工具新增 `ResetToClassDefault`，样式支持显式 RoundedBox/outline、清除 Brush 资源和按钮 normal/pressed padding。结构化布局、会话令牌及命中检查见 [布局、会话与命中检查](#layoutandsession)；图片工作流见 [参考图到 UMG 工作流](#imagetoumg)。

- 运行时能力以当前编辑器返回的 `tools/list` 为准。更新源码或安装包后，已经运行的编辑器不会自动换用新 DLL；工具数量不符时先核对部署目录并重启目标编辑器。
- `SaveWidgetBlueprint` 保存失败时检查项目日志的 `LogSavePackage`。Windows `Error 32` 通常表示同一项目仍有旧 `-game`、PIE 或第二编辑器进程占用资产；只关闭命令行明确指向该项目的遗留进程，再重试精确保存。
- Patch 已成功而保存失败时，不要改用 Save All、外部覆盖或重复 Patch。解除文件锁后直接重试 `SaveWidgetBlueprint`，避免重复执行已生效的内存修改。
- `CaptureRuntimeWidgetScreenshot` 需要加载 MCPUMG 编辑器模块并存在目标运行态 Widget；单独的 `-game` 进程不保证提供 MCPUMG 服务。

### Claude Code

添加到 `~/.claude/.mcp.json`（全局）或项目根目录的 `.mcp.json`：

```json
{
  "mcpServers": {
    "ue-umg": {
      "url": "http://127.0.0.1:8765/mcp"
    }
  }
}
```

### 其他 AI 客户端

Cursor、Windsurf、VS Code Copilot 等 MCP 客户端的配置方式各不相同。服务器 URL 保持一致，具体添加 MCP 服务器的方法请查阅所用 AI 工具的文档。

## 要求

- Unreal Engine 5.2+
- 仅限编辑器
- 可选：[MCPBlueprint](/zh/docs/guides/ue-tools/mcp-blueprint-guide/)，用于 Blueprint 图表编辑（Widget 事件逻辑的高级图表操作会调用 MCPBlueprint 工具）

如有问题或反馈，请访问[统一联系页面](https://mzsh.me/contact/)，添加我的微信。

## ImageToUMG

### 参考图到 UMG 工作流

MCPUMG 不在插件内部连接图片模型，也不保存模型密钥。AI 客户端负责理解参考图、核对文字、拆分可复用组件并生成结构化规格；MCPUMG 只负责确定性地校验、构建、测量和保存 Unreal Engine 资产。

#### 工作流

1. 调用 `GetUIDesignCapabilities` 读取当前 Schema、限制和支持的 Widget/样式能力。
2. AI 根据参考图生成 `schemaVersion=1` 的 Widget 规格，并明确设计尺寸、布局假设和素材来源。
3. 调用 `ImportUITexture` 导入 PNG/JPEG；默认禁止覆盖已有资产。
4. 调用 `ApplyWidgetTreePatch` 的 `dryRun` 预演完整树或增量操作。
5. `dryRun` 返回模拟结果；正式执行继续使用预演前的 `expectedRevision`、`expectedFingerprint`，把 `dryRun` 改为 `false` 后重新获取 canonical `inputHash`，再执行同一组 operations。
6. 使用 `SetWidgetStyle` 应用结构化 Brush、文字或按钮状态样式。
7. 使用 `ExportWidgetSpec` 和 `GetWidgetTree` 读回结构与属性。
8. 使用 `InspectWidgetLayout` 检查屏幕像素边界、裁剪、文本溢出和资源状态。
9. 使用 `CaptureWidgetScreenshot` 或 `CaptureRuntimeWidgetScreenshot` 取得设计态或运行态画面。
10. 使用 `CompareUIImages` 与参考图比较，AI 根据差异生成下一轮 Patch。
11. 验证完成后分别调用 `SaveWidgetBlueprint` 和 `SaveUIAsset` 精确保存目标包。

#### 运行版本与文件锁预检

- 每次开始前都以运行中编辑器的 `tools/list` 为准。源码仓库或安装目录已更新，不代表已经打开的编辑器进程加载了新 DLL；工具数量或能力描述不一致时，先确认部署目录，再重启目标编辑器。
- 同一项目的旧 `-game`、PIE 或第二个编辑器进程可能仍持有 `.uasset` 文件句柄。`SaveWidgetBlueprint` 失败时先查看项目日志中的 `LogSavePackage` 与系统错误码；Windows `Error 32` 表示共享冲突，应只关闭命令行明确指向同一项目的遗留进程，然后重试精确保存。
- 不用 `Save All`、外部文件覆盖或重复 Patch 绕过文件锁。Patch 已成功但保存失败时，内存态仍可能是新版本；先保留当前编辑器，再解除锁并调用 `SaveWidgetBlueprint`，不要重新提交同一写操作。
- `CaptureRuntimeWidgetScreenshot` 依赖已加载 MCPUMG 编辑器模块且已经存在目标 Widget 实例。仅以 `-game` 启动的进程不保证加载编辑器模块；需要运行态测量时，使用加载了插件的编辑器 PIE/Game 会话。

#### Widget Spec v1

顶层规格包含：

- `schemaVersion`：固定为 `1`。
- `BlueprintPath`：唯一目标 Widget Blueprint。
- `expectedRevision`、`expectedFingerprint`：乐观并发门禁。
- `requestId`、`inputHash`：幂等调用标识。
- `dryRun`：预演或正式执行；改变该字段后必须重新计算 `inputHash`。
- `operations`：`create`、`set`、`move`、`rename`、`remove`。

节点以稳定名称标识，包含 `class`、`parent`、`order`、`properties` 和 `slot`。插件在修改前验证单根、循环、容器兼容性、名称、属性、Slot、节点数量、深度和累计文本预算。错误应返回精确 JSON Pointer。

#### 样式与素材

##### 布局检查不等于布局通过

`dryRun` 只校验树和属性合法性，不执行 Slate 排版。`InspectWidgetLayout` 的 Design 模式只提供元数据；PIE 模式增加直接 Slate 父节点边界、最多 64 层裁切祖先（每页最多输出 256 条），以及包括自动换行文字在内的纵向溢出线索。`PossibleAncestorClipping` 和 `PossibleVerticalOverflow` 需要结合实际截图定位；`Unverified*` 表示没有足够证据，不是通过。

祖先矩形采用屏幕空间轴对齐包围盒，并非最终绘制裁切区。旋转、OnDemand、ClipToBoundsWithoutIntersecting、自定义绘制和缓存几何时效均可能影响判断。工具不为诊断创建实例、强制预览数据或改变运行状态。先让真实页面完成布局，再检查目标实例。

##### 属性更新、清零与恢复默认

`SetWidgetProperties` 和 `SetSlotProperties` 保持默认部分更新。`Properties={}` 无效；`Padding="()"` 保留旧结构成员，不会清零。设零请显式给出四边：`(Left=0,Top=0,Right=0,Bottom=0)`。

新增可选 `ResetToClassDefault=true`：只将 `Properties` 中指定的顶层字段恢复为该 Widget/Slot 类 CDO 默认值，再导入提供的值；不影响其他字段，不修改类默认对象。它不代表零值、不读取父蓝图实例覆盖值。返回 `PropertyUpdateMode` 区分 `PatchCurrentValue` 与 `ResetToClassDefault`。

##### 显式圆角和按钮内边距

`SetWidgetStyle` 的 Brush 支持 `drawType="RoundedBox"`；`outline` 是完整对象，必须提供四角、宽度、颜色及 `roundingType`。使用 `FixedRadius` 才会按四角值绘制；`HalfHeightRadius` 是胶囊模式。`resource:null` 显式清除 Brush 资源。未提供字段保留原值。

```json
{
  "Brush": {
    "drawType": "RoundedBox",
    "outline": {
      "topLeft": 4, "topRight": 4, "bottomRight": 4, "bottomLeft": 4,
      "width": 1,
      "color": {"r": 0.4, "g": 0.25, "b": 0.06, "a": 1},
      "roundingType": "FixedRadius"
    }
  }
}
```

按钮使用 `Style.Button.normalPadding` / `pressedPadding`，每个包含 `left/top/right/bottom` 四个数字，支持显式零和有限负值（有意重叠）。按钮样式 padding 与 ButtonSlot padding 相加；九宫格 Brush.margin 不是内容内边距。结构化样式的数值必须使用 JSON number，嵌套未知字段会被拒绝，整次调用在修改前校验。

`SetWidgetStyle` 使用 JSON 对象，不要求调用方拼接 UE 文本结构：

- Brush：资源、绘制方式、图像尺寸、颜色、九宫格 Margin、平铺和 UV。
- Text：颜色和字号。
- Button：Normal、Hovered、Pressed、Disabled 四种 Brush。

纹理导入显式设置 sRGB、UI 压缩、无 Mip 和 UI Texture Group。材质只能引用已经存在且实际 `MaterialDomain == MD_UI` 的 Material Instance；插件不会根据图片任意生成材质图。

#### 安全边界

- `dryRun` 不修改真实 Widget Blueprint，不编译、不保存。
- 单次 Patch 只操作一个 Widget Blueprint；跨包操作不宣称原子性。
- 修改前完整演算最终树，成功后只刷新和编译一次。
- 删除或重命名会同步同一 Widget 树内可安全迁移的导航绑定；遇到外部蓝图图表、动画、事件、变量、C++ `BindWidget` 等无法证明安全的依赖时拒绝执行。
- 图片文件、解码像素、Widget 数量、层级、请求文本和响应正文均有硬预算。
- 任何保存操作只接受一个精确目标包，不执行 Save All。
- 参考图不能唯一表达交互、遮挡内容和响应式规则；AI 必须在规格中记录假设，插件不猜测业务逻辑。


## LayoutAndSession

### 布局、会话与命中检查

#### 连接到正确的项目

`initialize` 返回 `_meta.mcpumgContext`：ProjectFile、ProjectName、EngineVersion、PluginVersion、ProcessId、ActualPort、SessionId。端口可因占用而变化，使用返回值确认实际项目。SessionId 绑定服务器对象生命周期，重建服务器对象后改变。

后续调用可以在 **params._meta** 中携带令牌；不要把它放入业务 arguments。

```json
{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"GetWidgetTree","arguments":{"BlueprintPath":"/Game/UI/WBP_Menu"},"_meta":{"MCPUMGExpectedSessionId":"从initialize读取"}}}
```

错误类型或过期令牌在工具执行前拒绝。省略令牌兼容旧客户端；这是防止误操作其他编辑器的检查，不是身份认证机制。

#### 结构化布局

`SetWidgetLayout` 接受 BlueprintPath、WidgetName、Layout 与可选 dryRun。只修改指定控件或它已有的 Slot，不自动包裹、换父级、修改父控件或保存。

| Layout 区域 | 目标 | 参数 |
|---|---|---|
| sizeBox | 目标自身为 SizeBox | widthOverride、heightOverride：非负数字；null 清除该覆盖 |
| canvas | CanvasPanelSlot | anchors.min/max（x/y）、offsets 四边、alignment（x/y）、autoSize、zOrder |
| box | HorizontalBoxSlot / VerticalBoxSlot | size.rule 为 Auto/Fill，Fill 可带正 weight；padding、hAlign、vAlign |
| slot | Button/Border/Overlay/SizeBox/ScrollBox/HorizontalBox/VerticalBox Slot | padding、hAlign、vAlign |

hAlign 为 Left/Center/Right/Fill，vAlign 为 Top/Center/Bottom/Fill。padding 和 offsets 都使用 left/top/right/bottom 四个 JSON 数字。不能在 box 和 slot 重复指定相同字段。

```json
{
  "BlueprintPath":"/Game/UI/WBP_Menu",
  "WidgetName":"StartButton",
  "dryRun":true,
  "Layout":{"canvas":{
    "anchors":{"min":{"x":0,"y":0},"max":{"x":0,"y":0}},
    "offsets":{"left":20,"top":30,"right":170,"bottom":60},
    "alignment":{"x":0,"y":0},"autoSize":false,"zOrder":2
  }}
}
```

Canvas 未拉伸的轴：right/bottom 是宽高；拉伸轴：right/bottom 是原生 UMG 的右/下边距。坐标相对于直接父容器，不是整个屏幕。sizeBox null 清除覆盖并不等于宽高0；省略字段保留当前值。

dryRun 验证参数、类型和适用目标，不执行实际排版；成功不证明无重叠。正式执行把 dryRun 改为 false，读回 GetWidgetProperties，验证后 SaveWidgetBlueprint 精确保存。

#### 解释裁切与缩放

使用 InspectWidgetLayout 的 PIE 模式读取实际尺寸、布局缩放、父节点边界、裁切祖先和文本溢出线索。Design 模式不能给出真实排版结论。Unverified 不表示通过；旋转包围盒、条件裁切、缓存过期等仍需结合截图。

Button 样式 NormalPadding 与 ButtonSlot Padding 相加。子控件不能直接使用外层 SizeBox 的尺寸作为可用空间；应核对内部实际布局。

#### 检查按钮为什么无法命中

`InspectWidgetHitTest` 接受 BlueprintPath、WidgetName 和可选 InstanceIndex。默认检查目标中心；可成对提供 LocalX/LocalY（目标自身局部坐标）。只查询目标窗口的缓存命中网格，不移动鼠标、不发送点击、不改变焦点。

结果包含 bTargetOnHitPath、目标启用/可见性、键盘焦点及最多64个 Slate 路径节点。TargetNotOnCachedHitPath 可能来自遮挡、禁用、命中可见性或缓存状态，不能直接等同于某一种故障。其他窗口、鼠标捕获和实际事件执行不在该诊断范围内。没有运行实例或有效几何时明确失败。

建议顺序：确认会话 → 读取布局 → 检查命中 → 调整布局/属性 → 读回 → 真实交互测试 → 精确保存。


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

## Components

### 组件实例与 Named Slot

#### 为 Named Slot 创建内容

`SetNamedSlotContent` 在指定 Widget Blueprint 的控件树中查找 `HostWidgetName`，对其 `SlotName` 执行 `Create`（默认）、`Replace`、`Clear` 或 `Move`。宿主可以是原生实现 `INamedSlotInterface` 的控件，也可以是已经成功编译、公开 Named Slot 的嵌套 UserWidget。

```json
{
  "BlueprintPath": "/Game/UI/WBP_Page",
  "HostWidgetName": "DetailsArea",
  "SlotName": "Header",
  "WidgetClass": "TextBlock",
  "WidgetName": "Txt_DetailsHeader",
  "bIsVariable": true,
  "dryRun": true
}
```

先以 `dryRun: true` 检查宿主、槽名、类、名称、编译状态和循环引用，再将它改为 `false` 执行。成功后使用 `GetWidgetTree` 或 `GetWidgetProperties` 读回，并显式调用 `SaveWidgetBlueprint`；工具自身不会保存。

`Create` 要求目标槽为空；`Replace` 和 `Clear` 必须提供当前内容的 `ExpectedContentName`，以防状态过期。`Move` 用 `ExistingWidgetName` 指定同一控件树内的现有控件，目标槽须为空。先按操作执行 dry run，核对依赖与返回状态，再应用并保存。

#### 设置嵌套 UserWidget 的实例参数

`SetWidgetInstanceProperties` 修改宿主 Widget Blueprint 控件树里某个嵌套 UserWidget 实例的可编辑字段。它不会修改被引用 Widget Blueprint 的类默认值，不会调用任意函数，也不会写入业务 Data Asset。

```json
{
  "BlueprintPath": "/Game/UI/WBP_Page",
  "WidgetName": "CardInstance",
  "Properties": {
    "Title": "炼丹房",
    "AccentColor": "(R=0.15,G=0.8,B=0.55,A=1.0)"
  }
}
```

字段必须在该实例上可编辑，值使用 UE 文本格式。变量不必标记 `ExposeOnSpawn`；是否可写取决于编辑器属性标记和 `CanEditChange`。`ResetToClassDefault: true` 会先从嵌套控件类默认对象取得每个指定字段的默认值，再导入传入文本。空 `Properties`、结构关系字段和所有值均未变化的调用会被拒绝。

执行后读回目标实例属性，再调用 `SaveWidgetBlueprint`。保存后关闭并重新打开资产，实例参数与 Named Slot 内容应保持不变。

## CommonStyles

### 通用控件样式

`SetWidgetStyle` 的 `Brush`、`Text`、`Button` 接口保持不变。所有对象会在开启事务前完整解析；未知字段、JSON 类型不符、资源不存在或资源类型不匹配都会失败，且不修改目标控件。

#### 扩展控件

CheckBox、Slider、ProgressBar、EditableTextBox、ScrollBar、ComboBoxString 使用 `Style.Extended`。字段名是引擎对应 `WidgetStyle` 或控件自身的公开反射字段名；仅支持 `FSlateBrush`、`FSlateColor`/`FLinearColor`、`float`、`bool`。例如：

```json
{"Extended":{"CheckedImage":{"drawType":"Box"},"ForegroundColor":{"r":0.2,"g":0.4,"b":0.6}}}
```

常用 Brush 包括 CheckBox 的 `UncheckedImage`/`CheckedImage`，Slider 的 `NormalBarImage`/`NormalThumbImage`，ProgressBar 的 `BackgroundImage`/`FillImage`，EditableTextBox 的 `BackgroundImageNormal`/`BackgroundImageFocused`，ScrollBar 的 `NormalThumbImage`，以及 ComboBoxString 可直接反射的样式字段。Slider 的 `Value`、`MinValue`、`MaxValue`、`StepSize` 和 ProgressBar 的 `Percent`/`FillColorAndOpacity` 也可在该对象中设置。复杂嵌套样式（例如 ComboBox 的内部 ButtonStyle）不在本接口范围内。

#### 文本与富文本限制

TextBlock 的 `Text` 支持 `color`、`fontSize`、已有 `/Game` 或 `/Engine` **UFont** 的 `font`、`typefaceFontName`、`letterSpacing`、`lineHeight`、`wrapTextAt`、`autoWrap` 和 `ellipsis`。`ellipsis:false` 明确设置原生 Clip 策略。裸 `FontFace` 被拒绝：它不实现 Slate 所需的 `IFontProviderInterface`，会退回 fallback 字体。引擎原生 UFont（例如默认 Roboto）可用于样式和主题回放。

RichTextBlock 使用 `Style.RichText`：`textStyleSet` 必须是已有 `/Game` DataTable，且行结构**严格等于**引擎 `FRichTextStyleRow`；`decoratorClasses` 是已有、非 abstract `URichTextBlockDecorator` 子类的路径数组。工具仅引用并调用原生 `SetTextStyleSet`/`SetDecorators`，不会创建业务 Decorator。例如：

```json
{"RichText":{"textStyleSet":"/Game/UI/Styles/DT_RichText","decoratorClasses":["/Game/UI/Decorators/BP_LinkDecorator.BP_LinkDecorator_C"]}}
```

`ImportUIFont` 将一个本地 `.ttf`/`.otf` 导入为新的 `/Game` FontFace，并创建同名后缀 `_Font` 的 UFont；UFont 默认 typeface 持久引用该 FontFace，返回 `FontFacePath` 与可直接用于 `Text.font` 的 `FontPath`。`SourceFile`、`AssetPath` 为必填项，64 MiB 为源文件上限；两个目标包只要已存在、已加载为非空包或磁盘已存在即拒绝，避免覆盖或夹带保存。`bSave` 必须为布尔值，默认为 `false`；为真时精确保存这两个包。默认导入后可用 `SaveUIAsset` 分别按 FontFace/UFont 路径保存单包。工具使用 UE 5.2 至 5.8 实际提供的 `UFontFileImportFactory`（其基类 `FactoryCreateFile` 最终调用 FontFace 的原生二进制工厂）。

## Preview

### CaptureWidgetPreview

列表样本使用临时资产副本，不把原资产直接交给列表条目。副本引用的外部资源仍可能共享；Widget 生命周期与列表回调可以运行项目代码，这不是脚本沙箱。用于预览的业务逻辑应无副作用。

`CaptureWidgetPreview` 会创建一个已经编译的 Widget Blueprint 的全新临时实例，应用仅用于预览的数据，并返回离屏渲染的 PNG。它是设计预览，不是正在运行的游戏 Widget 截图。

该工具不会编辑或保存 Widget Blueprint、其 WidgetTree、已有 PIE/Game 实例，也不会修改作为列表样本传入的资产。它同样不会编译 Blueprint；请先显式编译，并确保 Blueprint 状态为 `UpToDate`。

#### 参数

| 参数 | 必填 | 说明 |
| --- | --- | --- |
| `BlueprintPath` | 是 | Widget Blueprint 资产路径。 |
| `Width`、`Height` | 是 | 正整数像素，每个不超过 4096，乘积不超过 8 MP。 |
| `InstanceProperties` | 否 | 临时 `UUserWidget` 实例的可编辑属性，格式为 `{ "Property": "UE 文本格式" }`。 |
| `WidgetOverrides` | 否 | 最多 64 个 `{ "name": "WidgetName", "properties": { ... } }`；属性只作用于临时树中对应的 Widget。 |
| `ListSamples` | 否 | 最多 64 个 `{ "name": "ListWidgetName", "items": ["/Game/...Asset.Asset"] }`；数据只绑定到临时 ListView/TileView/TreeView。每个列表最多 100 个项目，单次调用共最多 200 个；允许空列表。 |
| `AnimationName`、`TimeSeconds` | 否 | 必须成对提供。时间是非负且位于 MovieScene 播放范围内的绝对轴时间，不是从动画开头算起的偏移。 |

每个 `WidgetOverrides` 条目都必须提供非空的 `properties`。`WidgetOverrides` 中的 Widget 名称、`ListSamples` 中的列表名称必须各自唯一。同一列表中重复的资产路径会被拒绝。每个 `properties` 映射的值都使用 Unreal 文本格式，规则与 `SetWidgetProperties` 相同。

```json
{
  "BlueprintPath": "/Game/UI/WBP_Inventory",
  "Width": 1280,
  "Height": 720,
  "InstanceProperties": { "Title": "预览背包" },
  "WidgetOverrides": [
    { "name": "TitleText", "properties": { "RenderOpacity": "0.8" } }
  ],
  "ListSamples": [
    { "name": "ItemList", "items": ["/Game/Items/DA_Sword.DA_Sword"] },
    { "name": "EmptyStateList", "items": [] }
  ]
}
```

响应会明确给出 `PreviewState: TemporaryNewInstance`、`RuntimeState: NotRuntime`、`ProductionState: Unchanged` 与 `SaveStatus: NotSaved`，并附带 PNG。还会返回实际 RenderTarget 尺寸、像素数、两次布局渲染，以及实际应用的 Widget 覆盖和列表样本计数。

指定动画时，工具在临时动画副本上以静默 MovieScene 评估器采样视觉轨道，移除事件轨道，并返回量化后的 `ActualTimeSeconds`。支持的视觉轨道包括 Float、Bool、Enum、Color、2D Transform、Margin 和 Widget Material；其他轨道不能当作通用脚本执行。此机制不阻止 Widget Construct 或列表回调中的项目代码。

Widget Material 动画会为轨道实际使用的每个材质位置创建独立的动态材质实例（MID），复制原实例的参数覆盖，并只替换临时 Widget 的对应画刷。采样不会修改共享的源 MID 或其他 Widget。画刷必须使用有效的 MID，且其父材质必须有效、不能也是 MID。带有运行时虚拟纹理、稀疏体积纹理、纹理集合或参数集合覆盖的 MID 无法完整复制，工具会拒绝这类预览。

创建任何 `UUserWidget` 都会进入其 Blueprint 构造生命周期。该工具不会调用项目特定初始化方法或任意 Blueprint 函数，但用户编写的 Construct 代码本身可能有副作用，因此无法承诺所有 Blueprint 都是纯函数。

## RuntimeWorkflow

### 运行时交互与诊断

这些工具操作已经存在的 PIE/Game `UUserWidget` 实例。先运行目标页面，再用 `ListRuntimeWidgets` 的 `BlueprintPath` 查找实例；返回的 `Instances[].RuntimeInstanceToken` 绑定当前 Widget、World、会话和本地玩家。PIE 重启或 Widget 重建后重新取令牌。`InstanceIndex` 仍可用于旧版只读检查，但需要运行时令牌的工具不可用索引代替。令牌用于定位，不是身份认证。

```json
{"BlueprintPath":"/Game/UI/WBP_Inventory","Offset":0,"MaxItems":32}
```

`InspectWidgetRuntime` 使用 `RuntimeInstanceToken` 读取命名子控件（`WidgetName`），或用 `Offset`、`MaxItems` 分页读取运行中 WidgetTree；`MaxItems` 默认 100，最大 200。实际输入操作前，先检查目标控件和窗口状态。

#### 输入、列表与操作编号

`InteractWithWidget` 必填 `RuntimeInstanceToken`、精确 `WidgetName`、`Action` 和调用者生成的 `RequestId`。`Action` 为 `Click`、`Wheel`、`Text`、`Drag`、`DragDrop` 或 `Navigate`；分别按需要提供 `WheelDelta`、`Text`、归一化终点 `EndX`/`EndY`、`DropWidgetName`，或 `Direction` 与可选 `Device`。文本限制为 1–128 个可打印 BMP 字符；此工具不提供 IME、控制字符或剪贴板输入。输入作用于目标运行时窗口，执行前请确认它正是要操作的页面。

`ControlWidgetList` 必填 `RuntimeInstanceToken`、`ListName` 和 `Action`。先用 `Action: "Snapshot"` 取得列表项 `ItemToken`；随后可 `Select`、`AddSelection`、`Deselect`、`ClearSelection`、`ScrollIntoView`、`Expand`、`Collapse`，或对 ScrollBox 使用 `ScrollWidgetIntoView` 与 `TargetWidgetName`。除 `Snapshot` 外，修改操作需要 `RequestId`；除 `Snapshot`、`ClearSelection` 外，需要快照中的 `ItemToken`。

每个新动作使用新的 `RequestId`；仅在重试完全相同的请求时复用。参数冲突的复用会被拒绝。启动后返回 `OperationId` 的工具可用 `GetRuntimeOperation` 查询 `Status`、`Data` 和错误；状态可能是 `Pending`、`Completed`、`Failed`、`Cancelled`、`TimedOut`、`Invalidated`，过期或未知编号返回 `Unknown`。`CancelRuntimeOperation` 只接受仍在等待的 `OperationId`。取消可能仍需清理，`bCleanupPending` 表示尚未确认最终状态；继续查询直至结束。已完成结果只短暂保留，不应把 `OperationId` 当永久记录。

#### 性能采样和 Trace

`InspectWidgetPerformance` 读取设计态结构复杂度，不能代替运行时测量。`MeasureWidgetPerformance` 必填 `RuntimeInstanceToken`、`RequestId`；可设 `Frames`（默认 30，最大 120）和 `MaxNodes`（默认 100，最大 500）。它汇总实际 Slate paint、invalidation、update 事件的逐 Widget **包含式 GameThread CPU** 时间，不是独占时间或 GPU 时间。用返回的 `OperationId` 查询结果。

`CaptureWidgetTrace` 仅用于有缓存 Slate Widget 的 PIE 实例，必填 `RuntimeInstanceToken`、`RequestId`，`DurationSeconds` 可选（默认 3，范围 0.1–10 秒）。它启动进程级原生 Slate Trace；已有 Trace 正在运行或收尾时不会接管。结束后用 `GetRuntimeOperation` 查看 `Data.TraceStatus`、`TracePath`、实际字节数及清理状态。Trace 包含整个进程，需在 Unreal Insights 中按返回的目标 Slate Widget ID 过滤；它不是该 Widget 的独占或 GPU 计时。文件最终仅在已关闭且不超过 **16 MiB** 时保留，超限或取消会丢弃；`CleanupPending` / `CleanupUnconfirmed` 表示还不能把文件当成可用结果。

运行时操作不会保存 Widget Blueprint。设计态修改仍需显式调用相应保存工具；能力与参数以当前编辑器的 `tools/list` 为准。

## Themes

### Widget 主题

`ExportWidgetTheme` 从指定的 Image、Border、TextBlock 或 Button 导出可移植的版本 1 主题；`ApplyWidgetTheme` 将该主题应用到另一份具有相同控件名称和类的 Widget Blueprint。导出只读取资产；应用在一个事务中修改内存，不会自动保存。

#### 导出主题

`BlueprintPath` 和唯一的 `WidgetNames` 数组为必填项，最多 64 个控件。仅导出可以完整表示的样式：Brush、Text 以及 Button 的四种状态和 padding。动态 Slate 颜色、非 `/Game` 的 Brush 资源、非 UFont 的文字资源会被拒绝，避免产生不完整的主题；文字 UFont 可以位于 `/Game` 或 `/Engine`，因此默认 Roboto 也能导出并回放。当前不导出布局；导出的样式重新应用时不会改变布局。

```json
{
  "BlueprintPath": "/Game/UI/WBP_MainMenu",
  "WidgetNames": ["PlayButton", "TitleText"]
}
```

`uv` 使用 `{"minX","minY","maxX","maxY"}` 形式；没有有效 UV 覆盖时输出 `uv: null`，重新应用时会清除目标已有的 UV 覆盖。

#### 应用主题

`ApplyWidgetTheme` 需要 `BlueprintPath` 和 `Theme`。主题根对象只能是 `{"version":1,"rules":[...]}`，规则数为 0 至 64；每条规则以精确的 `name` 和 UObject `class` 定位目标。可选 `dryRun: true` 使用相同的完整预检但不修改资产。

```json
{
  "BlueprintPath": "/Game/UI/WBP_Options",
  "dryRun": true,
  "Theme": {
    "version": 1,
    "rules": [
      {
        "name": "PlayButton",
        "class": "Button",
        "style": {
          "Button": {
            "normal": {
              "resource": null,
              "drawType": "RoundedBox",
              "imageSize": {"x": 96, "y": 36},
              "tint": {"r": 0.1, "g": 0.4, "b": 0.9, "a": 1},
              "margin": {"left": 4, "top": 4, "right": 4, "bottom": 4},
              "tiling": "NoTile",
              "uv": null
            },
            "normalPadding": {"left": 8, "top": 4, "right": 8, "bottom": 4}
          }
        }
      }
    ]
  }
}
```

`style.Brush` 支持 `resource`、`drawType`、`imageSize`、`tint`、`margin`、`tiling`、`uv` 和 `outline`；`style.Text` 支持 TextBlock 的颜色、`/Game` 或 `/Engine` UFont、字号、typeface、字距、行高、换行和省略；`style.Button` 支持 `normal`、`hovered`、`pressed`、`disabled` 及 `normalPadding`、`pressedPadding`。`layout` 使用 `SetWidgetLayout` 的既有字段。未提供的字段保留当前值。

未知字段、重复的名称/类组合、目标不存在、类不匹配、不兼容的样式通道、无效布局或无效资源都会拒绝整个请求。主题最多命中 256 个目标；非 dry-run 成功后请按需要调用 `SaveWidgetBlueprint` 保存。

## PreviewMatrix

### CaptureWidgetPreviewMatrix

`CaptureWidgetPreviewMatrix` 以 `States × Sizes` 生成一组设计预览 PNG。每个格子都会创建全新的临时 Widget 实例，因此不同状态不会相互污染；结果按状态名、尺寸名排序，`Cells[].PngIndex` 对应返回图片数组的索引。

`States` 与 `Sizes` 必填且非空，笛卡尔积最多 16 格，累计像素最多 32 MP；每张图片仍受 `CaptureWidgetPreview` 的 4096 单边和 8 MP 限制。每个状态可包含同名工具已有的 `InstanceProperties`、`WidgetOverrides` 和 `ListSamples`。

`ListSamples.items` 支持安全顶层资产路径字符串，或 `{ "class": "...", "properties": { ... } }` 动态样本。动态类必须是非 abstract、未废弃、`Within=UObject` 的 `UDataAsset` 或 `UCurveBase` 派生类；Actor、ActorComponent、World、GameInstance、Subsystem 等类型一律拒绝。`UDataAsset` 本身是 abstract，必须提供项目中的具体子类；也可以使用 `/Script/Engine.CurveFloat`。属性先在 CDO 验证，再通过 `NewObject` 在 transient package 创建对象。工具不会调用任意函数、保存对象或写入业务资产。已有样本会逐格复制到 transient package，避免条目逻辑直接修改源资产或跨状态共享同一实例。

这不是递归隔离：资产的外部引用、以及 Widget Construct/列表条目代码对外部系统产生的副作用仍不能由本工具阻止。

```json
{
  "BlueprintPath": "/Game/UI/WBP_Inventory",
  "States": [
    { "name": "empty", "ListSamples": [{ "name": "ItemList", "items": [] }] },
    { "name": "populated", "ListSamples": [{ "name": "ItemList", "items": ["/Game/Items/DA_Sword.DA_Sword"] }] },
    { "name": "curve", "ListSamples": [{ "name": "ItemList", "items": [{ "class": "/Script/Engine.CurveFloat" }] }] },
    { "name": "disabled", "WidgetOverrides": [{ "name": "BuyButton", "properties": { "bIsEnabled": "False" } }] }
  ],
  "Sizes": [
    { "name": "phone", "width": 390, "height": 844 },
    { "name": "desktop", "width": 1280, "height": 720 }
  ]
}
```

这仍是 `TemporaryNewInstance` 设计态预览，不代表 PIE/Game 运行状态。当前阶段不接受动画时间参数，避免在跨 UE 版本时把未实际评估的动画帧误报为截图结果。

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

## ComponentExtraction

### 提取可复用组件

`ExtractWidgetComponent` 将指定 WidgetTree 子树提取为新的 `/Game` Widget Blueprint。默认 `ReplaceSource:false` 只复制，源蓝图不变；设为 `true` 时会在一次编辑器事务中以新组件实例替换源位置，`InstanceName` 可指定实例名（默认原控件名）。目标必须是新资产路径；已有磁盘包或非空内存包都会被拒绝。

复制保留原生控件属性、普通 `bIsVariable` 标记、内部子节点层级及原生 Slot 属性。`DependencyMode` 默认 `Reject`；选择 `MigrateSupported` 可迁移子树内的 NamedSlot 内容，以及绑定全部闭合于子树、只有属性轨道且没有动态绑定函数的动画。跨子树动画、非属性轨道、图表引用、继承的 `BindWidget`/`BindWidgetOptional`、编辑器委托绑定、默认焦点、UI Components、自定义或跨子树导航等依赖仍会被拒绝。

```json
{
  "BlueprintPath": "/Game/UI/WBP_Menu",
  "WidgetName": "CardPanel",
  "AssetPath": "/Game/UI/WBP_Card",
  "dryRun": true
}
```

先使用 `dryRun:true` 查看 `WouldChange`、`Dependencies` 及可能的 `PreflightError`；确认后改为 `false` 创建组件。新蓝图会在内存中编译，但不会自动保存。若替换源位置，还需保存源蓝图；对各自路径调用 `SaveWidgetBlueprint`。

工具不会把源页面的业务图表搬入组件。

## BatchMigration

### 批量属性迁移

`BatchSetWidgetProperties` 默认 `dryRun:true`。每个目标均须提供 `ExportWidgetSpec` 返回的 `expectedFingerprint`；任一指纹过期、目标重复或属性非法时，整个请求零改动。最多 16 个 WBP、256 个控件。

实际执行按 WBP 各自一个 Undo 事务，均标为未保存；不会自动编译或保存，也不支持 Slot、关系或结构迁移。写后会逐字段反射核验；异常时结果整体为 error，并逐包报告 `Applied`、`Failed` 或 `NotAttempted`，但不会谎称跨包回滚。可对已应用包分别使用编辑器 Undo。全部目标本来已相同则报告 `NoChange`，不建立事务或弄脏包。

## Performance

### Widget 性能结构诊断

`InspectWidgetPerformance` 只读取一个 Widget Blueprint 的设计态 WidgetTree，并汇总可能影响 UI 复杂度的结构性信号。它不会创建 Widget、进入 PIE、编译、保存或修改资产。

```json
{
  "BlueprintPath": "/Game/UI/WBP_Inventory",
  "MaxWidgets": 500
}
```

`BlueprintPath` 为必填 Widget Blueprint 资产路径。`MaxWidgets` 可选，默认 `500`，必须是 `1` 到 `1000` 的 JSON 整数；不接受小数、字符串或布尔值。达到上限时返回 `bTruncated: true`，这表示统计只覆盖已遍历的前缀，不能将其视为全树总数。

#### 返回内容

- `MeasurementStatus` 固定为 `AuthoredIndicatorsOnly`，说明结果是已编辑结构的信号，不是实测性能。
- `WidgetsAnalyzed`、`MaxDepth` 与 `WidgetClassCounts`：已分析节点数、最大树深度和控件类计数。
- `PanelComplexity`：Canvas Panel 与 Overlay 的实例数，以及各自单个容器的最大直接子控件数。
- `PropertyBindingCount`：Widget Blueprint 中的属性绑定条目数。
- `VolatileWidgetCount`、`RetainerBoxCount`、`InvalidationBoxCount`、`ListViewCount`：对应控件或标记的实例数。
- `bCycleDetected`：Widget 在当前递归路径中再次出现时为 `true`。工具会停止该路径，避免循环导致无界遍历。
- `bDuplicateReferenceDetected`：已经统计过的 Widget 又从另一条路径可达时为 `true`。共享引用会去重，不会被误报为循环。
- `bTruncated`：分析节点达到 `MaxWidgets` 时为 `true`。

这些指标不能给出毫秒、CPU、GPU、内存、Slate Tick/Paint 开销或实际运行时失效行为。它们用于找出值得进一步观察的结构，例如过深的层级、大量直接子控件、过多绑定或易失控件。需要在运行中的 Widget 上取样时，使用 `MeasureWidgetPerformance`；需要有限时长的原生 Trace 时，使用 `CaptureWidgetTrace`，并遵循[运行时工作流](#runtimeworkflow)中的目标与清理规则。进一步分析可使用 Unreal Insights；检查实际 Slate 层级、无效化和绘制行为可使用 Widget Reflector。

## OptionalUIFrameworks

### 可选 UI 框架

MCPUMG 可在项目已经启用 CommonUI 或 ModelViewViewModel（MVVM）时使用对应工具。先调用 `GetUIFrameworkCapabilities` 查看每个框架的状态：`NotInstalled`、`InstalledDisabled`、`EnabledNotLoaded` 或 `Available`。该查询不会改变项目、模块或资产状态。

若要使用可选框架，请由项目负责人按项目需要手动启用插件并重启编辑器；MCPUMG 不会代为启用插件或加载已禁用模块。

`GetUIFrameworkCapabilities.ModelViewViewModel.State` 只描述原生 MVVM；`EnhancedModule.OptInModuleDeclared`、`ModuleLoaded`、`CanWriteBindingsNow` 与 `AvailabilityReason` 才描述 `MCPUMGMVVM` 增强模块。基础版即使原生 MVVM 状态为 `Available`，也不提供完整 Binding 写入。增强版本需要包含并加载 `MCPUMGMVVM` Editor 模块，同时启用原生 `ModelViewViewModel` 插件；仅修改安装包描述文件而没有相应构建产物不能获得这些工具。以运行中编辑器的 `tools/list` 为准。

#### CommonUI

`ConfigureCommonUIWidget` 只修改指定 Widget Blueprint 树里的现有实例。参数为 `BlueprintPath`、`WidgetName`、`Properties`，可选 `dryRun` 可在不修改资产前检查完整请求。

```json
{
  "BlueprintPath": "/Game/UI/WBP_Menu",
  "WidgetName": "ConfirmButton",
  "Properties": {"bIsLocked": "True"},
  "dryRun": true
}
```

支持的控件及字段范围如下：

| 控件 | 可配置内容 |
| --- | --- |
| CommonButtonBase | Style、锁定/选择/切换行为、点击/触摸/按键方式和传统 TriggeringInputAction |
| CommonActivatableWidget | Back、自动激活、焦点/模态，以及激活/停用可见性 |
| CommonTextBlock | Style、ScrollStyle、MobileFontSizeMultiplier |

工具只接受通过控件家族白名单、编辑条件和可编辑性检查的字段；不会调用 CommonUI 函数、修改 Style 默认对象、配置 Enhanced Input、启用插件或自动保存。

`ConfigureCommonUIInput` 可对现有 CommonUI Widget 的白名单输入字段做 `dryRun`，再写入既有持久资产引用。按控件类型，支持 `CommonButtonBase.TriggeringEnhancedInputAction`、`CommonActivatableWidget.InputMapping`/`InputMappingPriority`，以及 `CommonActionWidget.EnhancedInputAction`/`InputActions`；参数为 `BlueprintPath`、`WidgetName`、非空 `Properties` 和可选 `dryRun`。它只校验字段与资产引用，返回的 `InputChainStatus: NotVerifiedByAssetConfiguration` 不表示整条输入链已经可用。

运行时用 `ListRuntimeWidgets` 取得令牌后，`InspectCommonUI` 可读取实例或指定 `WidgetName`；`ControlCommonUI` 的 `Action` 可为 `Activate`、`Deactivate`、`Push`、`Remove`。`Push` 需要容器 `WidgetName` 与已编译的 `WidgetClassPath`；`Remove` 使用当前堆叠目标的 `TargetToken`。操作现有实例，不会保存 Widget Blueprint；参见[运行时交互与诊断](#runtimeworkflow)。

#### MVVM

`GetMVVMView` 读取一个 Widget Blueprint 已有的 Context 和 Binding。它只读取，不会创建或修改 MVVM 数据。

`AddMVVMViewModelContext` 为现有 Widget Blueprint 添加一个真实 ViewModel Context。`BlueprintPath`、`ViewModelClass` 和 `CreationType` 均为必填项；`CreationType` 只能是 `Manual` 或 `CreateInstance`。

```json
{
  "BlueprintPath": "/Game/UI/WBP_Inventory",
  "ViewModelClass": "/Game/UI/VM/BP_InventoryViewModel.BP_InventoryViewModel_C",
  "CreationType": "CreateInstance"
}
```

ViewModel 类必须实现 `NotifyFieldValueChanged`，是当前有效的具体非 Widget 类，并允许请求的创建策略。该工具不会保存资产；添加后可用 `GetMVVMView` 检查 Context，再按需要显式编译和保存。

`ValidateMVVMBinding` 是只读预检，不会增删或修改 Binding。它只验证一个直接、类型完全一致的 `OneTime` 属性关系：来源可以是 ViewModel Context 或 Widget，目标必须是现有 Widget 的公开可写运行时属性。

```json
{
  "BlueprintPath": "/Game/UI/WBP_Inventory",
  "SourceType": "ViewModel",
  "SourceName": "InventoryViewModel",
  "SourceProperty": "Title",
  "DestinationWidgetName": "TitleText",
  "DestinationProperty": "Text",
  "BindingMode": "OneTime"
}
```

函数、嵌套路径、静态数组、转换函数、隐式转换、私有或 EditorOnly 属性，以及通知驱动的绑定模式不在本验证器范围内。

##### 主动启用的 MVVM 增强模块

增强模块另提供 `GetMVVMViewDetails`、`ValidateMVVMBindingAdvanced`、`SetMVVMBinding`、`RemoveMVVMBinding`、`UpdateMVVMViewModelContext`、`RemoveMVVMViewModelContext`。先读取现有 Context、Binding 的 GUID 与 fingerprint，再用只读验证器检查完整路径。`SetMVVMBinding` 新建时省略 `BindingId`；更新时同时给出 `BindingId` 和当前 `ExpectedFingerprint`。`SourcePath`、`DestinationPath` 是按顺序列出字段名的非空数组，不能写成点分字符串。

```json
{"BlueprintPath":"/Game/UI/WBP_Inventory","SourceType":"ViewModel","SourceName":"InventoryViewModel","SourcePath":["Title"],"DestinationWidgetName":"TitleText","DestinationPath":["Text"],"BindingMode":"OneTime"}
```

增强工具支持 `OneTime`、`OneWay` 与原生 `TwoWay`。通知驱动模式需要实际 FieldNotify 描述符；`TwoWay` 两端还须可读可写、类型相同。UE 5.2–5.8 的原生编译器不接受 **TwoWay 与转换函数同时使用**，因此工具会在写入前拒绝。单向绑定可用 `SourceToDestinationConversion` 指向已有、已加载、单参数的有效转换 `UFunction`；只填该字段，不提供反向转换。写工具会编译并在失败时尝试 Undo，但不保存资产。`RemoveMVVMBinding` 必填 `BindingId` 和 `ExpectedFingerprint`；更新或删除 Context 需精确 `ViewModelId` 与期望旧值。删除被绑定引用的 Context 时，`CascadeBindingIds` 必须恰好列出全部依赖 Binding ID，否则拒绝。最后按需要显式保存该 Widget Blueprint。

UE 5.2 的原生 MVVM 无法让通知绑定跨过非末段 UObject 属性进入另一个对象的字段。增强验证器和写工具会在修改前拒绝这类 `OneWay`、`TwoWay` 路径，包括对象字段仍指向同类实例的情况；`OneTime` 仍按原有路径校验，根级 FieldNotify 字段、只经过结构体的路径及末段 UObject 字段不会因此被拒绝。UE 5.3 及以上提供相应原生机制，但具体路径和项目 MVVM 设置仍须验证。UE 5.3 中动态来源有意为 null 时仍会产生原生错误日志；对象恢复后订阅及值更新是否恢复，需单独验证。`GetUIFrameworkCapabilities.ModelViewViewModel.EnhancedModule.BindingLimits.DynamicObjectSourceNotifications` 返回当前引擎的 `EngineSupported`、`Reason` 和 `RequiresNativePathValidation`；机制受支持不表示所有路径与设置都已验证。
