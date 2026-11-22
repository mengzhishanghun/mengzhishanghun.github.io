---
title: 检查、保存与构建地图
type: doc
slug: mcp-world-editor-maps
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
docPage:
  work: mcp-world-editor
  group: workflows
  slug: maps
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-world-editor/docs/maps/
lang: zh
translationKey: doc:mcp-world-editor:maps
---

### 保存、地图检查与构建

`GetDirtyPackages` 可按 `CurrentLevel` 或 `AllLoaded` 范围列出已加载脏包；`CurrentLevel` 包含当前 Level 已加载的外部对象包，以及当前关卡单独存在且为 dirty 的 Map BuiltData 包。`SavePackages` 需要精确 `PackageNames`，默认 `DryRun=true`；先预览所选包的 `PlanHash`，再以 `DryRun=false` 和同一哈希执行。空包保存可能删除现有文件，须显式设置 `AllowDeleteEmptyPackages`。启用源控提供器时，本地保存合同会拒绝实际写入；保存结果逐包报告，并列出仍为 dirty 的包。旧 `SaveLevel` 无参数调用继续保存当前 Level 及引擎纳入的外部对象包，结果同时报告真实 Level 包路径和残留脏包。磁盘保存不属于编辑器 Undo。

`MapCheck` 在当前地图运行引擎地图检查，返回错误、警告、带 token 的可见消息和 `Complete`。如果 Message Log 的界面过滤隐藏消息，或结果被 `MaxMessages` 截断，`Complete=false`，不能据此报告检查通过。检查会新增当前地图的日志页，保留历史页和用户界面过滤设置。

`BuildNavigation` 与 `BuildLighting` 默认只预览，实际执行须传回对应 `PlanHash` 并设置 `DryRun=false`。普通地图和 World Partition 地图的导航构建均调用引擎公开的同步 `UNavigationSystemV1::Build`，范围是已注册且已加载可见的编辑器关卡（`Scope=LoadedVisibleEditorWorld`）。已加载但隐藏的关卡及未加载关卡不在本次范围内；预览以 `ExcludedLoadedHiddenLevelPaths` 列出被排除的已加载隐藏关卡。改变关卡可见性会使预览哈希失效，关卡关联或可见性切换期间须等待状态稳定再预览或执行。导航构建保留编辑器 Undo，不隐式执行 `MapCheck` 或保存包。World Partition 构建可能清除已加载导航数据块；`bCompleteWorldPartitionBuild=false`、`bSaved=false` 不代表完成整个分区世界的离线构建。灯光构建使用 Preview 品质，返回 `OperationId`；用 `GetBuildStatus` 查询终态。只有所有启用的灯光场景均已应用结果，灯光构建才报告成功。两个构建都不报告虚构的进度百分比，也不会自行保存地图。地图切换或卸载会使仍在运行的操作 ID 失效。

`FindNavigationPath` 接受世界坐标 `Start` 和 `End`，在当前已加载的默认导航数据上同步查询路径，返回是否找到、是否为部分路径、长度和有界点列；它不会触发构建。`MaxPoints` 为 2–1000，超过上限时结果标记 `bTruncated=true`。

请通过 MCP `tools/list` 查询当前工具及其输入 schema；可用工具会随插件版本变化。

## World Settings 编辑

`GetWorldSettings` 返回当前实例上所有此刻可编辑属性的精确名称与 UE 文本值，不再只显示偏离默认值的属性，也不会把只读的 BlueprintVisible 字段当作可写入口。`SetWorldSettings` 要求大小写完全匹配，拒绝编辑标志或 `CanEditChange` 禁止的属性，并以成对的 `PreEditChange`/`PostEditChangeProperty` 通知完成事务。导入失败时会先恢复旧值；若恢复也失败，错误会报告事务回滚结果，回滚失败表示编辑器状态可能已变化。

## 受限控制台命令

`ExecuteConsoleCommand` 只允许文档列出的七条 `stat` 命令，通过 `GEngine->Exec` 进入引擎命令链，并检查命令是否真正被处理；未处理时返回错误。UE 的 `stat` 命令切换对应的视口统计显示，重复调用可能将显示关闭；它们不是无副作用的只读测量。成功结果中的 `Handled=true` 只表示命令已由当前引擎实例处理，不表示统计显示一定处于开启状态；部分命令不会产生文本输出。
