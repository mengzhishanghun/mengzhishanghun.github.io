---
title: 编辑控件树并检查布局
type: doc
slug: mcp-umg-layout
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
  slug: layout
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-umg/docs/layout/
lang: zh
translationKey: doc:mcp-umg:layout
---

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
