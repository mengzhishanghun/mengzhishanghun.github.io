---
title: 准备运行环境
type: doc
slug: p4-case-sync-setup
draft: false
sitePublish: true
tags:
  - Perforce
  - 版本控制
workIds:
  - p4-case-sync
docPage:
  work: p4-case-sync
  group: getting-started
  slug: setup
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/p4-case-sync/docs/setup/
lang: zh
translationKey: doc:p4-case-sync:setup
---

## 运行要求

- Windows（推荐）  
- Python 3.8+  
- 已安装 **Perforce CLI** `p4`（命令行需要可用）  
- Tkinter（Python 自带）  
- （开发/打包选用）PyInstaller

## 获取源码

先将 `<your-org-or-user>` 替换为实际仓库所有者，再运行以下命令获取源码并进入项目目录。

```bash
git clone https://github.com/<your-org-or-user>/P4CaseSync.git
cd P4CaseSync
```

## 安装依赖

任选下面一种方式准备环境。运行工具需要 Python 标准库和可用的 `p4`；只有打包 EXE 时才需要 PyInstaller。

## 用 Conda 建立环境

```bash
# 新建环境（示例用 python 3.11）
conda create -n p4casesync python=3.11 -y
conda activate p4casesync

# 安装打包所需（运行本工具本身无需第三方包；打包需要 PyInstaller）
pip install -r requirements.txt
# 如果你没有 requirements.txt，可先： pip install pyinstaller
```

## 用 venv 和 pip 建立环境

```bash
# Windows PowerShell
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt

# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

> 说明：项目运行仅依赖标准库与 `p4` 命令；`requirements.txt` 一般只需要记录 `pyinstaller`（用于打包）。  
> 如果你没有该文件，可创建一个只包含：  
> ```
> pyinstaller>=6
> ```

## 启动工具

```bash
# 在激活环境下
python Main.py
```
