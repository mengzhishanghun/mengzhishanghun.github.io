---
title: 检查并修正文件名大小写
type: doc
slug: p4-case-sync-check-and-fix
draft: false
sitePublish: true
tags:
  - Perforce
  - 版本控制
workIds:
  - p4-case-sync
docPage:
  work: p4-case-sync
  group: features
  slug: check-and-fix
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/p4-case-sync/docs/check-and-fix/
lang: zh
translationKey: doc:p4-case-sync:check-and-fix
---

## 路径检查与颜色标记

工具用 `p4 opened` 读取待提交文件，再用 `p4 where` 找到它们在本地工作区中的位置，逐级比较路径的实际大小写。列表只显示 `edit / add / move/add`，删除类动作不会出现。

- **灰色**：更改前后相同，无需修改。
- **绿色**：更改后路径与更改前不同，并且与自动建议一致。
- **红色**：手动编辑后的路径与自动建议不同。

## 列表显示

- 顶部有**颜色说明**与“仅显示需要修改的文件”开关  
- 列表行显示“更改前 / 更改后”，双击整行可在弹窗中编辑“更改后”，编辑后颜色立即刷新。

## 核对并应用路径变更

1. 打开工具，选择需要处理的 **Changelist**，默认是 `default`。
2. 核对 **更改前** 和 **更改后**。如果要调整，双击整行，在弹窗中修改目标路径。
3. 确认列表后点击 **应用修改**。工具依次执行 `p4 move` 并复核一致性；如不一致，会先移动到临时名称，再移到目标名称，然后重新校验；仍不一致时标记为失败。
4. 检查 changelist 中留下的变更，再按正常流程在 P4V 或命令行提交。

## 显示与路径异常

- **本地路径不存在**：工具逐级纠正到可访问的最深父目录，其余部分保留原样，可手动调整。
- **显示 “X” 而非 “✔”**：图标随系统主题变化；工具优先用 Windows 的 `vista/xpnative` 主题，也可改用自定义图标。
- **刷新后的灰条或残影**：刷新列表时会移除旧分隔线。
