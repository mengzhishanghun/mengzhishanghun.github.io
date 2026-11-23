---
title: 设置控件样式
type: doc
slug: mcp-umg-widget-styles
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-umg
docPage:
  work: mcp-umg
  group: features
  slug: widget-styles
  order: 7
documentKind: product-manual
websiteRoute: /zh/works/mcp-umg/docs/widget-styles/
lang: zh
translationKey: doc:mcp-umg:widget-styles
---

## SetWidgetStyle 支持的控件

从控件类型和要改的视觉效果入手：图片和边框先看 Brush，文字先看 Text，按钮背景先确定要改哪个状态。如果目标是调整控件与父容器的间距，先分清那是样式内边距还是 Slot 布局。

`SetWidgetStyle` 接受 `Brush`、`Text` 和 `Button` 样式对象。工具会先检查完整请求。遇到未知字段、错误的 JSON 类型、找不到资源或资源类型不符时，工具会拒绝请求，目标控件保持原样。

## 扩展控件

CheckBox、Slider、ProgressBar、EditableTextBox、ScrollBar、ComboBoxString 使用 `Style.Extended`。字段名是引擎对应 `WidgetStyle` 或控件自身的公开反射字段名；仅支持 `FSlateBrush`、`FSlateColor`/`FLinearColor`、`float`、`bool`。例如：

```json
{"Extended":{"CheckedImage":{"drawType":"Box"},"ForegroundColor":{"r":0.2,"g":0.4,"b":0.6}}}
```

常用 Brush 包括 CheckBox 的 `UncheckedImage`/`CheckedImage`，Slider 的 `NormalBarImage`/`NormalThumbImage`，ProgressBar 的 `BackgroundImage`/`FillImage`，EditableTextBox 的 `BackgroundImageNormal`/`BackgroundImageFocused`，ScrollBar 的 `NormalThumbImage`，以及 ComboBoxString 可直接反射的样式字段。Slider 的 `Value`、`MinValue`、`MaxValue`、`StepSize` 和 ProgressBar 的 `Percent`/`FillColorAndOpacity` 也可在该对象中设置。复杂嵌套样式（例如 ComboBox 的内部 ButtonStyle）不在本接口范围内。

## 文本与富文本限制

TextBlock 的 `Text` 支持 `color`、`fontSize`、已有 `/Game` 或 `/Engine` **UFont** 的 `font`、`typefaceFontName`、`letterSpacing`、`lineHeight`、`wrapTextAt`、`autoWrap` 和 `ellipsis`。`ellipsis:false` 明确设置原生 Clip 策略。裸 `FontFace` 被拒绝：它不实现 Slate 所需的 `IFontProviderInterface`，会退回 fallback 字体。引擎原生 UFont（例如默认 Roboto）可用于样式和主题回放。

RichTextBlock 使用 `Style.RichText`：`textStyleSet` 必须是已有 `/Game` DataTable，且行结构**严格等于**引擎 `FRichTextStyleRow`；`decoratorClasses` 是已有、非 abstract `URichTextBlockDecorator` 子类的路径数组。工具仅引用并调用原生 `SetTextStyleSet`/`SetDecorators`，不会创建业务 Decorator。例如：

```json
{"RichText":{"textStyleSet":"/Game/UI/Styles/DT_RichText","decoratorClasses":["/Game/UI/Decorators/BP_LinkDecorator.BP_LinkDecorator_C"]}}
```

如需使用本地字体文件，请先[导入 UI 字体](/zh/works/mcp-umg/docs/import-ui-fonts/)。

## 圆角、Brush 与按钮内边距

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
