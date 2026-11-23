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
sourceHash: 69a394895d75308fa6123e270f0ce25a8f59801bf0df9614a5fcfd1c9aafd603
translationStatus: translated
generatedBodyHash: fb4e45e6c410af429cace09299ff9969faf4c2e9829a90947bf6509055ca9f42
docPage:
  work: p4-case-sync
  group: getting-started
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

Replace `<your-org-or-user>` with the actual repository owner, then run these commands to clone the source and enter the project directory.

```bash
git clone https://github.com/<your-org-or-user>/P4CaseSync.git
cd P4CaseSync
```

## Install Dependencies

Prepare an environment with either method below. The tool needs the Python standard library and a working `p4` command. You only need PyInstaller to build the EXE.

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

![P4CaseSync Perforce connection window](/media-occurrence/doc%3Ap4-case-sync%3Asetup%3Amedia%3A1)

Enter the server, user, and workspace, then click Connect (`连接`). The server address, demo user, and Game_Demo workspace shown here are examples; replace them with your own settings.
