---
title: 准备运行
type: doc
slug: simple-file-updater-setup
draft: false
sitePublish: true
tags:
  - 文件更新
  - 自动化
workIds:
  - simple-file-updater
docPage:
  work: simple-file-updater
  group: getting-started
  slug: setup
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/simple-file-updater/docs/setup/
lang: zh
translationKey: doc:simple-file-updater:setup
---

## 使用 EXE

将 `SimpleFileUpdater.exe` 和默认的 `.SimpleFileUpdater` 配置文件放在同一目录。

## 从源码运行

从源码启动时，在 `Main.py` 所在的项目目录打开终端。按下面任一方式安装依赖，再运行 `Main.py`。

## 用 Conda

```bash
conda env create -f environment.yml
conda activate SimpleFileUpdater
python Main.py
```

## 用 pip

```bash
pip install -r requirements.txt
python Main.py
```
