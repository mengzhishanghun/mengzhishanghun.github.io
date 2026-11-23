---
title: 批量修改控件属性
type: doc
slug: mcp-umg-batch-migration
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-umg
docPage:
  work: mcp-umg
  group: features
  slug: batch-migration
  order: 4
documentKind: product-manual
websiteRoute: /zh/works/mcp-umg/docs/batch-migration/
lang: zh
translationKey: doc:mcp-umg:batch-migration
---

## 预检、执行与撤销

要批量修改现有控件的属性，先确认改动只涉及控件自身的值。先列出要改的资产、控件名和属性值，再读取每个目标的指纹。预检通过后还要核对目标清单；如果其间有人改过资产，重新读取指纹并预检。

`BatchSetWidgetProperties` 默认 `dryRun:true`。每个目标均须提供 `ExportWidgetSpec` 返回的 `expectedFingerprint`；任一指纹过期、目标重复或属性非法时，整个请求零改动。最多 16 个 WBP、256 个控件。

应用时，每个 WBP 各有一个 Undo 事务，改动留在内存中。工具不会自动编译或保存，也不支持修改 Slot、关系或树结构。写后会逐字段反射核验；异常时结果整体为 error，并逐包报告 `Applied`、`Failed` 或 `NotAttempted`，不执行跨包回滚。可对已应用包分别使用编辑器 Undo。全部目标本来已相同则报告 `NoChange`，不建立事务或弄脏包。

执行出错时，先按逐包结果确认哪些资产已经改动，再决定是否对这些资产分别撤销。修正问题后，只对仍需修改的目标重新读取指纹和预检。
