---
title: 设置用户参数与预览效果
type: doc
slug: mcp-niagara-parameters-preview
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-niagara
docPage:
  work: mcp-niagara
  group: workflows
  slug: parameters-preview
  order: 3
documentKind: product-manual
websiteRoute: /zh/works/mcp-niagara/docs/parameters-preview/
lang: zh
translationKey: doc:mcp-niagara:parameters-preview
---

## User Parameter 编辑

`AddUserParameter` 以撤销事务添加 float、int、bool、Vector、Vector2、Vector4 或 Color 值参数，并发送 System PostEditChange。`SetSystemParameters` 每次原子写入 1–64 个现有值参数：所有名称和值预校验并保存旧值后才提交；JSON 布尔值会按 Niagara 的 `FNiagaraBool` 表示写入。`RemoveUserParameter` 按唯一名称执行与 UE 5.8 External 相同的公开 exposed-parameter 删除语义。

对象与 Data Interface 参数需要类型化资产或实例处理，不能安全地走文本值导入，因此 `AddUserParameter`/`SetSystemParameters` 不声称支持它们。删除参数不会猜测如何重写图引用，调用者应另行更新引用。UE 5.2–5.8 没有共同导出的 User Parameter 重命名及引用传播 API，本插件不依赖 Private 头绕过该边界，因而不提供 RenameUserParameter。

## 资产生命周期与预览

`CreateNiagaraSystem` 仅接受可写挂载点内、不带 `.ObjectName` 后缀的合法长包名，并在创建前检查磁盘包、内存包和 Asset Registry 冲突，绝不覆盖同名资产。提供 `TemplatePath` 时会真实复制模板；未提供时才使用 Niagara Factory 创建空 System。创建结果会返回规范对象路径、包名和 dirty 状态，需调用 `SaveAsset` 落盘。

`SaveAsset` 使用非致命的包名到文件名转换，拒绝只读目标；只有 `SavePackage` 成功、文件存在且包不再 dirty 时才返回成功。`OpenAsset` 会检查 Editor 与 AssetEditorSubsystem 生命周期。`CapturePreview` 只读取内存或已保存包中的缓存缩略图，不实时渲染或改写 thumbnail cache；输出固定为一张 PNG，并限制尺寸 1024×1024、原始数据 16 MiB、压缩数据 8 MiB。
