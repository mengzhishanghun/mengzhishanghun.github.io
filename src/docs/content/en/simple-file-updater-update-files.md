---
title: Update Local Files from Configuration
type: doc
slug: simple-file-updater-update-files
draft: false
sitePublish: true
tags:
  - File updates
  - Automation
workIds:
  - simple-file-updater
documentKind: product-manual
websiteRoute: /en/works/simple-file-updater/docs/update-files/
lang: en
translationKey: doc:simple-file-updater:update-files
sourceHash: 9ffa24e2df8790cda51e4d82ace41341aca5f24e570e8216ff114606b5a40412
translationStatus: translated
generatedBodyHash: b3a9acaa340c53ee845b47f359104d3f9c26d7a7acfb7ff28271193238dbfdb3
docPage:
  work: simple-file-updater
  group: workflows
  slug: update-files
  order: 1
---

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
