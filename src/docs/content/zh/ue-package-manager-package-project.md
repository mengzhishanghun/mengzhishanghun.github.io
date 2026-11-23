---
title: 用图形界面和命令行打包
type: doc
slug: ue-package-manager-package-project
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
  group: features
  slug: package-project
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/ue-package-manager/docs/package-project/
lang: zh
translationKey: doc:ue-package-manager:package-project
---

## 图形界面打包

![](/media-occurrence/doc%3Aue-package-manager%3Apackage-project%3Amedia%3A1)

先核对界面顶部显示的项目目录和 UE 目录，再选择 Archive 输出目录及构建类型。输出目录不能是项目根目录。可选类型为 `DebugGame`、`Development`、`Test` 或 `Shipping`；`Shipping` 还会启用压缩。点击“开始打包”后，在界面下方的日志区查看进度和结果。

## 命令行打包与完整命令示例

先运行 `validate` 检查配置，再用 `package --dry-run` 预览 UAT 命令。确认命令无误后，去掉 `--dry-run` 开始打包。从项目根目录运行时可省略 `--project-root`。命令成功返回 `0`；参数、配置或执行出错时返回 `2`。

```bat
UEPackageManager.exe --version
UEPackageManager.exe config-show --project-root E:\Projects\MyGame
UEPackageManager.exe configure --project-root E:\Projects\MyGame --configuration Shipping --output E:\Builds\MyGame
UEPackageManager.exe copy-list --project-root E:\Projects\MyGame
UEPackageManager.exe copy-add --project-root E:\Projects\MyGame --source E:\Assets\Data --target-directory . --ignore README*.md --ignore Cache
UEPackageManager.exe copy-remove --project-root E:\Projects\MyGame --index 0
UEPackageManager.exe validate --project-root E:\Projects\MyGame
UEPackageManager.exe package --project-root E:\Projects\MyGame --dry-run
UEPackageManager.exe package --project-root E:\Projects\MyGame
```

## 支持的构建和操作范围

- 支持在 Windows 上打包 Win64 项目，可使用 Epic Launcher 引擎或手动指定的源码引擎。
- 不提供完整 `Debug` 构建（通常需要源码引擎），也不单独打包插件。
- 工具不会自动关闭 Unreal Editor、删除项目或输出目录，也不执行 Git、SVN 或 Perforce 操作。
