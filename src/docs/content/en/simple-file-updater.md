---
title: SimpleFileUpdater User Guide
description: Complete product user guide for SimpleFileUpdater
type: doc
slug: simple-file-updater
categoryId: open-source-tools
categoryName: Open-source tools
categoryOrder: 1
draft: false
sitePublish: true
tags:
  - File updates
  - Automation
workIds:
  - simple-file-updater
documentKind: product-manual
websiteRoute: /docs/zh/tools/simple-file-updater/
lang: en
translationKey: simple-file-updater
sourceHash: b954ec8b8d61e0c48a24924f8d6c4112a4fd18054e799b9575cc0e2c8193eb6c
translationStatus: translated
generatedBodyHash: efd1e9b7701c77c9dfdfeecac9920fa4f4da88321f3dcbd5885796d324ba9c88
---

# SimpleFileUpdater User Guide (Local Key-Value Version)

SimpleFileUpdater is a lightweight file synchronization tool for users who want to update local files in batches from remote addresses. It is packaged as `SimpleFileUpdater.exe` and supports a configuration file that defines target files and their download URLs.

---

## 🧩 Configuration File

The default configuration file is **`.SimpleFileUpdater`**, with the following format:

```
# 每行一个映射：本地路径 = 远程 URL
Tools\MyTool.exe = https://example.com/releases/MyTool.exe
Docs\Manual.pdf  = https://cdn.example.com/docs/Manual.pdf
```
- Supports relative or absolute paths
- Automatically creates the required folders
- Supports comments beginning with `#`

---

## 🚀 How to Run

Place `SimpleFileUpdater.exe` and `.SimpleFileUpdater` in the same directory, then:

- **Double-click `SimpleFileUpdater.exe`** to automatically read the configuration and synchronize the required files
- Or run it from the command line:

```bash
SimpleFileUpdater.exe MyConfig.txt
```
After execution, the program remains in the console and waits for you to press Enter to view the results.

---

## 🧪 Running from Source (For Developers or Unpackaged Use)

The project provides two ways to set up the runtime environment in one step:

### Method 1: Conda (Recommended)

```bash
conda env create -f environment.yml
conda activate SimpleFileUpdater
python Main.py
```
### Method 2: pip

```bash
pip install -r requirements.txt
python Main.py
```
---

## 📄 License

The project includes the following license:

```
(The following content is read automatically from LICENSE. Please refer to the LICENSE file in the project root.)
```

---

## ⚠️ Disclaimer

This is a personal utility project. You assume the risks associated with using this tool.  
Check the reliability and security of remote file URLs yourself. The program may overwrite local files with the same names, so back them up beforehand.

---

Local file synchronization has never been this simple. Enjoy!
