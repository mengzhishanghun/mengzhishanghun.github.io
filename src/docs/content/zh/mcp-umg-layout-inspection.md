---
title: 检查布局、裁切与命中
type: doc
slug: mcp-umg-layout-inspection
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-umg
docPage:
  work: mcp-umg
  group: widgets-layout
  slug: layout-inspection
  order: 3
documentKind: product-manual
websiteRoute: /zh/works/mcp-umg/docs/layout-inspection/
lang: zh
translationKey: doc:mcp-umg:layout-inspection
---

## 设计态与 PIE 的诊断范围

`dryRun` 只校验树和属性合法性，不执行 Slate 排版。`InspectWidgetLayout` 的 Design 模式只提供元数据；PIE 模式增加直接 Slate 父节点边界、最多 64 层裁切祖先（每页最多输出 256 条），以及包括自动换行文字在内的纵向溢出线索。`PossibleAncestorClipping` 和 `PossibleVerticalOverflow` 需要结合实际截图定位；`Unverified*` 表示工具没有足够的证据判定结果。

祖先矩形采用屏幕空间轴对齐包围盒，并非最终绘制裁切区。旋转、OnDemand、ClipToBoundsWithoutIntersecting、自定义绘制和缓存几何时效均可能影响判断。工具不为诊断创建实例、强制预览数据或改变运行状态。先让真实页面完成布局，再检查目标实例。

## 解读裁切与缩放

使用 InspectWidgetLayout 的 PIE 模式读取实际尺寸、布局缩放、父节点边界、裁切祖先和文本溢出线索。Design 模式不能给出真实排版结论。Unverified 不表示通过；旋转包围盒、条件裁切、缓存过期等仍需结合截图。

Button 样式 NormalPadding 与 ButtonSlot Padding 相加。子控件不能直接使用外层 SizeBox 的尺寸作为可用空间；应核对内部实际布局。

## 找出按钮无法命中的原因

`InspectWidgetHitTest` 接受 BlueprintPath、WidgetName 和可选 InstanceIndex。默认检查目标中心；可成对提供 LocalX/LocalY（目标自身局部坐标）。只查询目标窗口的缓存命中网格，不移动鼠标、不发送点击、不改变焦点。

结果包含 bTargetOnHitPath、目标启用/可见性、键盘焦点及最多64个 Slate 路径节点。TargetNotOnCachedHitPath 可能来自遮挡、禁用、命中可见性或缓存状态，不能直接等同于某一种故障。其他窗口、鼠标捕获和实际事件执行不在该诊断范围内。没有运行实例或有效几何时明确失败。

建议顺序：确认会话 → 读取布局 → 检查命中 → 调整布局/属性 → 读回 → 真实交互测试 → 精确保存。
