---
title: 编辑 Widget 树
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
  group: features
  slug: layout
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-umg/docs/layout/
lang: zh
translationKey: doc:mcp-umg:layout
---

## 查找控件与编辑结构

先用 `ListWidgetBlueprints` 找到资产，再用 `GetWidgetTree` 确认控件的准确名称和直接父级。改控件自身的值时，先用 `GetWidgetProperties` 看当前属性；改它在父容器里的位置或对齐时，先确认父容器对应的 Slot 类型。

| 工具 | 用途 |
| --- | --- |
| ListWidgetBlueprints | 列出 Widget Blueprint（便捷入口） |
| GetWidgetTree | 获取 Widget 树结构 |
| GetWidgetProperties | 获取 Widget 属性 |
| SearchWidgetClasses | 搜索可用的 Widget 类 |
| AddWidget | 添加 Widget |
| RemoveWidget | 删除 Widget |
| RenameWidget | 重命名 Widget 并更新相关绑定 |
| ReparentWidget | 将 Widget 移动到新的父级 |
| DuplicateWidget | 复制 Widget 子树 |
| WrapWidget | 使用新的父容器包裹 Widget |
| SetWidgetProperties | 设置 Widget 属性 |
| SetSlotProperties | 设置插槽属性（布局参数） |
| SetListViewEntryClass | 为 ListView、TileView 或 TreeView 配置经过校验的 `IUserObjectListEntry` 条目类 |

`SetListViewEntryClass` 只持久化条目类。Unreal 将 `UListView::ListItems` 标记为瞬态，因此条目数据仍应在 Blueprint 或运行时通过 `SetListItems`/`AddItem` 注入。

## 部分更新、清零与恢复类默认值

`SetWidgetProperties` 和 `SetSlotProperties` 保持默认部分更新。`Properties={}` 无效；`Padding="()"` 保留旧结构成员，不会清零。设零请显式给出四边：`(Left=0,Top=0,Right=0,Bottom=0)`。

新增可选 `ResetToClassDefault=true`：只将 `Properties` 中指定的顶层字段恢复为该 Widget/Slot 类 CDO 默认值，再导入提供的值；不影响其他字段，不修改类默认对象。它不代表零值、不读取父蓝图实例覆盖值。返回 `PropertyUpdateMode` 区分 `PatchCurrentValue` 与 `ResetToClassDefault`。

## 结构化设置控件与 Slot 布局

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

dryRun 只检查参数、类型和目标是否适用，不执行排版。通过预检后，还要看实际布局中控件会不会重叠。正式执行把 dryRun 改为 false，读回 GetWidgetProperties，验证后 SaveWidgetBlueprint 精确保存。

## 创建、配置和保存 Widget Blueprint

| 工具 | 用途 |
| --- | --- |
| CreateWidgetBlueprint | 创建 Widget Blueprint |
| SetWidgetBlueprintSettings | 设置 Widget Blueprint 配置 |
| SaveWidgetBlueprint | 编译并精确保存一个 Widget Blueprint；不执行 Save All，也不保存其他脏包 |

如果要按规格整体调整控件树，参见[从参考图生成 UMG 界面](/zh/works/mcp-umg/docs/image-to-umg/)。现有控件的样式字段见[设置控件样式](/zh/works/mcp-umg/docs/widget-styles/)。
