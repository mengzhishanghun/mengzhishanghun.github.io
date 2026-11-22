---
title: 从参考图生成 UMG 界面
type: doc
slug: mcp-umg-image-to-umg
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
  slug: image-to-umg
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/mcp-umg/docs/image-to-umg/
lang: zh
translationKey: doc:mcp-umg:image-to-umg
---

MCPUMG 不在插件内部连接图片模型，也不保存模型密钥。AI 客户端负责理解参考图、核对文字、拆分可复用组件并生成结构化规格；MCPUMG 只负责确定性地校验、构建、测量和保存 Unreal Engine 资产。

`ApplyWidgetTreePatch` 支持整树与增量两种 Patch。若仅需更新现有 Widget 属性或布局，可直接使用相应的属性和布局工具。

## 从规格到预览和保存

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

## 运行版本与文件锁预检

- 每次开始前都以运行中编辑器的 `tools/list` 为准。源码仓库或安装目录已更新，不代表已经打开的编辑器进程加载了新 DLL；工具数量或能力描述不一致时，先确认部署目录，再重启目标编辑器。
- 同一项目的旧 `-game`、PIE 或第二个编辑器进程可能仍持有 `.uasset` 文件句柄。`SaveWidgetBlueprint` 失败时先查看项目日志中的 `LogSavePackage` 与系统错误码；Windows `Error 32` 表示共享冲突，应只关闭命令行明确指向同一项目的遗留进程，然后重试精确保存。
- 不用 `Save All`、外部文件覆盖或重复 Patch 绕过文件锁。Patch 已成功但保存失败时，内存态仍可能是新版本；先保留当前编辑器，再解除锁并调用 `SaveWidgetBlueprint`，不要重新提交同一写操作。
- `CaptureRuntimeWidgetScreenshot` 依赖已加载 MCPUMG 编辑器模块且已经存在目标 Widget 实例。仅以 `-game` 启动的进程不保证加载编辑器模块；需要运行态测量时，使用加载了插件的编辑器 PIE/Game 会话。

## Widget Spec v1

顶层规格包含：

- `schemaVersion`：固定为 `1`。
- `BlueprintPath`：唯一目标 Widget Blueprint。
- `expectedRevision`、`expectedFingerprint`：乐观并发门禁。
- `requestId`、`inputHash`：幂等调用标识。
- `dryRun`：预演或正式执行；改变该字段后必须重新计算 `inputHash`。
- `operations`：`create`、`set`、`move`、`rename`、`remove`。

节点以稳定名称标识，包含 `class`、`parent`、`order`、`properties` 和 `slot`。插件在修改前验证单根、循环、容器兼容性、名称、属性、Slot、节点数量、深度和累计文本预算。错误应返回精确 JSON Pointer。

## 检查实际布局

`dryRun` 只校验树和属性。要检查真实裁切或文字溢出，先让页面完成排版，再[检查布局、裁切与命中](/zh/works/mcp-umg/docs/layout-inspection/)。设置圆角、Brush 或按钮内边距时，参见[设置控件样式](/zh/works/mcp-umg/docs/widget-styles/)。

## 改动范围与保存

- `dryRun` 不修改真实 Widget Blueprint，不编译、不保存。
- 单次 Patch 只操作一个 Widget Blueprint；不能把跨包操作当作一个原子操作。
- 修改前完整演算最终树，成功后只刷新和编译一次。
- 删除或重命名会同步同一 Widget 树内可安全迁移的导航绑定；遇到外部蓝图图表、动画、事件、变量、C++ `BindWidget` 等无法证明安全的依赖时拒绝执行。
- 图片文件、解码像素、Widget 数量、层级、请求文本和响应正文均有硬预算。
- 任何保存操作只接受一个精确目标包，不执行 Save All。
- 参考图不能唯一表达交互、遮挡内容和响应式规则；AI 必须在规格中记录假设，插件不猜测业务逻辑。
