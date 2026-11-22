---
title: 清理旧包
type: doc
slug: ue-package-manager-clean-old-packages
draft: false
sitePublish: true
tags:
  - UnrealEngine
  - 打包
  - 自动化
workIds:
  - ue-package-manager
docPage:
  work: ue-package-manager
  group: output
  slug: clean-old-packages
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/ue-package-manager/docs/clean-old-packages/
lang: zh
translationKey: doc:ue-package-manager:clean-old-packages
---

## 选择清理范围

在 GUI 中勾选“清理旧包”。勾选状态会随项目配置保存，但实际清理每次都需确认。命令行使用 `--clean-output` 请求在本次打包前清理。

工具只处理当前输出路径中识别到的旧包，不删除整个输出目录。切换输出路径后，不会清理原来的路径。
