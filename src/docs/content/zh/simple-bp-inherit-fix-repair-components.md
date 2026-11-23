---
title: 修复继承组件
type: doc
slug: simple-bp-inherit-fix-repair-components
draft: false
sitePublish: true
tags:
  - 蓝图
  - 继承链
workIds:
  - simple-bp-inherit-fix
docPage:
  work: simple-bp-inherit-fix
  group: features
  slug: repair-components
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/simple-bp-inherit-fix/docs/repair-components/
lang: zh
translationKey: doc:simple-bp-inherit-fix:repair-components
---

## 运行修复

1. 安装插件并确认编译成功。
2. 在内容浏览器中右键单击受影响的 Actor 蓝图，选择 **Component Repair → Fix Inheritance Pollution**。
3. 在输出日志中筛选 `LogSBIF`，检查扫描范围、签出与修复结果。
4. 在保存对话框中核对受影响的文件，再保存被标记为脏的蓝图。

## 检查和保存修复结果

启动修复的蓝图只是检查起点。待保存列表可能还包括父级或子级资产；以日志中的修复项与待保存项为准。

修复前先收集继承链并确认受影响组件，再处理版本控制签出、字段修改和保存。

| 阶段 | 动作 |
| --- | --- |
| 1\. **GatherChain** | 收集继承链（父类 + 自身 + 子类） |
| 2\. **ScanChain** | 扫描每个蓝图的 SCS + ICH，找出所有 `CreationMethod=Instance` 的记录 |
| 3\. **CheckOutFindings** | 通过源码控制签出涉及的 uasset |
| 4\. **ApplyFindings** | 将 `CreationMethod` 从 `Instance` 翻转为 `SimpleConstructionScript` |
| 5\. **MarkDirty** | 将改动过的蓝图标记为脏，提示用户手动保存 |

例如，从子蓝图启动修复时，日志可能列出实际修改的父蓝图：

```
[SBIF] ==============================================
[SBIF]  Fix Inheritance Pollution started (anchor: BP_MyActor)
[SBIF] ==============================================
[SBIF] -------- Stage 1 / Gather Inheritance Chain --------
[SBIF]   Self: BP_MyActor
[SBIF]   Ancestor: BP_BaseActor
[SBIF]   Descendant: BP_MyActorExt
[SBIF]   Total 3 blueprints (ancestors+self 2 / descendants 1)
[SBIF] -------- Stage 2 / Scan Instance-corrupted Nodes --------
[SBIF]   [BP_BaseActor / SCS] 'MeshComp'  (Template=MeshComp_GEN_VARIABLE)
[SBIF]   Scan complete: 1 Instance-corrupted nodes total
[SBIF] -------- Stage 3 / SourceControl CheckOut --------
[SBIF]   ✅ [BP_BaseActor]  /Content/BP_BaseActor.uasset
[SBIF] -------- Stage 4 / Repair CreationMethod --------
[SBIF]   [BP_BaseActor / SCS] 'MeshComp'  Instance -> SimpleConstructionScript
[SBIF] -------- Stage 5 / Mark Blueprints Dirty --------
[SBIF]   Dirty: BP_BaseActor
[SBIF]   1 blueprints marked dirty, manual save required
```

## 修复范围

工具只把异常模板的 `CreationMethod` 从 `Instance` 改回 `SimpleConstructionScript`。Construction Script 动态创建的组件和其他蓝图问题不在范围内。保存前检查受影响的组件和自动签出的文件。

## 修复结果排查

先看 `LogSBIF`，确认扫描结果和签出状态。

## 扫描结果为零

结果为零时，问题可能超出工具覆盖范围。用完整的 `LogSBIF` 日志确认扫描到的蓝图和组件记录。

## 签出失败

签出失败时，插件仍会在内存中完成修复。先检查文件是否被锁定、服务器是否可达、工作区是否包含该文件；如需手动签出，按版本控制环境使用 `p4 edit`、`git lfs lock` 或 `svn lock`，然后回 UE 保存。

## 不同版本控制的签出行为

-   **Git**：签出基本是空操作，文件本就可写
-   **Git LFS**：会自动请求 LFS lock
-   **SVN**：执行 `svn lock`
-   **无源码控制**：签出阶段整个跳过，直接进入修复

## 界面语言

打开 **编辑 → 项目设置**，进入 SimpleBPInheritFix 设置页，将 **Language** 设置为 **English** 或 **中文**。默认语言为英文。面向用户的界面、提示、通知和功能日志会立即更新，无需重启编辑器；公开 API 名称以及模块启动/关闭日志始终保持英文。
