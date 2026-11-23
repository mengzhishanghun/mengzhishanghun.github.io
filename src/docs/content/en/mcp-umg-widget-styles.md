---
title: Style Widgets
type: doc
slug: mcp-umg-widget-styles
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-umg
documentKind: product-manual
websiteRoute: /en/works/mcp-umg/docs/widget-styles/
lang: en
translationKey: doc:mcp-umg:widget-styles
sourceHash: 6a2c0bdfb78ef108bf11135b1897112600b22ca275e7a63da4d00be0ff76c0d1
translationStatus: translated
generatedBodyHash: df04df63bc4931593f403119242ef8cc4f0011a81bd7a34c1fd4287f74385590
docPage:
  work: mcp-umg
  group: features
  slug: widget-styles
  order: 7
---

## Widgets supported by SetWidgetStyle

Start with the widget type and the visual change you want. Look at Brush for an image or border, Text for lettering, and the relevant state for a button background. For spacing, first decide whether you need to change style padding or the layout of the parent slot.

`SetWidgetStyle` accepts `Brush`, `Text`, and `Button` style objects. The tool checks the full request before making changes. It rejects unknown fields, incorrect JSON types, missing resources, and resources of the wrong type; the widget stays unchanged.

## Extended widgets

CheckBox, Slider, ProgressBar, EditableTextBox, ScrollBar and ComboBoxString use `Style.Extended`. Field names are the engine's public reflected fields on the corresponding `WidgetStyle` or widget itself. Only `FSlateBrush`, `FSlateColor`/`FLinearColor`, `float` and `bool` are supported. For example:

```json
{"Extended":{"CheckedImage":{"drawType":"Box"},"ForegroundColor":{"r":0.2,"g":0.4,"b":0.6}}}
```

Common Brushes include CheckBox `UncheckedImage`/`CheckedImage`, Slider `NormalBarImage`/`NormalThumbImage`, ProgressBar `BackgroundImage`/`FillImage`, EditableTextBox `BackgroundImageNormal`/`BackgroundImageFocused`, ScrollBar `NormalThumbImage`, and directly reflected style fields on ComboBoxString. The same object can set Slider `Value`, `MinValue`, `MaxValue`, `StepSize`, and ProgressBar `Percent`/`FillColorAndOpacity`. Complex nested styles, such as a ComboBox's internal ButtonStyle, are outside this interface's scope.

## Text and rich text limits

TextBlock `Text` supports `color`, `fontSize`, `font` referencing an existing `/Game` or `/Engine` **UFont**, `typefaceFontName`, `letterSpacing`, `lineHeight`, `wrapTextAt`, `autoWrap` and `ellipsis`. `ellipsis:false` explicitly selects the native Clip policy. A bare `FontFace` is rejected because it does not implement the `IFontProviderInterface` required by Slate and would fall back to another font. Native engine UFonts, such as the default Roboto, can be used in styles and reapplied themes.

RichTextBlock uses `Style.RichText`: `textStyleSet` must reference an existing `/Game` DataTable whose row structure is **exactly** the engine's `FRichTextStyleRow`; `decoratorClasses` is an array of paths to existing, non-abstract `URichTextBlockDecorator` subclasses. The tool only references these assets and calls native `SetTextStyleSet`/`SetDecorators`; it does not create application-specific Decorators. For example:

```json
{"RichText":{"textStyleSet":"/Game/UI/Styles/DT_RichText","decoratorClasses":["/Game/UI/Decorators/BP_LinkDecorator.BP_LinkDecorator_C"]}}
```

To use a local font file, first [import it as a UI font](/en/works/mcp-umg/docs/import-ui-fonts/).

## Corners, Brushes, and Button padding

Brushes in `SetWidgetStyle` support `drawType="RoundedBox"`. `outline` is a complete object requiring four corner radii, width, color and `roundingType`. Use `FixedRadius` to draw the specified corner radii; `HalfHeightRadius` produces a capsule. `resource:null` explicitly clears the Brush resource. Omitted fields retain their values.

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

Buttons use `Style.Button.normalPadding` / `pressedPadding`, each containing four numbers for `left/top/right/bottom`. Explicit zero values and finite negative values for intentional overlap are supported. Button style padding adds to ButtonSlot padding; nine-slice Brush.margin is not content padding. Structured style values must use JSON numbers. Unknown nested fields are rejected, and the entire call is validated before any changes.

`SetWidgetStyle` accepts JSON objects without requiring callers to assemble UE text structures:

- Brush: resource, draw type, image size, color, nine-slice Margin, tiling and UV.
- Text: color and font size.
- Button: Normal, Hovered, Pressed and Disabled Brushes.

Texture import explicitly sets sRGB, UI compression, no Mips and the UI Texture Group. Materials may reference only existing Material Instances whose actual `MaterialDomain == MD_UI`. The plugin does not generate arbitrary material graphs from images.
