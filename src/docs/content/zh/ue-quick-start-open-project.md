---
title: 识别、编译并启动 UE 工程
type: doc
slug: ue-quick-start-open-project
draft: false
sitePublish: true
tags:
  - UnrealEngine
  - 编译
  - 启动工具
workIds:
  - ue-quick-start
docPage:
  work: ue-quick-start
  group: setup
  slug: open-project
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/ue-quick-start/docs/open-project/
lang: zh
translationKey: doc:ue-quick-start:open-project
---

## 使用条件

在 Windows 上运行。使用前应在本机配置好编译环境，并至少成功运行过一次该项目。

## 编译并打开工程

1. 将 `UEBuildTool.exe` 放到项目根目录，与 `.uproject` 同级。
2. 双击运行，在日志窗口查看编译进度。
3. 编译成功后，工具默认自动打开工程。

## 工程与引擎识别

| 项目 | 来源 |
|------|------|
| 项目名称 | `.uproject` 文件名 |
| 引擎版本 | `.uproject` 中的 `EngineAssociation` |
| 引擎路径 | Windows 注册表 / Epic Games Launcher 配置 |

### UE4 和 UE5 编辑器

工具会自动检测对应版本的编辑器：
- UE5: `UnrealEditor.exe`
- UE4: `UE4Editor.exe`

### 源码引擎识别

工具会自动识别 `.uproject` 中的 GUID 格式引擎版本，并从注册表获取对应的引擎路径。

## 启动与编译排查

### 找不到 .uproject 文件

确认工具位于 UE 项目根目录。将 `UEBuildTool.exe` 或 `Main.py` + `Source/` 复制到 `.uproject` 所在目录。

### 找不到引擎安装路径

检查引擎的注册信息是否缺失。若使用 Launcher 版引擎，确认它通过 Epic Games Launcher 安装，并先尝试在 Launcher 中验证引擎文件；必要时重新安装。若使用源码引擎，核对 `.uproject` 中的 GUID 是否与注册表记录对应。

### 编译失败

查看日志窗口中的具体错误信息；需要协助时，把报错发给负责构建的同事。
