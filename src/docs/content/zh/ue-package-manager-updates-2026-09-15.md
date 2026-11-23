---
title: 2026-09-15
type: doc
slug: ue-package-manager-updates-2026-09-15
draft: false
sitePublish: true
tags:
  - 更新日志
workIds:
  - ue-package-manager
docPage:
  work: ue-package-manager
  group: changelog
  slug: updates-2026-09-15
  order: 79739085
documentKind: product-manual
websiteRoute: /zh/works/ue-package-manager/docs/updates-2026-09-15/
lang: zh
translationKey: doc:ue-package-manager:updates-2026-09-15
---

## v2.0.0

**破坏性变更：** GUI 移除了项目与引擎的选择按钮，两个目录均为只读，也不再读取最近项目。EXE 必须放在项目根目录，或从项目根目录启动。

- 工具从 EXE 所在目录或当前工作目录中的唯一 `.uproject` 自动识别项目。找不到项目时，GUI 禁用打包。
- 先用 `.uproject` 的 `EngineAssociation` 定位引擎。自动解析失败时，才使用通过 CLI 为当前项目保存的源码引擎路径。
- CLI 仍支持 `--project-root` 和 `--engine-root`。

EXE 未进行商业代码签名，可用附带的 SHA-256 文件核对下载完整性。

此版本已在 [GitHub Release](https://github.com/MZSH-Tools/UEPackageManager/releases/tag/v2.0.0) 发布。

## v1.2.0

GUI 新增打包前清理旧包的选项，每次清理前都会显示目标，并请你确认。CLI 新增 `--clean-output`，只对本次打包生效，不保存为项目默认值。

清理只检查开始打包时选中的输出路径，只删除能通过项目入口 EXE 识别的旧包。切换路径不会影响原输出目录；当前路径没有可识别旧包时，直接继续打包。工具拒绝清理项目根目录、盘符根目录、项目根的上级目录，以及当前输出路径之外的目录。

EXE 未进行商业代码签名，可用附带的 SHA-256 文件核对下载完整性。

此版本已在 [GitHub Release](https://github.com/MZSH-Tools/UEPackageManager/releases/tag/v1.2.0) 发布。

## v1.1.1

点击“停止”会通过 Windows Job Object 结束整棵 UAT 进程树，以免子进程继续运行、占用输出管道。

EXE 未进行商业代码签名，可用附带的 SHA-256 文件核对下载完整性。

此版本已在 [GitHub Release](https://github.com/MZSH-Tools/UEPackageManager/releases/tag/v1.1.1) 发布。

## v1.1.0

打包配置扩展为 `DebugGame`、`Development`、`Test` 和 `Shipping`，只有 `Shipping` 启用压缩。通常需要源码引擎的完整 `Debug` 不在选项中，一般的项目代码调试可选 `DebugGame`。附加文件和打包按钮合并到同一行。

EXE 未进行商业代码签名，可用附带的 SHA-256 文件核对下载完整性。

此版本已在 [GitHub Release](https://github.com/MZSH-Tools/UEPackageManager/releases/tag/v1.1.0) 发布。

## v1.0.1

修复双击启动 GUI 时仍留有黑色命令行窗口的问题。GUI 现在会隐藏共享控制台；CLI 带参数运行时仍会显示控制台和输出。

EXE 未进行商业代码签名，可用附带的 SHA-256 文件核对下载完整性。

此版本已在 [GitHub Release](https://github.com/MZSH-Tools/UEPackageManager/releases/tag/v1.0.1) 发布。

## v1.0.0

单文件 `UEPackageManager.exe` 支持 Windows x64。双击打开 GUI，带参数进入 CLI，可打包 Win64 项目的 `Development` 和 `Shipping` 版本。

- 通过 `.uproject` 的 `EngineAssociation` 定位 Launcher 引擎，也可手动指定源码引擎。每个 `.uproject` 独立保存项目路径、引擎、输出目录、打包类型和复制规则。
- UE 打包成功后，可将选定的文件或文件夹复制到包内指定子目录，并检查复制是否完整。复制目标限制在包根目录内，排除版本控制、IDE 缓存、`.trash` 和 Python 缓存目录。打包失败时不执行附加复制。
- 此版不执行 Git、SVN 或 Perforce 操作，不会自动关闭 Unreal Editor，也不会删除项目或输出目录。

EXE 未进行商业代码签名，可用附带的 SHA-256 文件核对下载完整性。

此版本已在 [GitHub Release](https://github.com/MZSH-Tools/UEPackageManager/releases/tag/v1.0.0) 发布。
