---
title: 从源码运行和构建
type: doc
slug: ue-package-manager-build-executable
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
  group: source
  slug: build-executable
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/ue-package-manager/docs/build-executable/
lang: zh
translationKey: doc:ue-package-manager:build-executable
---

## 从源码运行

```bat
conda env create -f environment.yml
conda activate UEPackageManager
cd /d E:\Projects\MyGame
python E:\Tools\UEPackageManager\Main.py
python E:\Tools\UEPackageManager\Main.py validate --project-root E:\Projects\MyGame
```

Windows也可双击 `Run.bat` 启动GUI，或使用 `CLI.bat` 运行命令。

## 构建单文件 EXE

```bat
Build.bat
```

构建只读取 `UEPackageManager.spec`，产物位于 `dist/UEPackageManager.exe`。该EXE保留CLI控制台，并在无参数GUI模式下自动隐藏控制台。
