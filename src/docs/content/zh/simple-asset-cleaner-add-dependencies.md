---
title: 添加未纳入版本控制的依赖
type: doc
slug: simple-asset-cleaner-add-dependencies
draft: false
sitePublish: true
tags:
  - 资产管理
  - 引用分析
workIds:
  - simple-asset-cleaner
docPage:
  work: simple-asset-cleaner
  group: workflows
  slug: add-dependencies
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/simple-asset-cleaner/docs/add-dependencies/
lang: zh
translationKey: doc:simple-asset-cleaner:add-dependencies
---

## 提交时自动添加未控制依赖

提交 changelist 时，插件会自动检测待提交资产的依赖关系。若依赖文件尚未纳入版本控制，会在弹窗中列出。用户勾选需要添加的依赖并确认后，插件会将其自动添加到版本控制。

- **触发时机**：提交 changelist 时自动执行
- **检测内容**：待提交资产所依赖的、尚未纳入版本控制的文件
- **操作方式**：弹窗显示未控制依赖列表，用户勾选确认后添加
- **开关控制**：可在设置中通过"Enable Auto Add Dependencies / 启用自动添加依赖"开关控制是否启用

---

### 添加未控制依赖

检查选中资产的依赖关系，找出未纳入版本控制的文件，弹窗列出后由用户确认添加。

- 支持选中单个/多个文件或文件夹

> 右键菜单可精确处理选中范围，适合在日常开发中清理特定目录或资产、检查依赖。

---

#### Enable Auto Add Dependencies / 启用自动添加依赖
- **默认**：开启
- **功能**：提交时自动检测未纳入版本控制的依赖文件
- **行为**：弹窗列出未控制依赖，用户勾选确认后添加
- **建议**：日常使用保持开启，避免遗漏依赖导致其他成员构建失败

### 自动添加依赖

| 依赖状态 | 处理方式 |
|---------|---------|
| 已纳入版本控制 | 无需处理 |
| 未纳入版本控制 | 在确认对话框中列出，由用户选择需要添加的文件 |

---
