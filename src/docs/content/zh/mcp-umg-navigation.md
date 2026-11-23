---
title: 设置 UMG 焦点导航
type: doc
slug: mcp-umg-navigation
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
  slug: navigation
  order: 11
documentKind: product-manual
websiteRoute: /zh/works/mcp-umg/docs/navigation/
lang: zh
translationKey: doc:mcp-umg:navigation
---

`SetWidgetNavigation` 为 Widget Blueprint 模板中的单个控件配置原生 `UWidgetNavigation` 数据；不会发送输入、改变运行时焦点或保存资产。调用成功后资产仅在内存中标脏，需要时再调用 `SaveWidgetBlueprint` 保存。

## 读取六个方向的规则

```json
{"BlueprintPath":"/Game/UI/WBP_Menu","WidgetName":"PlayButton"}
```

调用 `GetWidgetNavigation` 会始终返回 `Up`、`Down`、`Left`、`Right`、`Next`、`Previous` 六个方向。没有配置导航对象时，六个方向均报告为 `Escape`。

## 预检与更新指定方向

例如，要让焦点从开始按钮向下移到设置按钮，可先读开始按钮的当前规则，再用 `dryRun` 预检这一方向。正式更新后读回该规则，并在 PIE 里从开始按钮实际向下移动焦点。

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

省略 `dryRun` 或将其设为 `false`，工具会先检查这次提交的所有方向，再在同一个事务中写入。要恢复某个方向的默认逃逸规则，只提交该方向：

```json
{"BlueprintPath":"/Game/UI/WBP_Menu","WidgetName":"PlayButton","Rules":{"Down":{"Rule":"Escape"}}}
```

无效方向、缺失/跨树/自身显式目标，或不存在的自定义函数都会在写入前失败，且不会修改任何对象。
