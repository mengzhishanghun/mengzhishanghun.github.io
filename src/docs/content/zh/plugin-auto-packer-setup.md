---
title: 安装与启动
type: doc
slug: plugin-auto-packer-setup
draft: false
sitePublish: true
tags:
  - UnrealEngine
  - 插件
  - 打包
workIds:
  - plugin-auto-packer
docPage:
  work: plugin-auto-packer
  group: setup
  slug: setup
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/plugin-auto-packer/docs/setup/
lang: zh
translationKey: doc:plugin-auto-packer:setup
---

## 运行 EXE

1. 前往 Releases 页面下载 `UEPluginPacker.exe`
2. 放置到你的 Unreal 项目根目录（即包含 `.uproject` 的目录）
3. 双击运行即可，无需命令行和环境配置

## 从源码运行

1. 克隆本仓库
2. 安装 Python 3.8+（建议使用 Miniconda）
3. 安装依赖并运行：

```bash
conda env create -f environment.yml
conda activate UEPluginAutoPacker
pip install -r requirements.txt
python Main.py
```
