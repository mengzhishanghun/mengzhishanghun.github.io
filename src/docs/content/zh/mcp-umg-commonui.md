---
title: 配置 CommonUI 控件与输入
type: doc
slug: mcp-umg-commonui
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
  slug: commonui
  order: 13
documentKind: product-manual
websiteRoute: /zh/works/mcp-umg/docs/commonui/
lang: zh
translationKey: doc:mcp-umg:commonui
---

## 检查框架是否可用

先调用 `GetUIFrameworkCapabilities` 确认项目能否使用 CommonUI。可能的状态是：`NotInstalled`、`InstalledDisabled`、`EnabledNotLoaded` 或 `Available`。该查询不会改变项目、模块或资产状态。

如果项目需要 CommonUI，由项目负责人手动启用插件并重启编辑器。MCPUMG 不会代为启用插件或加载已禁用模块。

如果要配置数据绑定，请查看 [MVVM 上下文与绑定](/zh/works/mcp-umg/docs/mvvm/)。

## 配置已有控件、输入与运行时实例

如果只是调整一个现有按钮的锁定行为，先选定目标蓝图和按钮，再用下面的示例预检属性。要检查输入是否确实到达该控件，则在运行中的页面验证；资产配置只能确认字段和引用。

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

运行时用 `ListRuntimeWidgets` 取得令牌后，`InspectCommonUI` 可读取实例或指定 `WidgetName`；`ControlCommonUI` 的 `Action` 可为 `Activate`、`Deactivate`、`Push`、`Remove`。`Push` 需要容器 `WidgetName` 与已编译的 `WidgetClassPath`；`Remove` 使用当前堆叠目标的 `TargetToken`。操作现有实例，不会保存 Widget Blueprint；参见[运行时交互与诊断](/zh/works/mcp-umg/docs/runtime-diagnostics/#找到目标运行时实例)。
