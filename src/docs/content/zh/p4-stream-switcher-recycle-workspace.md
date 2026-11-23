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
  group: features
  slug: recycle-workspace
  order: 4
documentKind: product-manual
websiteRoute: /zh/works/p4-stream-switcher/docs/recycle-workspace/
lang: zh
translationKey: doc:p4-stream-switcher:recycle-workspace
---

## 自动回收与手动删除

工作区池上限至少为 1，默认 5。

池满时按本机保存的使用时间戳选择最旧客户端。候选有已打开文件，或检测到 P4V 正在运行时，自动回收会停止；先检查并处理变更，必要时关闭 P4V 后再操作。不要为通过检查盲目撤销工作。

手动删除前先关闭该工作区相关的 P4V 会话：“删除工作区”会要求确认并检查已打开文件，但不会像自动回收那样检查 P4V 是否正在运行。删除会移除服务器客户端和工具缓存记录，不会清空本地目录。

池管理限于当前用户、当前主机、符合命名规则的工作区。未登记到 Perforce 的本地修改仍需自行保护。
