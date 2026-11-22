---
title: Prepare the Runtime Environment
type: doc
slug: p4-case-sync-setup
draft: false
sitePublish: true
tags:
  - Perforce
  - Version Control
workIds:
  - p4-case-sync
documentKind: product-manual
websiteRoute: /en/works/p4-case-sync/docs/setup/
lang: en
translationKey: doc:p4-case-sync:setup
sourceHash: 5576811874d11eabcce5e522b29b650c99d42316a6baf0b7a2360345353c0fcd
translationStatus: translated
generatedBodyHash: ed5bdc84ab901a5e95351af496508567f07e6a3c0ded1cfb01ec8a4b008264fb
docPage:
  work: p4-case-sync
  group: setup
  slug: setup
  order: 1
---

## Requirements

- Windows (recommended)  
- Python 3.8+  
- Installed **Perforce CLI** `p4`, available from the command line  
- Tkinter (included with Python)  
- PyInstaller (optional for development/packaging)

## Get the Source

Replace the `<your-org-or-user>` placeholder with the repository owner before running the example.

```bash
git clone https://github.com/<your-org-or-user>/P4CaseSync.git
cd P4CaseSync
```

## Install Dependencies

Choose either environment below. Running the tool only requires Python’s standard library and the `p4` CLI. PyInstaller is for building the EXE.

## Set Up with Conda

```bash
# 新建环境（示例用 python 3.11）
conda create -n p4casesync python=3.11 -y
conda activate p4casesync

# 安装打包所需（运行本工具本身无需第三方包；打包需要 PyInstaller）
pip install -r requirements.txt
# 如果你没有 requirements.txt，可先： pip install pyinstaller
```

## Set Up with venv and pip

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

> Note: Running the project requires only the standard library and `p4`; `requirements.txt` generally needs only `pyinstaller` for packaging.  
> If the file is missing, create one containing only:  
> ```
> pyinstaller>=6
> ```

## Start the Tool

```bash
# 在激活环境下
python Main.py
```
