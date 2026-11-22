---
title: 回收与删除工作区
type: doc
slug: p4-stream-switcher-recycle-workspace
draft: false
sitePublish: true
tags:
  - Perforce
  - 版本控制
workIds:
  - p4-stream-switcher
docPage:
  work: p4-stream-switcher
  group: workflows
  slug: recycle-workspace
  order: 3
documentKind: product-manual
websiteRoute: /zh/works/p4-stream-switcher/docs/recycle-workspace/
lang: zh
translationKey: doc:p4-stream-switcher:recycle-workspace
---

## 工作区回收与删除

池满时按本机保存的使用时间戳选择最旧客户端。候选有已打开文件，或检测到 P4V 正在运行时，自动回收会停止；先检查并处理变更，必要时关闭 P4V 后再操作。不要为通过检查盲目撤销工作。

“删除工作区”是单独入口，会弹出确认并检查已打开文件；它不包含自动回收路径中的 P4V 运行检查，使用前自行关闭相关会话。删除的是服务器客户端及工具缓存记录，不是清空整个本地目录。

池管理限于当前用户、当前主机、符合命名规则的工作区。未登记到 Perforce 的本地修改仍需自行保护。
