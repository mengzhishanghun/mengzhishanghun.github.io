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
  group: features
  slug: rename-assets
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/simple-asset-namer/docs/rename-assets/
lang: zh
translationKey: doc:simple-asset-namer:rename-assets
---

## 创建或改名时自动应用规则

`Auto Rename on Create`（`bAutoRenameOnCreate`）在创建或导入时运行；`Auto Rename on Rename`（`bAutoRenameOnRename`）在手动改名后重新检查。两个开关可独立配置，类型规则和路径筛选仍然适用。

## 通过右键菜单批量重命名

批量改名前先选少量资产试跑，确认路径范围，并保留可恢复的版本。

右键菜单项位于 **Simple Asset Namer** 二级子菜单下。

**资产右键菜单**

1. 选择一个或多个资产
2. 右键 → **Simple Asset Namer** → **Auto Rename**

**文件夹右键菜单**

1. 右键点击文件夹
2. **Simple Asset Namer** → **Auto Rename All Assets**

少于 100 个资产时逐个处理；达到 100 个时先分 10 批，失败的批次合并重试一次，仍失败的资产逐个重试并显示错误。

## 检查结果与排查失败

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

先核对成功项的原名和新名，再根据跳过或失败的原因处理剩余资产。跳过时检查名称、类型规则、路径筛选和只读文件能否签出；目标名称已存在时检查重名。若许多文件报未知错误，可在内容浏览器右键文件夹，执行 **Fix Up Redirectors in Folder** 后重试。重命名通过 UE API 更新引用并创建重定向器；批量处理后可检查引用，需要时用 Ctrl+Z 撤销。
