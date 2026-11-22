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
  group: workflows
  slug: repair-components
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/simple-bp-inherit-fix/docs/repair-components/
lang: zh
translationKey: doc:simple-bp-inherit-fix:repair-components
---

## 📝 使用方法

1. 安装插件并编译成功
2. 在内容浏览器中，**右键任何受影响的 Actor 蓝图**（祖先/自身/后代均可）
3. 选择 **Component Repair → Fix Inheritance Pollution**
4. 打开输出日志并过滤 `LogSBIF` 以监控执行
5. 编辑器会弹出保存对话框——**保存标记为脏的蓝图**即可完成

---

## ❓ 常见问题

**扫描返回 0 个发现但明显存在损坏？**  
你遇到的可能不是此插件覆盖的问题（罕见情况）。请粘贴完整的 `LogSBIF` 日志以供诊断。

**CheckOut 失败怎么办？**  
插件会继续在内存中修复，但你需要在保存前手动处理签出（`p4 edit` / `git lfs lock` / `svn lock`）。常见原因：文件被他人锁定、服务器不可达、或映射未包含该文件。

**应该选择哪个蓝图作为锚点？**  
随意选择——祖先、自身和后代都会被扫描，结果相同。

**没有 Perforce 也能用吗？**  
- Git：CheckOut 本质上是空操作，文件默认可写
- Git LFS：发起 LFS lock 请求
- SVN：运行 `svn lock`
- 无版本控制：跳过 CheckOut 阶段

---

## ⚠️ 限制

- 仅处理此插件覆盖的特定组件污染问题；其他蓝图问题不在范围内
- 不扫描在 Construction Script 中动态创建的组件

---

## 版本历史



打开 **编辑 → 项目设置**，进入 SimpleBPInheritFix 设置页，将 **Language** 设置为 **English** 或 **中文**。默认语言为英文。面向用户的界面、提示、通知和功能日志会立即更新，无需重启编辑器；公开 API 名称以及模块启动/关闭日志始终保持英文。

## 联系

如有使用问题或合作需求，请前往联系页面。

- **联系入口：** [联系与合作](https://mzsh.me/contact/)

## 操作步骤

1.  安装插件，编译通过
2.  Content Browser 里右键任意受影响的 Actor 蓝图
3.  选择 **Component Repair → Fix Inheritance Pollution**
4.  打开 Output Log，过滤 `LogSBIF`，查看执行情况
5.  编辑器弹出保存对话框，**保存被标脏的蓝图** 即完成

## 修复阶段

修复前先收集继承链并确认受影响组件，再处理版本控制签出、字段修改和保存。

| 阶段 | 动作 |
| --- | --- |
| 1\. **GatherChain** | 收集继承链（父类 + 自身 + 子类） |
| 2\. **ScanChain** | 扫描每个蓝图的 SCS + ICH，找出所有 `CreationMethod=Instance` 的记录 |
| 3\. **CheckOutFindings** | 通过源码控制签出涉及的 uasset |
| 4\. **ApplyFindings** | 将 `CreationMethod` 从 `Instance` 翻转为 `SimpleConstructionScript` |
| 5\. **MarkDirty** | 将改动过的蓝图标记为脏，提示用户手动保存 |

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

这里讨论的是 Actor 蓝图组件模板的 CreationMethod 异常，不涵盖其他蓝图故障。Construction Script 中动态创建的组件需要单独判断，不能直接套用相同修复逻辑。

-   只处理本插件覆盖的那种组件异常（`CreationMethod=Instance` 污染），其他类型的蓝图问题不在范围内
-   Construction Script 里动态生成的组件不在扫描范围（那些本就不走 SCS/ICH）
-   仅支持 Actor 蓝图（非 Actor 的蓝图不存在此问题）

---

原文于 2026-05-13 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/20030737)。
