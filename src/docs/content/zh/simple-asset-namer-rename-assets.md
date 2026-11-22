---
title: 自动与批量重命名
type: doc
slug: simple-asset-namer-rename-assets
draft: false
sitePublish: true
tags:
  - 资产管理
  - 命名规范
workIds:
  - simple-asset-namer
docPage:
  work: simple-asset-namer
  group: workflows
  slug: rename-assets
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/simple-asset-namer/docs/rename-assets/
lang: zh
translationKey: doc:simple-asset-namer:rename-assets
---

## 2. 使用方法

### 2.1 自动重命名

| 选项 | 触发条件 |
|------|---------|
| Auto Rename on Create | 创建或导入资产时自动重命名 |
| Auto Rename on Rename | 手动重命名后自动修正名称 |

**示例**：创建蓝图 `MyCharacter` → 自动重命名为 `BP_MyCharacter`

### 2.2 通过右键菜单批量重命名

右键菜单项位于 **Simple Asset Namer** 二级子菜单下。

**资产右键菜单**
1. 选择一个或多个资产
2. 右键 → **Simple Asset Namer** → **Auto Rename**

**文件夹右键菜单**
1. 右键点击文件夹
2. **Simple Asset Namer** → **Auto Rename All Assets**

### 2.3 智能处理策略

文件夹批量重命名使用三级渐进策略：

| 阶段 | 条件 | 处理方式 |
|------|------|---------|
| 批量快速 | 总数 >= 100 | 分 10 批处理 |
| 重试失败 | 有批次失败 | 合并失败批次重试一次 |
| 逐个处理 | 仍然失败 | 逐个处理并提供详细错误 |

总数 < 100 时直接逐个处理。

### 2.4 结果对话框

完成后显示结果窗口，包含三个标签页：
- **成功**：成功重命名的资产
- **错误**：失败的资产及错误原因
- **跳过**：跳过的资产及原因

**常见错误**：
| 错误信息 | 说明 |
|---------|------|
| Source control not connected | 版本控制未连接 |
| Checked out by another user | 文件被其他用户签出 |
| File is read-only | 文件为只读 |
| Target file already exists | 目标文件已存在 |
| Asset has unsaved changes | 资产有未保存的更改 |

---

## 3. 常见问题

**Q：重命名后资产引用会断吗？**

不会。使用 UE 官方 API，自动处理引用并创建重定向器。

**Q：可以撤销吗？**

可以，支持 Ctrl+Z 撤销。

**Q：为什么有些资产没被重命名？**

1. 已经是标准名称
2. 该资产类型没有配置命名规则
3. 路径被过滤器规则排除
4. 文件为只读且无法签出

**Q：如何添加自定义规则？**

设置 → Asset Type Naming Rules → 点击 + 添加新规则。

**Q：批量重命名显示很多未知错误怎么办？**

先修复重定向器：内容浏览器 → 右键文件夹 → Fix Up Redirectors in Folder，然后重新运行重命名。

---

## 支持

如有使用问题或合作需求，请前往联系页面。

- **联系入口：** [联系与合作](https://mzsh.me/contact/)

### 步骤3：开始使用

-   **自动模式**：正常工作即可，创建/导入资产时自动命名
-   **批量模式**：选中文件夹，使用批量重命名功能

## 自动处理开关

- bAutoRenameOnCreate：创建或导入资产时按规则命名。
- bAutoRenameOnRename：手动改名后重新检查命名规则。

## 查看结果

批量重命名后会弹出详细的结果对话框，包含：

-   成功数量和明细（原名 → 新名）
-   跳过数量和原因（已是标准名称、无匹配规则、目标已存在等）
-   错误数量和具体信息

## 批量操作

选择目标文件夹后使用批量重命名入口。先检查包含或排除路径，再查看成功、跳过与错误明细。批量操作前保留可恢复的版本，并核对重命名后的资产引用。

---

原文于 2026-03-25 发表于[博客园](https://www.cnblogs.com/mengzhishanghun/p/19770922)。
