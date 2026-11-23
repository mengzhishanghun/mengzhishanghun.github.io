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
  group: features
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

在 GUI 中，项目与 UE 目录只读。工具根据当前目录中的 `.uproject` 及其 `EngineAssociation` 识别这两项。可以在 GUI 中设定输出目录和打包类型；在 CLI 中用 `config-show` 查看设置，用 `configure` 修改。要手动指定源码引擎，请使用 CLI。
