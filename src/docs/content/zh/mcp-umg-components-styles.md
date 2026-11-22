---
title: 复用组件与控件样式
type: doc
slug: mcp-umg-components-styles
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
  slug: components-styles
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/mcp-umg/docs/components-styles/
lang: zh
translationKey: doc:mcp-umg:components-styles
---

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

运行时用 `ListRuntimeWidgets` 取得令牌后，`InspectCommonUI` 可读取实例或指定 `WidgetName`；`ControlCommonUI` 的 `Action` 可为 `Activate`、`Deactivate`、`Push`、`Remove`。`Push` 需要容器 `WidgetName` 与已编译的 `WidgetClassPath`；`Remove` 使用当前堆叠目标的 `TargetToken`。操作现有实例，不会保存 Widget Blueprint；参见[运行时交互与诊断](https://mzsh.me/zh/works/mcp-umg/docs/preview-runtime/#runtimeworkflow)。

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
