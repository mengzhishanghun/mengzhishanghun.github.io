---
title: 安装与启动
type: doc
slug: md-blog-packer-setup
draft: false
sitePublish: true
tags:
  - Markdown
  - 图片
workIds:
  - md-blog-packer
docPage:
  work: md-blog-packer
  group: getting-started
  slug: setup
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/md-blog-packer/docs/setup/
lang: zh
translationKey: doc:md-blog-packer:setup
---

## 创建 Conda 环境

如果要从源码运行，在 `environment.yml` 所在目录打开终端，用下面的命令创建 Conda 环境。

```bash
# 用 environment.yml 创建 conda 环境
conda env create -f environment.yml
```

## 启动工具

使用 EXE 时，双击 `MDBlogPacker.exe` 打开图形界面。从源码运行时，无参数启动 `Main.py` 会打开图形界面；传入参数则进入命令行模式。
