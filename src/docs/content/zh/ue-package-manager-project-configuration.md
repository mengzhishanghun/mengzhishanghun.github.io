---
title: 管理项目打包配置
type: doc
slug: ue-package-manager-project-configuration
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
  group: packaging
  slug: project-configuration
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/ue-package-manager/docs/project-configuration/
lang: zh
translationKey: doc:ue-package-manager:project-configuration
---

## 按项目隔离配置

每个 `.uproject` 的配置根据其规范化绝对路径生成独立项目ID：

```text
%LOCALAPPDATA%/UEPackageManager/Projects/<项目ID>/config.json
```

项目路径、引擎目录、输出目录、打包类型和附加复制规则不会跨项目复用。GUI不读取“最近项目”，只绑定当前EXE或工作目录对应的项目；CLI无法从当前目录确定项目时必须显式传入 `--project-root`。

## 查看和更改设置

项目和 UE 目录在 GUI 中只读：工具根据当前目录的 `.uproject` 及其 `EngineAssociation` 识别。可从 GUI 选择输出目录和打包类型。用 CLI 的 `config-show` 查看设置，用 `configure` 修改；手动指定源码引擎也使用 CLI。
