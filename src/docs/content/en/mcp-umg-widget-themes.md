---
title: Export and Apply Widget Themes
type: doc
slug: mcp-umg-widget-themes
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-umg
documentKind: product-manual
websiteRoute: /en/works/mcp-umg/docs/widget-themes/
lang: en
translationKey: doc:mcp-umg:widget-themes
sourceHash: 0543d8639550e58fa3d40d7e306f4a09a7956e640d4f7405287ee6fd1b9d5ae5
translationStatus: translated
generatedBodyHash: b151e1b70c977205f484bd4354d917292d2065662ffcb933e24161d4019d2c33
docPage:
  work: mcp-umg
  group: features
  slug: widget-themes
  order: 8
---

`ExportWidgetTheme` exports a portable version 1 theme from specified Image, Border, TextBlock or Button widgets. `ApplyWidgetTheme` applies it to another Widget Blueprint with the same widget names and classes. Exporting only reads the asset. Applying a theme records the in-memory changes in one editor transaction. Save the asset separately.

## Export a theme

`BlueprintPath` and a unique `WidgetNames` array are required, with up to 64 widgets. Only fully representable styles are exported: Brush, Text, and the four Button states and padding. Dynamic Slate colors, Brush resources outside `/Game` and text resources that are not UFonts are rejected to avoid incomplete themes. Text UFonts can reside in `/Game` or `/Engine`, so the default Roboto can also be exported and reapplied. Layout is not currently exported; reapplying exported styles leaves layout unchanged.

```json
{
  "BlueprintPath": "/Game/UI/WBP_MainMenu",
  "WidgetNames": ["PlayButton", "TitleText"]
}
```

`uv` uses the form `{"minX","minY","maxX","maxY"}`. If there is no valid UV override, the output is `uv: null`, which clears an existing UV override on the target when reapplied.

## Apply a theme

Before applying the exported theme, compare the widget trees and check the names and classes on both sides. The example below runs a preflight. Correct any name, class, or resource mismatch before applying the theme.

`ApplyWidgetTheme` requires `BlueprintPath` and `Theme`. The theme root must be `{"version":1,"rules":[...]}`, with 0 to 64 rules. Each rule addresses its target by exact `name` and UObject `class`. Optional `dryRun: true` performs the same complete preflight without changing the asset.

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

`style.Brush` supports `resource`, `drawType`, `imageSize`, `tint`, `margin`, `tiling`, `uv` and `outline`. `style.Text` supports TextBlock color, `/Game` or `/Engine` UFonts, font size, typeface, letter spacing, line height, wrapping and ellipsis. `style.Button` supports `normal`, `hovered`, `pressed`, `disabled`, `normalPadding` and `pressedPadding`. `layout` uses the existing `SetWidgetLayout` fields. Omitted fields retain their current values.

Unknown fields, duplicate name/class pairs, missing targets, class mismatches, incompatible style channels, invalid layouts or invalid resources reject the entire request. A theme can match at most 256 targets. After a successful non-dry-run call, use `SaveWidgetBlueprint` when ready to save.
