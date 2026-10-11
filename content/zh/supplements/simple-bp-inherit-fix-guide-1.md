---
title: SimpleBPInheritFix 使用指南
description: 使用 Actor 蓝图右键入口检查组件继承异常，并处理签出、日志与保存。
type: doc
slug: simple-bp-inherit-fix-guide
categoryId: ue-tools
categoryName: UE工具
categoryOrder: 0
order: 0
status: 正式文档
date: 2026-05-13
draft: false
sitePublish: false
tags:
  - SimpleBPInheritFix
  - UE工具
sourcePlatform: 博客园
sourceUrl: https://www.cnblogs.com/mengzhishanghun/p/20030737
links:
  - label: 博客园原文
    href: https://www.cnblogs.com/mengzhishanghun/p/20030737
workIds:
  - simple-bp-inherit-fix
lang: zh
translationKey: doc:simple-bp-inherit-fix-guide:supplement:1
---

# SimpleBPInheritFix 使用指南

SimpleBPInheritFix 用于处理 Actor 蓝图继承链中特定的组件状态异常。

## 操作步骤

1.  安装插件，编译通过
2.  Content Browser 里右键任意受影响的 Actor 蓝图
3.  选择 **Component Repair → Fix Inheritance Pollution**
4.  打开 Output Log，过滤 `LogSBIF`，查看执行情况
5.  编辑器弹出保存对话框，**保存被标脏的蓝图** 即完成

完整日志大致长这样：

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

## 常见问题

### 扫描结果 0 条但确有污染？

扫描结果为 0 时，需要结合 `LogSBIF` 日志判断是否属于此工具处理的组件状态异常。

### CheckOut 失败怎么办？

插件仍会完成内存修复，但保存前需要手动处理签出。常见原因：

-   文件被他人锁定
-   源控制服务器不通
-   Workspace mapping 不包含该文件

先手动解决签出，再回 UE 保存。

### 会不会把正常组件改坏？

工具的修复范围是：**只翻转 `CreationMethod` 这一个字段**（`Instance → SimpleConstructionScript`），其他任何属性都不动。保存前仍需检查受影响蓝图的组件状态。

### 锚点蓝图选错会有影响吗？

入口蓝图用于定位继承链；扫描会覆盖祖先、当前蓝图与后代。

### 非 Perforce 能用吗？

-   **Git**：签出基本是空操作，文件本就可写
-   **Git LFS**：会自动请求 LFS lock
-   **SVN**：执行 `svn lock`
-   **无源码控制**：签出阶段整个跳过，直接进入修复

## 使用范围

-   只处理本插件覆盖的那种组件异常（`CreationMethod=Instance` 污染），其他类型的蓝图问题不在范围内
-   Construction Script 里动态生成的组件不在扫描范围（那些本就不走 SCS/ICH）
-   仅支持 Actor 蓝图（非 Actor 的蓝图不存在此问题）

---

原文于 2026-05-13 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/20030737)。
