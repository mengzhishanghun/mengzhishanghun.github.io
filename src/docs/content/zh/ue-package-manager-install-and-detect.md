---
title: 下载与识别项目
type: doc
slug: ue-package-manager-install-and-detect
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
  group: getting-started
  slug: install-and-detect
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/ue-package-manager/docs/install-and-detect/
lang: zh
translationKey: doc:ue-package-manager:install-and-detect
---

## 下载并运行 UEPackageManager

从 [Releases](https://github.com/MZSH-Tools/UEPackageManager/releases/latest) 下载 `UEPackageManager.exe`。如果准备双击启动，先把它放到包含 `.uproject` 的项目根目录。

- 不带参数双击 EXE：隐藏控制台并打开图形界面。
- 在终端中带子命令运行：保留控制台和命令行输出。
- 将 EXE 放在包含 `.uproject` 的项目根目录并双击；项目与关联引擎会自动识别，GUI 中不可选择或修改。
- 从项目根目录的终端启动同样会自动识别；EXE 放在其他目录时，GUI 会拒绝打包并提示正确位置。
- 当前 EXE 未进行商业代码签名；Windows 首次运行可能显示 SmartScreen 提示，可使用 Release 附带的 SHA-256 文件核对下载完整性。

[开始打包](/zh/works/ue-package-manager/docs/package-project/)
